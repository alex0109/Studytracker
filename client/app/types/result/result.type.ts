export interface IResult {
  id: string;
  assessmentId: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  answeredAt: Date;
}
