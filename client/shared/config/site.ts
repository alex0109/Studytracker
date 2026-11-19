import type { Language } from "@/shared/i18n/config";

export const SITE_NAME = "Studytracker";

// The sole proprietorship behind the site, spelled as in Brønnøysundregistrene: payment
// providers check that the site names the registered business, and the privacy page the controller
export const OPERATOR = {
  name: "REYBEY SLIPOKUROV",
  // No-break spaces: the number stays on one line on a phone
  orgNumber: "938\u00A0843\u00A0058",
  email: "krossyouyub@gmail.com",
} as const;

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
