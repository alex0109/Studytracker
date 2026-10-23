import { FlashcardAnswerEnum } from "./flashcard-answer";

export interface IDeckAnswer {
  answer: FlashcardAnswerEnum;
  reviewId: string;
}
