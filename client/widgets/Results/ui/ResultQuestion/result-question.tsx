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

  const optionName = (optionId?: string) =>
    options.find((option) => option.id === optionId)?.name;

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
            {answer.isCorrect ? "Correct" : "Wrong"}
          </span>
          <p
            className={
              answer.isCorrect
                ? "bg-emerald-200 p-3 rounded-2xl"
                : "bg-red-200 p-3 rounded-2xl"
            }
          >
            {isChoice ? optionName(answer.userAnswerOptionId) : answer.userAnswer}
          </p>
          {isChoice && !answer.isCorrect && optionName(answer.correctOptionId) && (
            <p className="mt-2 text-sm text-neutral-500">
              Correct answer:{" "}
              <span className="font-semibold text-emerald-600">
                {optionName(answer.correctOptionId)}
              </span>
            </p>
          )}
        </div>
      ))}

      <Separator />
    </>
  );
};
