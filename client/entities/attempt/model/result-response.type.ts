export interface IResultResponse {
  id: string;
  attemptId: string;
  questionId: string;
  userAnswer: string;
  userAnswerOptionId: string;
  isCorrect: boolean;
  confidenceLevel?: string;
  answerChangedCount?: number;
  timeSpent: number;
  answeredAt: Date;
}
