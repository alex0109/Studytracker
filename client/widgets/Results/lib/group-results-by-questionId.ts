import { IResultResponse } from "@/entities/attempt";
import { IQuestionReduced } from "@/entities/question";

export const groupResultsByQuestion = (
  questions: IQuestionReduced[],
  results: IResultResponse[],
) => {
  return questions.map((question) => ({
    ...question,
    answers: results.filter((result) => result.questionId === question.id),
  }));
};
