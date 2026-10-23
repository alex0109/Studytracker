import { IFlashcardProgress } from "./flashcard-progress.type";
import { FlashcardRatingEnum } from "./flashcard-rating.type";

export interface IFlashcardReviewResponse {
  id: string;
  sessionId?: string;
  entryId: string;
  rating: FlashcardRatingEnum;
  reviewedAt: Date;
  progress?: IFlashcardProgress;
}
