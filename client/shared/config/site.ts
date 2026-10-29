import type { Language } from "@/shared/i18n/config";

export const SITE_NAME = "Studytracker";

// Absolute links in search results, previews and the sitemap. NEXT_PUBLIC_HOME is the
// address the app runs at; production must set it to the public domain
export const SITE_URL = (
  process.env.NEXT_PUBLIC_HOME || "https://studytracker.xyz"
).replace(/\/+$/, "");

// Open Graph wants territory-style locales
export const OG_LOCALES: Record<Language, string> = {
  "en-GB": "en_GB",
  uk: "uk_UA",
  nb: "nb_NO",
};

// Pages that only make sense to their owner: kept out of search results
export const NO_INDEX = { index: false, follow: false } as const;
