import { IOption } from "./option.type";

export interface IQuestionReduced {
  id: string;
  title: string;
  options?: IOption[];
}
