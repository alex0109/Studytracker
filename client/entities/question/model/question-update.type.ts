import { IOptionRequest } from "./option-request.type";
import { QuestionDifficultyEnum } from "./question-difficulty";

export interface IQuestionUpdate {
  title?: string;
  answer?: string;
  correctOptionId?: string;
  options?: IOptionRequest[];
  questionDifficulty?: QuestionDifficultyEnum;
  explanation?: string;
}
