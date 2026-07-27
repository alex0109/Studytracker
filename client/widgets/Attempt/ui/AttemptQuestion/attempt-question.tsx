"use client";

import { FC, useState } from "react";
import { ContainerColumn, ContainerRow, Subtitle, TextArea } from "@/shared/ui";
import { Button } from "@/shared/radix-ui/Button/button";
import { motion } from "framer-motion";
import { IResultRequest } from "@/entities/attempt";
import { useForm } from "react-hook-form";
import { Separator } from "@/shared";
import { useAttemptSubmitAnswer } from "@/features/attempt/submit-answer";

interface AttemptQuestionProps {
  questionId: string;
  attemptId: string;
  index: number;
  title: string;
  answers?: string[];
  onAnswered: (answer: string) => void;
}

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
    formState: { errors },
    handleSubmit,
  } = useForm<Partial<IResultRequest>>();

  const [textAreaVlaue, setTextAreaValue] = useState<string>("");

  const onFormSubmit = async (values: Partial<IResultRequest>) => {
    const answer = values.userAnswer ?? "";

    await submitAnswer({
      questionId,
      userAnswer: answer,
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
            value={textAreaVlaue}
            maxLength={1000}
            onChange={(e) => setTextAreaValue(e.target.value)}
            error={errors.userAnswer?.message}
          />
        </div>
        <Button size="lg" type="submit" className="self-end w-[150px]">
          Answer
        </Button>
      </form>
    </motion.div>
  );
};
