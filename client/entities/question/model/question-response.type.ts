import { IOption } from "./option.type";

export interface IQuestionResponse {
  id: string;
  materialId: string;
  title: string;
  asnwer?: string;
  questionType: string;
  correctOptionId?: string;
  options: IOption[];
  questionDifficulty: string;
  explanation?: string;
  version: number;
  isActive: boolean;
  createdAt: Date;
  finishedAt: Date;
}
