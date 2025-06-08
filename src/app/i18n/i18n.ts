import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en/common.json';
import bnTranslation from './locales/bn/common.json';
import zhTranslation from './locales/zh/common.json';

const resources = {
  en: {
    translation: enTranslation
  },
  bn: {
    translation: bnTranslation
  },
  zh: {
    translation: zhTranslation
  }
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language is English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18next; 