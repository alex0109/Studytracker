import { FC } from "react";
import { ResultQuestion } from "../ResultQuestion/result-question";
import { IQuestionReduced } from "@/entities/question";
import { IResultResponse } from "@/entities/attempt";

interface ResultsQuestionsProps {
  questions: IQuestionReduced[];
  results: IResultResponse[];
}

export const ResultQuestionList: FC<ResultsQuestionsProps> = ({
  questions,
  results,
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
    </div>
  );
};
