import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { type Locale } from './config';

const initI18next = async (lng: Locale, ns: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) => import(`./translations/${language}/${namespace}.json`)
      )
    )
    .init({
      lng,
      fallbackLng: 'en',
      supportedLngs: ['en'],
      defaultNS: 'common',
      fallbackNS: 'common',
      ns,
      interpolation: {
        escapeValue: false,
      },
    });
  return i18nInstance;
};

export async function getTranslation(lng: Locale = 'en', ns: string | string[] = 'common') {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
  };
}

export async function getMultipleTranslations(lng: Locale = 'en', namespaces: string[]) {
  const i18nextInstance = await initI18next(lng, namespaces);
  const translations: { [key: string]: ReturnType<typeof i18nextInstance.getFixedT> } = {};
  
  namespaces.forEach(ns => {
    translations[ns] = i18nextInstance.getFixedT(lng, ns);
  });
  
  return {
    ...translations,
    i18n: i18nextInstance,
  };
}
