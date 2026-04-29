import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zhTW from './locales/zh-TW.json';

export const resources = {
  'zh-TW': {
    translation: zhTW,
  },
  'en': {
    translation: en,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: "en",
    detection: {
      order: ['path', 'querystring', 'cookie', 'localStorage', 'navigator', 'subdomain'],
      lookupFromPathIndex: 0,
      lookupQuerystring: 'lang',
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['en'];
  }
}

export default i18n;