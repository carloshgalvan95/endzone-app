import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { themeFor, type AppTheme, type ThemeMode } from './tokens';

const ThemeContext = createContext<AppTheme | null>(null);

type AppThemeProviderProps = {
  children: ReactNode;
  mode?: ThemeMode;
};

export function AppThemeProvider({ children, mode }: AppThemeProviderProps) {
  const system = useColorScheme();
  const resolved: ThemeMode = mode ?? (system === 'light' ? 'light' : 'dark');
  const theme = useMemo(() => themeFor(resolved), [resolved]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): AppTheme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used inside AppThemeProvider.');
  }
  return theme;
}
