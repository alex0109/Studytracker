import { FlashcardSessionModeEnum } from "./flashcard-session-mode.type";

export interface IFlashcardSessionSummary {
  id: string;
  dictionaryId: string;
  mode: FlashcardSessionModeEnum;
  cardsTotal: number;
  reviewed: number;
  again: number;
  hard: number;
  good: number;
  easy: number;
  startedAt: Date;
  finishedAt?: Date;
}
