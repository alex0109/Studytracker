import axios from "axios";
import { PartOfSpeechEnum } from "../model";

export interface IWordLookupRequest {
  term: string;
  // The sentence the word was selected in
  sentence?: string;
  // Translation language; the profile's native language when empty
  language?: string;
}

// A suggestion only: nothing is saved
export interface IWordLookup {
  term: string;
  translation: string;
  transcription: string | null;
  partOfSpeech: PartOfSpeechEnum | null;
  grammarInfo: string | null;
  example: string | null;
  exampleTranslation: string | null;
  language: string;
  existingEntryId: string | null;
}

export const lookupDictionaryEntry = async (
  token: string | undefined,
  dictionaryId: string,
  body: IWordLookupRequest,
): Promise<IWordLookup> =>
  (
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/${dictionaryId}/entries/lookup`,
      body,
      { headers: { Authorization: `Bearer ${token}` } },
    )
  ).data;
