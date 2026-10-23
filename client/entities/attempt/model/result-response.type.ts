export interface IResultResponse {
  id: string;
  attemptId: string;
  questionId: string;
  userAnswer: string;
  userAnswerOptionId: string;
  isCorrect: boolean;
  confidenceLevel?: string;
  // FSRS rating of the answer: Again, Hard, Good or Easy
  rating?: string;
  // Filled for option and true/false questions
  correctOptionId?: string;
  answerChangedCount?: number;
  timeSpent: number;
  answeredAt: Date;
}
