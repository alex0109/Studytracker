import { FC } from "react";
import { Separator } from "@/shared/radix-ui";
import { Subtitle } from "@/shared/ui";
import { IResultResponse } from "@/entities/attempt";
import { IOption, QuestionTypeEnum } from "@/entities/question";
import { cn } from "@/shared/lib";

interface ResultQuestionProps {
  title: string;
  questionType: QuestionTypeEnum;
  options?: IOption[];
  answers: IResultResponse[];
}

export const ResultQuestion: FC<ResultQuestionProps> = ({
  title,
  questionType,
  options = [],
  answers,
}) => {
  const isChoice =
    questionType === QuestionTypeEnum.Options ||
    questionType === QuestionTypeEnum.TrueFalse;

  const optionNames = (optionIds: string[] = []) =>
    options
      .filter((option) => optionIds.includes(option.id))
      .map((option) => option.name)
      .join(", ");

  return (
    <>
      <div className="flex w-full justify-start items-center my-4">
        <Subtitle text={title} />
      </div>

      {answers.map((answer, index) => (
        <div key={answer.id} className="my-4">
          <p className="text-neutral-500 text-sm">Answer {index + 1}</p>
          <span
            className={cn(
              `font-semibold`,
              answer.isCorrect ? "text-emerald-500" : "text-red-500",
            )}
          >
            {answer.isCorrect
              ? "Correct"
              : isChoice && answer.score > 0
                ? `Partly correct (${Math.round(answer.score)}%)`
                : "Wrong"}
          </span>
          <p
            className={
              answer.isCorrect
                ? "bg-emerald-200 p-3 rounded-2xl"
                : "bg-red-200 p-3 rounded-2xl"
            }
          >
            {isChoice
              ? optionNames(answer.userAnswerOptionIds)
              : answer.userAnswer}
          </p>
          {isChoice &&
            !answer.isCorrect &&
            optionNames(answer.correctOptionIds) && (
              <p className="mt-2 text-sm text-neutral-500">
                Correct answer:{" "}
                <span className="font-semibold text-emerald-600">
                  {optionNames(answer.correctOptionIds)}
                </span>
              </p>
            )}
        </div>
      ))}

      <Separator />
    </>
  );
};
