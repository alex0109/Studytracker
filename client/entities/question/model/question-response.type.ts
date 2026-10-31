import { IOption } from "./option.type";
import { QuestionDifficultyEnum } from "./question-difficulty";
import { QuestionTypeEnum } from "./question-type.type";
import { IQuestionProgress } from "./question-progress.type";

export interface IQuestionResponse {
  id: string;
  materialId: string;
  noteId?: string;
  title: string;
  answer?: string;
  questionType: QuestionTypeEnum;
  options: IOption[];
  questionDifficulty: QuestionDifficultyEnum;
  explanation?: string;
  version: number;
  isActive: boolean;
  createdAt: Date;
  finishedAt: Date;
  progress?: IQuestionProgress | null;
}
