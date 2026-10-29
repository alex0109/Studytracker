import en from "./locales/en-GB.json";
import nb from "./locales/nb.json";
import uk from "./locales/uk.json";

// All languages are bundled: texts are small and switching is instant
export const resources = {
  "en-GB": { translation: en },
  nb: { translation: nb },
  uk: { translation: uk },
} as const;

export type TranslationResource = typeof en;
