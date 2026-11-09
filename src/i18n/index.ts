import { en } from '@/content/en';
import { pt } from '@/content/pt';
import { DEFAULT_LOCALE, type Dictionary, type Locale } from './types';

export * from './types';

const DICTIONARIES: Record<Locale, Dictionary> = { en, pt };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'pt' : 'en';
}

/** Root path of a locale's home page ("/" or "/pt/"). */
export function localePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}/`;
}

/** Formats "2024-06" as "Jun 2024" / "jun 2024". */
export function formatMonth(isoMonth: string, locale: Locale): string {
  const [year, month] = isoMonth.split('-').map(Number);
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, 1));
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .replace(/\.|de /g, '')
    .trim();
}
