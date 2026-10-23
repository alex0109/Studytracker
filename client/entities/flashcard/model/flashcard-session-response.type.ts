import type { IDictionaryEntryResponse } from "@/entities/dictionary/model";
import { FlashcardSessionModeEnum } from "./flashcard-session-mode.type";

export interface IFlashcardSessionResponse {
  id: string;
  dictionaryId: string;
  mode: FlashcardSessionModeEnum;
  cardsTotal: number;
  cards: IDictionaryEntryResponse[];
  startedAt: Date;
  finishedAt?: Date;
}
