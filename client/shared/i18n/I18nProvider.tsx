"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { createI18n } from "./create-i18n";
import type { Language } from "./config";
import type { TranslationResource } from "./resources";

interface I18nProviderProps {
  language: Language;
  // Texts of this language only, from the server
  messages: TranslationResource;
  children: ReactNode;
}

export const I18nProvider: FC<I18nProviderProps> = ({ language, messages, children }) => {
  const [i18n] = useState(() => createI18n(language, { [language]: { translation: messages } }));

  useEffect(() => {
    if (!i18n.hasResourceBundle(language, "translation")) i18n.addResourceBundle(language, "translation", messages);
    if (i18n.language !== language) i18n.changeLanguage(language);
  }, [i18n, language, messages]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
