export const LANGUAGES = ["en-GB", "nb", "uk"] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en-GB";

export const LANGUAGE_COOKIE = "lang";

// Shown in the switcher in the language itself
export const LANGUAGE_LABELS: Record<Language, { short: string; name: string }> = {
  "en-GB": { short: "EN", name: "English" },
  nb: { short: "NO", name: "Norsk (bokmål)" },
  uk: { short: "UA", name: "Українська" },
};

export const isLanguage = (value: unknown): value is Language =>
  typeof value === "string" && (LANGUAGES as readonly string[]).includes(value);

// First visit: the browser's preferred language when the site has it
export const languageFromAcceptHeader = (header: string | null): Language => {
  if (!header) return DEFAULT_LANGUAGE;

  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase());

  for (const code of preferred) {
    if (code.startsWith("uk")) return "uk";
    if (code.startsWith("nb") || code.startsWith("no") || code.startsWith("nn")) {
      return "nb";
    }
    if (code.startsWith("en")) return "en-GB";
  }

  return DEFAULT_LANGUAGE;
};
