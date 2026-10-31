import { IConfidenceLevel } from "./confidence-level";

export interface IResultRequest {
  questionId: string;
  userAnswer?: string;
  userAnswerOptionIds?: string[];
  confidenceLevel: IConfidenceLevel | undefined;
}
