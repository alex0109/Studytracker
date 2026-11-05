import { IConfidenceLevel } from "./confidence-level";

export interface IResultRequest {
  questionId: string;
  userAnswer?: string;
  userAnswerOptionIds?: string[];
  confidenceLevel: IConfidenceLevel | undefined;
  // How many times the choice changed before this save: a sign of doubt
  answerChanges?: number;
}
