import { IOption } from "./option.type";

export interface IOptionsQuestionRequest {
  materialId: string;
  title: string;
  correctOptionId: string;
  questionDifficulty: string;
  options: IOption[];
  explanation?: string;
}
