export interface IAssessment {
  id: string;
  materialId: string;
  totalQuestion?: number;
  correctAnswers?: number;
  score?: number;
  startedAt: Date;
  finishedAt?: Date;
}
