import { I18n } from 'i18n-js';

import { en, es } from './catalog';
import { numberLocaleFor, resolveLocale, type AppLocale, type LocalePreference } from './resolve';

export const i18n = new I18n({ en, es });
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
// Catalog keys already contain dots, and placeholders use single braces.
i18n.defaultSeparator = '\u0001';
i18n.placeholder = /{(\w+)}/g;

export type { AppLocale, LocalePreference };
export { numberLocaleFor, resolveLocale };

export function translate(
  locale: AppLocale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  i18n.locale = locale;
  return i18n.t(key, vars);
}
