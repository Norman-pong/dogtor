import i18n from 'i18next';

import { initReactI18next, useTranslation } from 'react-i18next';

import en from '@dogtor/shared-i18n/locales/en.json';

import zhCN from '@dogtor/shared-i18n/locales/zh-CN.json';

const resources = {
  en: { translation: en },

  'zh-CN': { translation: zhCN }
} as const;

// 初始化 i18next，并接入 react-i18next

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,

    lng: 'zh-CN',

    fallbackLng: 'zh-CN',

    supportedLngs: ['en', 'zh-CN'],

    interpolation: { escapeValue: false }
  });
}

export type Locale = keyof typeof resources;

export const useI18n = () => {
  const { t } = useTranslation();

  const setLocale = (lng: Locale) => i18n.changeLanguage(lng);

  return { t, setLocale };
};

export default i18n;
