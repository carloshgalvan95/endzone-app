export const LOCALE_STORAGE_KEY = 'endzone-locale';

export type AppLocale = 'en' | 'es';
export type LocalePreference = 'system' | AppLocale;

export function resolveLocale(
  preference: LocalePreference,
  deviceLanguage: string | null,
): AppLocale {
  if (preference === 'en' || preference === 'es') {
    return preference;
  }
  const code = (deviceLanguage ?? '').toLowerCase();
  return code.startsWith('es') ? 'es' : 'en';
}

/** Intl needs a region tag. A bare "es" collapses es-MX into es-ES grouping. */
export function numberLocaleFor(language: AppLocale, deviceTag: string | null): string {
  const tag = (deviceTag ?? '').trim();
  if (language === 'en') {
    return /^en-[A-Za-z]{2}/.test(tag) ? tag : 'en-US';
  }
  return /^es-[A-Za-z]{2}/.test(tag) ? tag : 'es-MX';
}
