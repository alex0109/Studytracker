import { PartOfSpeechEnum } from "./part-of-speech.type";

// Form keeps synonyms as a comma separated string, api expects string[]
export interface IDictionaryEntryForm {
  term: string;
  translation: string;
  transcription?: string;
  partOfSpeech?: PartOfSpeechEnum | "";
  // Shown and kept only for a noun
  article?: string;
  grammarInfo?: string;
  example?: string;
  exampleTranslation?: string;
  note?: string;
  synonyms?: string;
}
