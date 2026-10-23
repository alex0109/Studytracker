export interface IResultResponse {
  id: string;
  attemptId: string;
  questionId: string;
  userAnswer: string;
  userAnswerOptionIds: string[];
  isCorrect: boolean;
  // Partial credit for questions with several correct options, 0..100
  score: number;
  confidenceLevel?: string;
  // FSRS rating of the answer: Again, Hard, Good or Easy
  rating?: string;
  // Filled for option and true/false questions
  correctOptionIds?: string[];
  answerChangedCount?: number;
  timeSpent: number;
  answeredAt: Date;
}
