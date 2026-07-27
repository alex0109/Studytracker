import { IOption } from "./option.type";
import { QuestionTypeEnum } from "./question-type.type";

export interface IQuestionResponse {
  id: string;
  materialId: string;
  title: string;
  answer?: string;
  questionType: QuestionTypeEnum;
  correctOptionId?: string;
  options: IOption[];
  questionDifficulty: string;
  explanation?: string;
  version: number;
  isActive: boolean;
  createdAt: Date;
  finishedAt: Date;
}
