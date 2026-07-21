"use client";

import { FC, useState } from "react";
import { ContainerColumn, ContainerRow, Subtitle, TextArea } from "@/shared/ui";
import { Button } from "@/shared/radix-ui/Button/button";
import { motion } from "framer-motion";
import { IResultRequest, useAttemptSubmitAnswer } from "@/entities/attempt";
import { useForm } from "react-hook-form";
import { Separator } from "@/shared";

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
    >
      <ContainerColumn>
        <ContainerRow blockStyles="items-center">
          <span className="text-xl font-bold">{index}.</span>
          <Subtitle text={title} />
        </ContainerRow>
        {answers && answers.length > 0 && (
          <div className="mb-3 rounded-2xl bg-emerald-100 p-3">
            <p className="font-semibold">Saved answers</p>

            {answers.map((answer, index) => (
              <p key={index} className="mt-1 pl-3">
                * {answer}
              </p>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div>
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
      </ContainerColumn>
    </motion.div>
  );
};
