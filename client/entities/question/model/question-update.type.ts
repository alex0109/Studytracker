import { IOption } from "./option.type";

export interface IQuestionUpdate {
  title?: string;
  asnwer?: string;
  correctOptionId?: string;
  options?: IOption[];
  questionDifficulty?: string;
  explanation?: string;
}
