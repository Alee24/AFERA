import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations directly or use resources-to-backend
import enCommon from './locales/en/common.json';
import frCommon from './locales/fr/common.json';
import ptCommon from './locales/pt/common.json';

const resources = {
  en: { common: enCommon },
  fr: { common: frCommon },
  pt: { common: ptCommon },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
