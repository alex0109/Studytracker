import { PartOfSpeechEnum } from "./part-of-speech.type";

export interface IDictionaryEntryResponse {
  id: string;
  dictionaryId: string;
  term: string;
  translation: string;
  transcription?: string;
  partOfSpeech?: PartOfSpeechEnum;
  grammarInfo?: string;
  example?: string;
  exampleTranslation?: string;
  note?: string;
  synonyms: string[];
  position: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
