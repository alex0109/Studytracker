// Target languages for word translations. The server gets the English name ("Ukrainian"),
// the user sees the name in the language of the site
export const TRANSLATION_LANGUAGE_CODES = [
  "uk",
  "en",
  "nb",
  "de",
  "fr",
  "es",
  "it",
  "pl",
  "pt",
  "cs",
  "ja",
  "zh",
  "ko",
] as const;

export const languageName = (code: string, displayLocale: string): string => {
  try {
    return new Intl.DisplayNames([displayLocale], { type: "language" }).of(code) ?? code;
  } catch {
    return code;
  }
};

// By default words are translated into the language the user reads the site in
export const defaultTranslationCode = (siteLanguage: string): string => {
  const code = siteLanguage.split("-")[0];
  return (TRANSLATION_LANGUAGE_CODES as readonly string[]).includes(code) ? code : "en";
};
