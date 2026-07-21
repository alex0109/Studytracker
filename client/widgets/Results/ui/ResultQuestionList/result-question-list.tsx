import { FC } from "react";
import { ResultQuestion } from "../ResultQuestion/result-question";
import { IQuestionReduced } from "@/entities/question";
import { IResultResponse } from "@/entities/attempt";
import { Button } from "@/shared/radix-ui";
import Link from "next/link";
import { authorizedLinks } from "@/shared";

interface ResultsQuestionsProps {
  questions: IQuestionReduced[];
  results: IResultResponse[];
  materialId: string;
}

export const ResultQuestionList: FC<ResultsQuestionsProps> = ({
  questions,
  results,
  materialId,
}) => {
  const questionsWithAnswers = questions.map((question) => ({
    ...question,
    answers: results.filter((result) => result.questionId === question.id),
  }));

  return (
    <div className="flex w-full flex-col">
      {questionsWithAnswers.map((question) => (
        <ResultQuestion
          key={question.id}
          title={question.title}
          answers={question.answers}
        />
      ))}
      <div className="flex my-5 w-full justify-center items-center">
        <Link href={`/materials/${materialId}`}>
          <Button size="lg" className="h-12 text-md rounded-2xl">
            Go to Material
          </Button>
        </Link>
      </div>
    </div>
  );
};
