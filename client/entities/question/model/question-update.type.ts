import { IOption } from "./option.type";

export interface IQuestionUpdate {
  title?: string;
  answer?: string;
  correctOptionId?: string;
  options?: IOption[];
  questionDifficulty?: string;
  explanation?: string;
}
