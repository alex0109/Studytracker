"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  LANGUAGE_COOKIE,
  type Language,
} from "./config";

const YEAR_SECONDS = 60 * 60 * 24 * 365;

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const router = useRouter();

  const language: Language = isLanguage(i18n.language)
    ? i18n.language
    : DEFAULT_LANGUAGE;

  const setLanguage = async (next: Language) => {
    document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=${YEAR_SECONDS}; samesite=lax`;
    document.documentElement.lang = next;
    moment.locale(next === "en-GB" ? "en-gb" : next);
    await i18n.changeLanguage(next);
    // Server rendered parts read the cookie again
    router.refresh();
  };

  return { language, setLanguage };
};
