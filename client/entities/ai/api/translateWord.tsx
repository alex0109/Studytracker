import axios from "axios";

// Why no translation came: switched off, a Plus extra, the quota is used up, or AI is down
export type WordTranslationSkip = "Off" | "Plan" | "Quota" | "Unavailable";

export interface IWordTranslation {
  translation: string | null;
  skipped: WordTranslationSkip | null;
}

// A suggested translation for a word typed into a dictionary; never a 402, it is a quiet extra
export const translateWord = async (token: string | undefined, term: string, signal?: AbortSignal): Promise<IWordTranslation> =>
  (await axios.post(`${process.env.NEXT_PUBLIC_API_HTTP}/ai/translate`, { term }, { headers: { Authorization: `Bearer ${token}` }, signal })).data;
