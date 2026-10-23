"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { QuestionTypeEnum, questionTypeLabels } from "@/entities/question";
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
const unselectedStyles = "bg-neutral-200 text-neutral-700";

export const QuestionCreateModal: FC<QuestionCreateModalProps> = ({
  materialId,
  noteId,
  open,
  setOpen,
}) => {
  const [questionType, setQuestionType] = useState<QuestionTypeEnum>(
    QuestionTypeEnum.Open,
  );

  // Hidden fields of other question types must not be validated
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IQuestionCreateForm>({
    defaultValues: QUESTION_CREATE_DEFAULTS,
    shouldUnregister: true,
  });

  const correctOptionIndex = watch("correctOptionIndex");
  const isTrue = watch("isTrue");

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
      const correctIndex = Number(values.correctOptionIndex);

      createOptionsQuestion({
        ...base,
        options: values.options.map((option, index) => ({
          name: option.name.trim(),
          isCorrect: index === correctIndex,
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
          <Title text="Add new Question" />
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
                {questionTypeLabels[type]}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col">
            <CustomInput
              label="Title"
              inputBlockStyles="text-center"
              placeholder={
                questionType === QuestionTypeEnum.TrueFalse
                  ? "*Statement to check..."
                  : "*Title..."
              }
              maxLength={100}
              {...register<"title">("title", {
                required: "Required",
                validate: (value) => value.trim().length > 0 || "Required",
              })}
              error={errors.title?.message}
            />
            <div className="flex flex-col justify-center bg-gray-100 dark:bg-neutral-700 rounded-2xl m-2 p-3">
              <select {...register("questionDifficulty")} className="p-2">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {questionType === QuestionTypeEnum.Open && (
              <TextArea
                label="Answer"
                inputStyles="h-[300px] p-5"
                placeholder="*Type your answer to Question here but remember 1000 symbols max..."
                maxLength={1000}
                {...register<"answer">("answer", {
                  required: "Required",
                })}
                error={errors.answer?.message}
              />
            )}

            {questionType === QuestionTypeEnum.Options && (
              <>
                <input
                  type="hidden"
                  {...register("correctOptionIndex", { valueAsNumber: true })}
                />
                <QuestionOptionsFields
                  control={control}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  correctOptionIndex={correctOptionIndex}
                />
              </>
            )}

            {questionType === QuestionTypeEnum.TrueFalse && (
              <div className="flex flex-col m-2 gap-2">
                <span className="text-sm text-neutral-500">
                  This statement is
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
                      {value ? "True" : "False"}
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
                  Create
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
