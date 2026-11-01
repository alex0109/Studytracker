import { cookies, headers } from "next/headers";
import {
  isLanguage,
  LANGUAGE_COOKIE,
  languageFromAcceptHeader,
  type Language,
} from "./config";
import { createI18n } from "./create-i18n";
import { resources } from "./resources";

// Language of the current request: the saved choice, or the browser's language on the first visit
export const getServerLanguage = async (): Promise<Language> => {
  const saved = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  if (isLanguage(saved)) return saved;

  return languageFromAcceptHeader((await headers()).get("accept-language"));
};

// Texts of one language for the browser: the other two don't travel with every page
export const getServerMessages = (language: Language) => resources[language].translation;

export const getServerT = async () => {
  const language = await getServerLanguage();
  const i18n = createI18n(language, resources);

  return { t: i18n.t, language };
};
