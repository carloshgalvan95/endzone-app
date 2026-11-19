import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AccessibilityInfo, useColorScheme } from 'react-native';

import { hydratePreference } from '@/prefs/hydratePreference';

import { darkPalette, lightPalette, themePref } from './h2';
import { resolveThemePreference, type ThemePreference } from './resolveTheme';
import { themeFor, type AppTheme, type ThemeMode } from './tokens';

export type H2Palette = { [K in keyof typeof darkPalette]: string };

type H2Theme = {
  mode: ThemeMode;
  palette: H2Palette;
  preference: ThemePreference;
  setPreference: (next: ThemePreference) => void;
  reducedMotion: boolean;
};

const ThemeContext = createContext<AppTheme | null>(null);
const H2Context = createContext<H2Theme | null>(null);

type AppThemeProviderProps = {
  children: ReactNode;
  mode?: ThemeMode;
};

export function AppThemeProvider({ children, mode }: AppThemeProviderProps) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(themePref.default);
  const [reducedMotion, setReducedMotion] = useState(false);
  const userChanged = useRef(false);
  const systemMode: ThemeMode = system === 'light' ? 'light' : 'dark';
  const resolved: ThemeMode = mode ?? resolveThemePreference(preference, systemMode);
  const theme = useMemo(() => themeFor(resolved), [resolved]);
  const h2 = useMemo<H2Theme>(
    () => ({
      mode: resolved,
      palette: resolved === 'light' ? lightPalette : darkPalette,
      preference,
      setPreference: (next) => {
        userChanged.current = true;
        setPreferenceState(next);
        AsyncStorage.setItem(themePref.storageKey, next).catch(() => undefined);
      },
      reducedMotion,
    }),
    [preference, reducedMotion, resolved],
  );

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(themePref.storageKey)
      .then((stored) => {
        if (cancelled) {
          return;
        }
        setPreferenceState((current) =>
          hydratePreference(stored, current, userChanged.current, themePref.options),
        );
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReducedMotion,
    );
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReducedMotion)
      .catch(() => undefined);
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <H2Context.Provider value={h2}>{children}</H2Context.Provider>
    </ThemeContext.Provider>
  );
}

export function useH2Theme(): H2Theme {
  const value = useContext(H2Context);
  if (!value) {
    return {
      mode: 'dark',
      palette: darkPalette,
      preference: 'system',
      setPreference: () => undefined,
      reducedMotion: false,
    };
  }
  return value;
}

export function useTheme(): AppTheme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used inside AppThemeProvider.');
  }
  return theme;
}
