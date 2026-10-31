"use client";

import { FC, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { QuestionTypeEnum, questionTypeKeys } from "@/entities/question";
import { useTranslation } from "@/shared/i18n";
import { IQuestionCreateForm } from "../../model";
import {
  CustomInput,
  IsPendingLoader,
  Modal,
  TextArea,
  Title,
} from "@/shared/ui";
import { Button, Separator } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
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

const selectedStyles = "bg-emerald-700 text-white";
const unselectedStyles = "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";

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
      });
    } else if (questionType === QuestionTypeEnum.TrueFalse) {
      // Hidden input may hand the value back as a string
      createTrueFalseQuestion({
        ...base,
        isTrue: String(values.isTrue) === "true",
      });
    } else {
      createOpenQuestion({ ...base, materialId, answer: values.answer });
    }

    setOpen(false);
    reset(QUESTION_CREATE_DEFAULTS);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="lg:w-[800px] md:w-[600px] sm:w-[400px] w-[300px] max-h-[85vh] overflow-y-auto">
        <div className="flex flex-col w-full justify-center">
          <Title text={t("questions.addTitle")} />
          <Separator />
          <div className="flex gap-2 m-2 mt-4">
            {CREATABLE_QUESTION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setQuestionType(type)}
                className={cn(
                  "flex-1 rounded-xl py-2 text-sm font-medium",
                  questionType === type ? selectedStyles : unselectedStyles,
                )}
              >
                {t(`questions.types.${questionTypeKeys[type]}`)}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col">
            <CustomInput
              label={t("questions.titleLabel")}
              inputBlockStyles="text-center"
              placeholder={
                questionType === QuestionTypeEnum.TrueFalse
                  ? t("questions.statementPlaceholder")
                  : t("questions.titlePlaceholder")
              }
              maxLength={100}
              {...register<"title">("title", {
                required: t("common.required"),
                validate: (value) => value.trim().length > 0 || t("common.required"),
              })}
              error={errors.title?.message}
            />
            <div className="flex flex-col justify-center bg-neutral-100 dark:bg-neutral-700 rounded-2xl m-2 p-3">
              <select
                {...register("questionDifficulty")}
                aria-label={t("questions.difficultyLabel")}
                className="p-2 bg-transparent [&>option]:bg-white dark:[&>option]:bg-neutral-800"
              >
                <option value="easy">{t("questions.difficulty.easy")}</option>
                <option value="medium">{t("questions.difficulty.medium")}</option>
                <option value="hard">{t("questions.difficulty.hard")}</option>
              </select>
            </div>

            {questionType === QuestionTypeEnum.Open && (
              <TextArea
                label={t("questions.answerLabel")}
                inputStyles="h-[300px] p-5"
                placeholder={t("questions.answerPlaceholder")}
                maxLength={1000}
                {...register<"answer">("answer", {
                  required: t("common.required"),
                })}
                error={errors.answer?.message}
              />
            )}

            {questionType === QuestionTypeEnum.Options && (
              <QuestionOptionsFields
                control={control}
                register={register}
                errors={errors}
              />
            )}

            {questionType === QuestionTypeEnum.TrueFalse && (
              <div className="flex flex-col m-2 gap-2">
                <span className="text-sm text-neutral-500">
                  {t("questions.statementIs")}
                </span>
                <div className="flex gap-2">
                  {[true, false].map((value) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => setValue("isTrue", value)}
                      className={cn(
                        "flex-1 rounded-xl py-2 text-sm font-medium",
                        isTrue === value ? selectedStyles : unselectedStyles,
                      )}
                    >
                      {value ? t("questions.true") : t("questions.false")}
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register("isTrue")} />
              </div>
            )}

            <div className="flex w-full justify-center items-center my-4">
              <div className="flex-1" />
              <div className="flex flex-1 justify-center items-center">
                <Button
                  size="lg"
                  className="w-50"
                  type="submit"
                  disabled={isPending}
                >
                  {t("common.create")}
                </Button>
              </div>
              <div className="flex-1">
                <IsPendingLoader isPending={isPending} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
