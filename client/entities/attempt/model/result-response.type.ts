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
  // Model answer of an open question
  correctAnswer?: string | null;
  // Why the right answer is right, written with the question
  questionExplanation?: string | null;
  // How the answer was checked: Exact, Fuzzy, AI (accepted by meaning), Manual (accepted by the user) or None
  method?: string;
  // A rejected open answer the user may accept as right
  canAccept?: boolean;
  // When the user accepted it; undo works for a few minutes
  overriddenAt?: string | null;
  // AI explanation of a wrong answer, saved once it was asked for
  aiExplanation?: string | null;
  answerChangedCount?: number;
  timeSpent: number;
  answeredAt: Date;
}
