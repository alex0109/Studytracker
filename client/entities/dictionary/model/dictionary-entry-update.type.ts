import { PartOfSpeechEnum } from "./part-of-speech.type";

export interface IDictionaryEntryUpdate {
  term?: string;
  translation?: string;
  transcription?: string;
  partOfSpeech?: PartOfSpeechEnum;
  grammarInfo?: string;
  example?: string;
  exampleTranslation?: string;
  note?: string;
  synonyms?: string[];
  isArchived?: boolean;
}
