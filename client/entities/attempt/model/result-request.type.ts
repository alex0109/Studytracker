import { IConfidenceLevel } from "./confidence-level";

export interface IResultRequest {
  questionId: string;
  userAnswer?: string;
  userAnswerOptionId?: string;
  confidenceLevel: IConfidenceLevel | undefined;
}
