import { createInstance, type i18n, type Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE, type Language } from "./config";

// Resources come from the caller: the server has every language, the browser only the one it shows
export const createI18n = (language: Language, resources: Resource): i18n => {
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
