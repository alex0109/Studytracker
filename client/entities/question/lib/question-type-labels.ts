import { QuestionTypeEnum } from "../model";

// Translation keys under "questions.types"
export const questionTypeKeys = {
  [QuestionTypeEnum.Open]: "open",
  [QuestionTypeEnum.Options]: "options",
  [QuestionTypeEnum.Flashcard]: "flashcard",
  [QuestionTypeEnum.TrueFalse]: "trueFalse",
} as const satisfies Record<QuestionTypeEnum, string>;

// True/False options are stored as "True"/"False", they are shown in the user's language
export const isTrueFalseName = (name: string): name is "True" | "False" =>
  name === "True" || name === "False";
