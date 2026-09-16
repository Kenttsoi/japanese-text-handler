import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ja from './locales/ja.json';
import zhTW from './locales/zh-TW.json';
import ko from './locales/ko.json';

export const resources = {
  'en': {
    translation: en,
  },
  'ja': {
    translation: ja,
  },
  'zh-TW': {
    translation: zhTW,
  },
  'ko': {
    translation: ko,
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
      order: ['path', 'cookie', 'localStorage', 'querystring', 'navigator', 'subdomain'],
      lookupFromPathIndex: 0,
      lookupQuerystring: 'lang',
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['en'];
  }
}

export default i18n;