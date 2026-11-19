import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { resolveLocale, translate, type AppLocale, type LocalePreference } from './index';
import { LOCALE_STORAGE_KEY } from './resolve';

type LocaleValue = {
  locale: AppLocale;
  preference: LocalePreference;
  setPreference: (next: LocalePreference) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<LocalePreference>('system');
  const device = getLocales()[0]?.languageCode ?? 'en';
  const locale = resolveLocale(preference, device);

  useEffect(() => {
    AsyncStorage.getItem(LOCALE_STORAGE_KEY)
      .then((stored) => {
        if (stored === 'en' || stored === 'es' || stored === 'system') {
          setPreferenceState(stored);
        }
      })
      .catch(() => undefined);
  }, []);

  const value = useMemo<LocaleValue>(
    () => ({
      locale,
      preference,
      setPreference: (next) => {
        setPreferenceState(next);
        AsyncStorage.setItem(LOCALE_STORAGE_KEY, next).catch(() => undefined);
      },
      t: (key, vars) => translate(locale, key, vars),
    }),
    [locale, preference],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): LocaleValue {
  const value = useContext(LocaleContext);
  if (!value) {
    return {
      locale: 'en',
      preference: 'system',
      setPreference: () => undefined,
      t: (key, vars) => translate('en', key, vars),
    };
  }
  return value;
}
