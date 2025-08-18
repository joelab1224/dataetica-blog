'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from '../client';

export function useClientTranslation(ns: string | string[] = 'common') {
  const { t, i18n } = useTranslation(ns);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeI18n = async () => {
      if (!i18next.isInitialized) {
        await i18next.init();
      }
      setIsInitialized(true);
    };

    initializeI18n();
  }, []);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    // Store in localStorage for persistence
    localStorage.setItem('i18nextLng', lng);
  };

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language,
    isInitialized,
  };
}

export default useClientTranslation;
