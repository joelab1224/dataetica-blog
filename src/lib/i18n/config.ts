export const defaultLocale = 'en' as const;
export const locales = ['en'] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
};

export const i18nConfig = {
  defaultLocale,
  locales,
} as const;
