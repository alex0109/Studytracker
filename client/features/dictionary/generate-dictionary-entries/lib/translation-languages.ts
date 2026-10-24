// Names in English, the server accepts any language name
export const TRANSLATION_LANGUAGES = [
  "Ukrainian",
  "English",
  "German",
  "French",
  "Spanish",
  "Italian",
  "Polish",
  "Portuguese",
  "Czech",
  "Japanese",
  "Chinese",
  "Korean",
];

// Language of the browser, so most users don't have to pick anything
export const getBrowserLanguage = (): string => {
  try {
    const code = navigator.language.split("-")[0];
    const name = new Intl.DisplayNames(["en"], { type: "language" }).of(code);

    return name && /^\p{L}[\p{L} -]{1,39}$/u.test(name) ? name : "English";
  } catch {
    return "English";
  }
};
