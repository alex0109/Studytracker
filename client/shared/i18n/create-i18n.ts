import { createInstance, type i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE, type Language } from "./config";
import { resources } from "./resources";

export const createI18n = (language: Language): i18n => {
  const instance = createInstance();

  instance.use(initReactI18next).init({
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    resources,
    // React escapes values itself
    interpolation: { escapeValue: false },
    initAsync: false,
    returnNull: false,
  });

  return instance;
};
