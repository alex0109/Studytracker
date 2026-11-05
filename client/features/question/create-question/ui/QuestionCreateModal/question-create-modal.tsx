"use client";

import { FC, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { LuCircleHelp } from "react-icons/lu";
import { QuestionTypeEnum, questionTypeKeys } from "@/entities/question";
import { useTranslation } from "@/shared/i18n";
import { IQuestionCreateForm } from "../../model";
import { ChoiceGroup, Field, FieldInput, FieldTextArea, Modal, Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { useOpenQuestionCreate } from "../../hooks/useOpenQuestionCreate";
import { useOptionsQuestionCreate } from "../../hooks/useOptionsQuestionCreate";
import { useTrueFalseQuestionCreate } from "../../hooks/useTrueFalseQuestionCreate";
import {
  CREATABLE_QUESTION_TYPES,
  QUESTION_CREATE_DEFAULTS,
} from "../../consts";
import { QuestionOptionsFields } from "./question-options-fields";

interface QuestionCreateModalProps {
  materialId: string;
  noteId?: string;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export const QuestionCreateModal: FC<QuestionCreateModalProps> = ({
  materialId,
  noteId,
  open,
  setOpen,
}) => {
  const { t } = useTranslation();
  const [questionType, setQuestionType] = useState<QuestionTypeEnum>(
    QuestionTypeEnum.Open,
  );

  // Hidden fields of other question types must not be validated
  const {
    register,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IQuestionCreateForm>({
    defaultValues: QUESTION_CREATE_DEFAULTS,
    shouldUnregister: true,
  });

  const isTrue = useWatch({ control, name: "isTrue" });

  const { createOpenQuestion, createOpenQuestionIsPending } =
    useOpenQuestionCreate(materialId, noteId);
  const { createOptionsQuestion, createOptionsQuestionIsPending } =
    useOptionsQuestionCreate(materialId, noteId);
  const { createTrueFalseQuestion, createTrueFalseQuestionIsPending } =
    useTrueFalseQuestionCreate(materialId, noteId);

  const isPending =
    createOpenQuestionIsPending ||
    createOptionsQuestionIsPending ||
    createTrueFalseQuestionIsPending;

  // Open with a spinner until it is saved, so the click shows and can't repeat
  const created = {
    onSuccess: () => {
      setOpen(false);
      reset(QUESTION_CREATE_DEFAULTS);
    },
  };

  const onFormSubmit = (values: IQuestionCreateForm) => {
    const base = {
      title: values.title.trim(),
      questionDifficulty: values.questionDifficulty,
    };

    if (questionType === QuestionTypeEnum.Options) {
      createOptionsQuestion({
        ...base,
        options: values.options.map((option) => ({
          name: option.name.trim(),
          isCorrect: option.isCorrect,
        })),
      }, created);
    } else if (questionType === QuestionTypeEnum.TrueFalse) {
      // Hidden input may hand the value back as a string
      createTrueFalseQuestion({
        ...base,
        isTrue: String(values.isTrue) === "true",
      }, created);
    } else {
      createOpenQuestion({ ...base, materialId, answer: values.answer }, created);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      size="lg"
      icon={<LuCircleHelp />}
      title={t("questions.addTitle")}
      footer={
        <>
          <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button size="lg" type="submit" form="create-question" disabled={isPending}>
            {isPending && <Spinner />}
            {t("common.create")}
          </Button>
        </>
      }
    >
      <form id="create-question" onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4" noValidate>
        <ChoiceGroup
          label={t("questions.generate.type")}
          value={questionType}
          onChange={setQuestionType}
          options={CREATABLE_QUESTION_TYPES.map((type) => ({
            value: type,
            label: t(`questions.types.${questionTypeKeys[type]}`),
          }))}
        />

        <Field
          label={questionType === QuestionTypeEnum.TrueFalse ? t("questions.statementLabel") : t("questions.titleLabel")}
          required
          error={errors.title?.message}
        >
          <FieldInput
            placeholder={
              questionType === QuestionTypeEnum.TrueFalse
                ? t("questions.statementPlaceholder")
                : t("questions.titlePlaceholder")
            }
            maxLength={100}
            aria-invalid={!!errors.title}
            {...register("title", {
              required: t("common.required"),
              validate: (value) => value.trim().length > 0 || t("common.required"),
            })}
          />
        </Field>

        {questionType === QuestionTypeEnum.Open && (
          <Field label={t("questions.answerLabel")} required error={errors.answer?.message}>
            <FieldTextArea
              placeholder={t("questions.answerPlaceholder")}
              maxLength={1000}
              rows={5}
              aria-invalid={!!errors.answer}
              {...register("answer", { required: t("common.required") })}
            />
          </Field>
        )}

        {questionType === QuestionTypeEnum.Options && (
          <QuestionOptionsFields control={control} register={register} errors={errors} />
        )}

        {questionType === QuestionTypeEnum.TrueFalse && (
          <>
            <ChoiceGroup
              label={t("questions.statementIs")}
              value={String(isTrue) === "true"}
              onChange={(value) => setValue("isTrue", value)}
              options={[
                { value: true, label: t("questions.true") },
                { value: false, label: t("questions.false") },
              ]}
            />
            <input type="hidden" {...register("isTrue")} />
          </>
        )}

        <Controller
          control={control}
          name="questionDifficulty"
          render={({ field }) => (
            <ChoiceGroup
              label={t("questions.difficultyLabel")}
              value={field.value}
              onChange={field.onChange}
              options={DIFFICULTIES.map((difficulty) => ({
                value: difficulty,
                label: t(`questions.difficulty.${difficulty}`),
              }))}
            />
          )}
        />
      </form>
    </Modal>
  );
};
