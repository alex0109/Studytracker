import type { IDictionaryEntryResponse } from "@/entities/dictionary/model";
import { FlashcardSessionModeEnum } from "./flashcard-session-mode.type";

export interface IFlashcardSessionResponse {
  id: string;
  // Null for a session of the whole "Today" queue
  dictionaryId: string | null;
  scope?: "Dictionary" | "Today";
  mode: FlashcardSessionModeEnum;
  cardsTotal: number;
  cards: IDictionaryEntryResponse[];
  startedAt: Date;
  finishedAt?: Date;
}
