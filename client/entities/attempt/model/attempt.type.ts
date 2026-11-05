import { IResultResponse } from "./result-response.type";

export interface IAttempt {
  id: string;
  assessmentId: string;
  attemptStatus: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalTimeSeconds: number;
  results: IResultResponse[];
  startedAt: Date;
  finishedAt?: Date;
  // The time limit this attempt was started with, null when it has none
  timeLimitMinutes?: number | null;
}
