'use client';

import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

const runsOnServerSide = typeof window === 'undefined';

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) => import(`./translations/${language}/${namespace}.json`))
  )
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    lng: 'en', // Force English locale
    supportedLngs: ['en'],
    defaultNS: 'common',
    fallbackNS: 'common',
    ns: ['common', 'navigation', 'blog', 'admin'],
    
    preload: runsOnServerSide ? ['en'] : [],

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18next;
