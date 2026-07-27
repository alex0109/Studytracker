import { IOption } from "./option.type";
import { QuestionTypeEnum } from "./question-type.type";

export interface IQuestionReduced {
  id: string;
  title: string;
  questionType: QuestionTypeEnum;
  options?: IOption[];
}
