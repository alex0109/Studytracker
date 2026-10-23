import { QuestionTypeEnum } from "@/entities/question";
import { IQuestionCreateForm } from "./model";

export const CREATABLE_QUESTION_TYPES = [
  QuestionTypeEnum.Open,
  QuestionTypeEnum.Options,
  QuestionTypeEnum.TrueFalse,
];

export const QUESTION_CREATE_DEFAULTS: IQuestionCreateForm = {
  title: "",
  questionDifficulty: "easy",
  answer: "",
  options: [{ name: "" }, { name: "" }],
  correctOptionIndex: 0,
  isTrue: true,
};
