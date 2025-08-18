import { type Locale } from '@/lib/i18n/config';

export const formatDate = (date: string | Date, locale: Locale, options?: Intl.DateTimeFormatOptions) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  
  const localeMap = {
    es: 'es-ES',
    en: 'en-US',
  };
  
  return dateObj.toLocaleDateString(localeMap[locale], { ...defaultOptions, ...options });
};

export const formatRelativeTime = (date: string | Date, locale: Locale) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    numeric: 'auto'
  });
  
  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
  if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  
  return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
};
