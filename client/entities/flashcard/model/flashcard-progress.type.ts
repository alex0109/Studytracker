import { FlashcardStateEnum } from "./flashcard-state.type";

export interface IFlashcardProgress {
  state: FlashcardStateEnum;
  due: Date;
  stability: number;
  difficulty: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  lastReviewAt?: Date;
}
