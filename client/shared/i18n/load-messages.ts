import type { Language } from "./config";
import type { TranslationResource } from "./resources";

// One language per file: the browser fetches another one only when the user switches to it
export const loadMessages = async (language: Language): Promise<TranslationResource> =>
  (await import(`./locales/${language}.json`)).default;
