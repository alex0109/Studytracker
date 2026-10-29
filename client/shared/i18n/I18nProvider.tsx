"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import moment from "moment";
import "moment/locale/uk";
import "moment/locale/nb";
import "moment/locale/en-gb";
import { createI18n } from "./create-i18n";
import type { Language } from "./config";

const MOMENT_LOCALES: Record<Language, string> = {
  "en-GB": "en-gb",
  nb: "nb",
  uk: "uk",
};

interface I18nProviderProps {
  language: Language;
  children: ReactNode;
}

export const I18nProvider: FC<I18nProviderProps> = ({ language, children }) => {
  const [i18n] = useState(() => createI18n(language));

  // Dates written with moment follow the language too
  moment.locale(MOMENT_LOCALES[language]);

  useEffect(() => {
    if (i18n.language !== language) i18n.changeLanguage(language);
  }, [i18n, language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
