import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

export const initializeLocales = () =>
  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      fallbackLng: "pl",
      load: "languageOnly",
      supportedLngs: ["pl"],
      debug: false,
      interpolation: {
        escapeValue: false, // React already handles XSS escaping
      },
    });
