import { IOptionRequest } from "./option-request.type";

export interface IOptionsQuestionRequest {
  noteId?: string;
  title: string;
  questionDifficulty: string;
  options: IOptionRequest[];
  explanation?: string;
}
