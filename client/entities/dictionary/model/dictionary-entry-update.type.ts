import { PartOfSpeechEnum } from "./part-of-speech.type";

export interface IDictionaryEntryUpdate {
  term?: string;
  translation?: string;
  transcription?: string;
  partOfSpeech?: PartOfSpeechEnum;
  // Empty clears it; nouns only
  article?: string;
  grammarInfo?: string;
  example?: string;
  exampleTranslation?: string;
  note?: string;
  synonyms?: string[];
  isArchived?: boolean;
}
