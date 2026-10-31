import { FlashcardSessionModeEnum } from "./flashcard-session-mode.type";

export interface IFlashcardSessionCreate {
  mode: FlashcardSessionModeEnum;
  limit?: number;
  entryIds?: string[];
}
