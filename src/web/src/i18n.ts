import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from "i18next-browser-languagedetector"

import enTranslations from './locales/en.json'; 
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      es: {
        translation: esTranslations
      },
      fr: {
        translation: frTranslations
      }
    },
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
