"use client";

import { FC } from "react";
import { Subtitle, TextArea } from "@/shared/ui";
import { Button } from "@/shared/radix-ui/Button/button";
import { motion } from "framer-motion";
import { IResultRequest } from "@/entities/attempt";
import { useForm } from "react-hook-form";
import { useAttemptSubmitAnswer } from "@/features/attempt/submit-answer";

interface AttemptQuestionProps {
  questionId: string;
  attemptId: string;
  index: number;
  title: string;
  answers?: string[];
  onAnswered: (answer: string) => void;
}

export enum IConfidenceLevel {
  "Low" = 0,
  "Medium" = 1,
  "High" = 2,
}

const CONFIDENCE_OPTIONS: { value: IConfidenceLevel; label: string }[] = [
  { value: IConfidenceLevel.Low, label: "Not sure" },
  { value: IConfidenceLevel.Medium, label: "Fairly sure" },
  { value: IConfidenceLevel.High, label: "Confident" },
];

export const AttemptQuestion: FC<AttemptQuestionProps> = ({
  questionId,
  attemptId,
  index,
  title,
  answers,
  onAnswered,
}) => {
  const { submitAnswer } = useAttemptSubmitAnswer(attemptId);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<Partial<IResultRequest>>();

  const selectedConfidence = watch("confidenceLevel");
  const textAreaValue = watch("userAnswer") ?? "";

  const onFormSubmit = async (values: Partial<IResultRequest>) => {
    const answer = values.userAnswer ?? "";

    await submitAnswer({
      questionId,
      userAnswer: answer,
      confidenceLevel: values.confidenceLevel,
    });

    onAnswered(answer);
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col w-full justify-center items-center"
    >
      <div className="flex w-full justify-start items-center">
        <span className="text-xl font-bold">{index}.</span>
        <Subtitle text={title} />
      </div>
      {answers && answers.length > 0 && (
        <div className="flex flex-col w-full mb-3 rounded-2xl bg-emerald-100 p-3">
          <p className="font-semibold">Saved answers</p>

          {answers.map((answer, index) => (
            <div key={index}>
              <p className="mt-1 pl-3">* {answer}</p>
            </div>
          ))}
        </div>
      )}
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col justify-center items-center w-full"
      >
        <div className="flex justify-center items-center w-full">
          <TextArea
            {...register<"userAnswer">("userAnswer", {
              required: "Required",
            })}
            placeholder="Write down what you remember about this question..."
            inputStyles="w-full h-[300px] p-5 bg-neutral-200"
            value={textAreaValue}
            maxLength={1000}
            error={errors.userAnswer?.message}
          />
        </div>

        <div className="flex flex-col w-full mt-3">
          <span className="text-sm text-neutral-500 mb-2">
            How confident are you in this answer?
          </span>
          <div className="flex gap-2">
            {CONFIDENCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue("confidenceLevel", option.value)}
                className={
                  selectedConfidence === option.value
                    ? "flex-1 rounded-xl py-2 text-sm font-medium bg-emerald-700 text-white"
                    : "flex-1 rounded-xl py-2 text-sm font-medium bg-neutral-200 text-neutral-700"
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          size="lg"
          type="submit"
          className="self-end w-[150px] bg-emerald-700 mt-4"
        >
          Answer
        </Button>
      </form>
    </motion.div>
  );
};
