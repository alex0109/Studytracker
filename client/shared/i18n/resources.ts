import en from "./locales/en-GB.json";
import nb from "./locales/nb.json";
import uk from "./locales/uk.json";

// Every language, for the server. The browser gets only the current one from the layout
export const resources = {
  "en-GB": { translation: en },
  nb: { translation: nb },
  uk: { translation: uk },
} as const;

export type TranslationResource = typeof en;
