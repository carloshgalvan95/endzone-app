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
