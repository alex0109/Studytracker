import { FC } from "react";
import { Separator } from "@/shared/radix-ui";
import { Subtitle } from "@/shared/ui";
import { IResultResponse } from "@/entities/attempt";
import { cn } from "@/shared/lib";

interface ResultQuestionProps {
  title: string;
  answers: IResultResponse[];
}

export const ResultQuestion: FC<ResultQuestionProps> = ({ title, answers }) => {
  return (
    <>
      <div className="flex w-full justify-start items-center my-4">
        <Subtitle text={title} />
      </div>

      {answers.map((answer, index) => (
        <div key={answer.id} className="my-4">
          <p className="text-neutral-400 text-sm">Answer {index + 1}</p>
          <span
            className={cn(
              `font-semibold`,
              answer.isCorrect ? "text-emerald-500" : "text-red-500",
            )}
          >
            {answer.isCorrect ? "Correct" : "Wrong"}
          </span>
          <p
            className={
              answer.isCorrect
                ? "bg-emerald-200 p-3 rounded-2xl"
                : "bg-red-200 p-3 rounded-2xl"
            }
          >
            {answer.userAnswer}
          </p>
        </div>
      ))}

      <Separator />
    </>
  );
};
