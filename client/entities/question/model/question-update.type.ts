import { IOption } from "./option.type";
import { QuestionDifficultyEnum } from "./question-difficulty";

export interface IQuestionUpdate {
  title?: string;
  answer?: string;
  correctOptionId?: string;
  options?: IOption[];
  questionDifficulty?: QuestionDifficultyEnum;
  explanation?: string;
}
