'use client';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { locales, defaultLocale } from './config';

const runsOnServerSide = typeof window === 'undefined';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) => import(`./translations/${language}/${namespace}.json`))
  )
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: defaultLocale,
    lng: undefined, // Let the detector decide
    supportedLngs: locales,
    defaultNS: 'common',
    fallbackNS: 'common',
    ns: ['common', 'navigation', 'blog', 'admin'],
    
    detection: {
      order: [
        'localStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain'
      ],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'],
    },

    preload: runsOnServerSide ? locales : [],

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18next;
