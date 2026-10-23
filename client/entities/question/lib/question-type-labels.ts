import { QuestionTypeEnum } from "../model";

export const questionTypeLabels: Record<QuestionTypeEnum, string> = {
  [QuestionTypeEnum.Open]: "Open",
  [QuestionTypeEnum.Options]: "Options",
  [QuestionTypeEnum.Flashcard]: "Flashcard",
  [QuestionTypeEnum.TrueFalse]: "True / False",
};
