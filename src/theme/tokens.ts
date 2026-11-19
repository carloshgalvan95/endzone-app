export type ThemeMode = 'dark' | 'light';

export type Palette = {
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textInverse: string;
  brand: string;
  accent: string;
  model: string;
  modelSoft: string;
  disagreement: string;
  disagreementInk: string;
  positive: string;
  negative: string;
  bannerBg: string;
  bannerBorder: string;
  score: string;
  scoreMuted: string;
  logoDisc: string;
  logoDiscInk: string;
};

export type AppTheme = {
  mode: ThemeMode;
  color: Palette;
  space: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    pill: number;
  };
  font: {
    sans: string;
    sansMedium: string;
    sansBold: string;
    mono: string;
    monoMedium: string;
    monoSemi: string;
  };
  text: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
};

const font = {
  sans: 'Jost_400Regular',
  sansMedium: 'Jost_500Medium',
  sansBold: 'Jost_700Bold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  monoSemi: 'IBMPlexMono_600SemiBold',
} as const;

const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
} as const;

const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

const text = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
} as const;

const darkPalette: Palette = {
  bg: '#1B1F23',
  surface: '#262B30',
  surfaceRaised: '#262B30',
  border: '#30363C',
  borderStrong: '#8C877D',
  text: '#F4EEDF',
  textMuted: '#A9A396',
  textInverse: '#151515',
  brand: '#5A86D6',
  accent: '#D04A63',
  model: '#5A86D6',
  modelSoft: 'rgba(90, 134, 214, 0.18)',
  disagreement: '#EDB01A',
  disagreementInk: '#151515',
  positive: '#5A86D6',
  negative: '#D04A63',
  bannerBg: '#262B30',
  bannerBorder: '#D04A63',
  score: '#F4EEDF',
  scoreMuted: '#A9A396',
  logoDisc: '#F4EEDF',
  logoDiscInk: '#151515',
};

const lightPalette: Palette = {
  bg: '#F4EEDF',
  surface: '#F4EEDF',
  surfaceRaised: '#E8E0CC',
  border: '#D9D1BD',
  borderStrong: '#9A9385',
  text: '#151515',
  textMuted: '#5E5950',
  textInverse: '#F4EEDF',
  brand: '#22509B',
  accent: '#AE2440',
  model: '#22509B',
  modelSoft: 'rgba(34, 80, 155, 0.12)',
  disagreement: '#EDB01A',
  disagreementInk: '#151515',
  positive: '#22509B',
  negative: '#AE2440',
  bannerBg: '#E8E0CC',
  bannerBorder: '#AE2440',
  score: '#151515',
  scoreMuted: '#5E5950',
  logoDisc: '#F4EEDF',
  logoDiscInk: '#151515',
};

export function themeFor(mode: ThemeMode): AppTheme {
  return {
    mode,
    color: mode === 'light' ? lightPalette : darkPalette,
    space,
    radius,
    font,
    text,
  };
}
