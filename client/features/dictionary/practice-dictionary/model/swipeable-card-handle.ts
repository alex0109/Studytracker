import { FlashcardAnswerEnum } from "./flashcard-answer";

export interface ISwipeableCardHandle {
  swipe: (answer: FlashcardAnswerEnum) => void;
}
