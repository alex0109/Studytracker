import { FlashcardRatingEnum } from "./flashcard-rating.type";

export interface IFlashcardReviewCreate {
  // Generated on the client, so retries do not create duplicates
  id: string;
  entryId: string;
  rating: FlashcardRatingEnum;
  durationMs?: number;
}
