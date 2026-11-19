// tokens.ts, híbrido H2.1 de endzone-app, sprint 3.
// Listo para pegar o extender src/theme/tokens.ts en Expo 58 / RN 0.88.
// Incorpora la escala de la auditoría de Idaho (sección 5) y la regla
// de la cifra de portada (M2). Paleta del kit DARK sin cambios de hex.
// Contraste WCAG 2: (L1+0.05)/(L2+0.05), luminancia relativa sRGB.
// AA cuerpo 4.5:1. AA grande (18 pt o 14 pt bold) y gráficos 3:1.
// Sin em dash ni en dash en comentarios.

import type { TextStyle } from 'react-native';

import holdoutData from '@/data/how-holdout.json';

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const pagePad = 16;

export const rhythm = {
  week: {
    padX: 16,
    mastheadPadTop: 16,
    rowKickerGap: 8,
    namesToField: 8,
    fieldToNext: 16,
    dayHeaderGapAbove: 16,
    dayHeaderGapBelow: 8,
    rowMinHeight: 132,
  },
  detail: {
    bar: 64,
    padX: 16,
    afterBar: 16,
    kickerToDate: 8,
    dateToTitle: 16,
    titleToCover: 16,
    in10ToWins: 8,
    winsToFieldLabels: 16,
    labelsToField: 8,
    fieldToVals: 12,
    valsToDots: 8,
    dotsToPhrase: 8,
    phraseToFooter: 16,
    footerToLink: 8,
    afterLink: 24,
  },
  how: {
    bar: 64,
    padX: 16,
    afterBar: 16,
    leadToFirst: 32,
    kickerToTitle: 8,
    titleToBody: 16,
    bodyGap: 12,
    bodyToChart: 24,
    stepGap: 48,
    afterLast: 24,
  },
} as const;

export const themePref = {
  default: 'system' as const,
  options: ['system', 'light', 'dark'] as const,
  storageKey: 'theme.pref',
} as const;

export const radius = {
  none: 0, // campo, tira, filas de la lista, filetes
  input: 8,
  inner: 12,
  tile: 16,
  hero: 20,
  pill: 999,
  // widget: usar system_app_widget_background_radius en Android 12+
} as const;

export const font = {
  sans: 'Jost_400Regular',
  sansMedium: 'Jost_500Medium',
  sansBold: 'Jost_700Bold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  monoSemi: 'IBMPlexMono_600SemiBold',
} as const;

export type FontRole = keyof typeof font;

export type TypeToken = {
  size: number;
  line: number; // lineHeight = size * line, siempre >= size en display
  letterSpacing: number; // dp, API de RN
  role: FontRole;
  maxFontSizeMultiplier: number;
  transform?: 'uppercase';
  variant?: readonly ['tabular-nums'];
  includeFontPadding?: false;
};

// Solo pesos del kit: Jost 400, 500, 700 y Plex Mono 400, 500, 600.
// Nada de Jost 800 ni Jost 600. Interlínea de cover, display y
// rowFigure igual al tamaño. Ajuste óptico con margen, no con line < 1.
export const type = {
  cover: {
    size: 168,
    line: 1,
    letterSpacing: -6,
    role: 'sansBold',
    maxFontSizeMultiplier: 1,
    includeFontPadding: false,
  },
  display: {
    size: 96,
    line: 1,
    letterSpacing: -4,
    role: 'sansBold',
    maxFontSizeMultiplier: 1,
    includeFontPadding: false,
  },
  headline: {
    size: 32,
    line: 36 / 32,
    letterSpacing: -0.8,
    role: 'sansBold',
    maxFontSizeMultiplier: 1.3,
  },
  title: {
    size: 24,
    line: 30 / 24,
    letterSpacing: -0.4,
    role: 'sansBold',
    maxFontSizeMultiplier: 1.3,
  },
  titleCompact: {
    size: 22,
    line: 28 / 22,
    letterSpacing: -0.3,
    role: 'sansBold',
    maxFontSizeMultiplier: 1.3,
  },
  rowFigure: {
    size: 48,
    line: 1,
    letterSpacing: -1.5,
    role: 'sansBold',
    maxFontSizeMultiplier: 1.15,
    includeFontPadding: false,
  },
  rowFigureFinal: {
    size: 40,
    line: 44 / 40,
    letterSpacing: -1,
    role: 'sansBold',
    maxFontSizeMultiplier: 1.15,
  }, // unused in H2: finals use score pairs (figureLg / scoreRow)
  tileFigure: {
    size: 40,
    line: 44 / 40,
    letterSpacing: -1,
    role: 'sansBold',
    maxFontSizeMultiplier: 1.2,
  },
  subtitle: {
    size: 18,
    line: 24 / 18,
    letterSpacing: 0,
    role: 'sansMedium',
    maxFontSizeMultiplier: 1.5,
  },
  teams: {
    size: 16,
    line: 22 / 16,
    letterSpacing: 0,
    role: 'sansMedium',
    maxFontSizeMultiplier: 1.5,
  },
  body: { size: 16, line: 24 / 16, letterSpacing: 0, role: 'sans', maxFontSizeMultiplier: 1.5 },
  bodySmall: {
    size: 14,
    line: 20 / 14,
    letterSpacing: 0,
    role: 'sans',
    maxFontSizeMultiplier: 1.5,
  },
  navLabel: {
    size: 12,
    line: 16 / 12,
    letterSpacing: 0.2,
    role: 'sansMedium',
    maxFontSizeMultiplier: 1.3,
  },
  figure: {
    size: 16,
    line: 20 / 16,
    letterSpacing: 0,
    role: 'monoSemi',
    maxFontSizeMultiplier: 1.5,
    variant: ['tabular-nums'],
  },
  figureLg: {
    size: 32,
    line: 36 / 32,
    letterSpacing: -0.5,
    role: 'monoSemi',
    maxFontSizeMultiplier: 1.3,
    variant: ['tabular-nums'],
  },
  figureTile: {
    size: 24,
    line: 28 / 24,
    letterSpacing: 0,
    role: 'monoSemi',
    maxFontSizeMultiplier: 1.3,
    variant: ['tabular-nums'],
  },
  fieldLabel: {
    size: 14,
    line: 16 / 14,
    letterSpacing: 0,
    role: 'monoSemi',
    maxFontSizeMultiplier: 1.3,
  },
  kicker: {
    size: 12,
    line: 16 / 12,
    letterSpacing: 1.2,
    role: 'monoMedium',
    maxFontSizeMultiplier: 1.5,
    transform: 'uppercase',
  },
  chip: {
    size: 11,
    line: 14 / 11,
    letterSpacing: 0.9,
    role: 'monoSemi',
    maxFontSizeMultiplier: 1.3,
    transform: 'uppercase',
  },
  axis50: { size: 11, line: 14 / 11, letterSpacing: 0.9, role: 'mono', maxFontSizeMultiplier: 1.3 },
  // Widget figures (H2.1). Not used for the in-app cover or week row figure.
  widgetFigure: {
    size: 28,
    line: 1,
    letterSpacing: -1,
    role: 'sansBold',
    maxFontSizeMultiplier: 1.15,
    includeFontPadding: false,
  },
  widgetFigureSm: {
    size: 24,
    line: 1,
    letterSpacing: -1,
    role: 'sansBold',
    maxFontSizeMultiplier: 1.15,
    includeFontPadding: false,
  },
  widgetPhrase: {
    size: 13,
    line: 16 / 13,
    letterSpacing: 0,
    role: 'sansMedium',
    maxFontSizeMultiplier: 1.3,
  },
  widgetMatch: {
    size: 14,
    line: 18 / 14,
    letterSpacing: 0,
    role: 'sans',
    maxFontSizeMultiplier: 1.3,
  },
  // Final scores: Detail uses figureLg (32). Week compact rows use scoreRow (22), not rowFigureFinal.
  scoreRow: {
    size: 22,
    line: 24 / 22,
    letterSpacing: -0.5,
    role: 'monoSemi',
    maxFontSizeMultiplier: 1.3,
    variant: ['tabular-nums'],
  },
  scoreName: {
    size: 18,
    line: 24 / 18,
    letterSpacing: 0,
    role: 'sansMedium',
    maxFontSizeMultiplier: 1.5,
  },
} as const satisfies Record<string, TypeToken>;

// Cifra de portada. Nunca se recorta. Nunca escala con el sistema.
// Sidebearings izquierdos de Jost 700 a 168 sp, medidos con PIL sobre
// el trazo (no el bbox): 5=7, 6=8, 7=5, 8=9, 9=8 dp, todos positivos.
// marginLeft = 0. Un sangrado negativo recortaría el 5, el 6, el 8 o el 9.
export const coverFigure = {
  size: 168,
  allowFontScaling: false,
  maxFontSizeMultiplier: 1,
  marginLeft: 0,
  maxNegativeMargin: -6, // no usar: no hay sidebearing negativo
  includeFontPadding: false,
  stackFromFontScale: 1.3,
} as const;

// p es la probabilidad del local, 0 a 1, como la publica el contrato.
// La cifra es siempre del favorito del modelo, de 5 a 9. Nunca 10.
// Copy lives in strings_en_es.csv. These English phrases are the default locale.
// Spanish: "de cada 10", "Juego parejo", "Más de 9 de cada 10".
export function coverFromHomeProb(pHome: number): {
  n: number;
  phrase: 'in 10' | 'Toss-up' | 'More than 9 in 10';
  favorsHome: boolean;
  pFav: number;
} {
  const pFav = Math.max(pHome, 1 - pHome);
  const favorsHome = pHome >= 0.5;
  if (pFav < 0.55) {
    return { n: 5, phrase: 'Toss-up', favorsHome, pFav };
  }
  if (pFav >= 0.95) {
    return { n: 9, phrase: 'More than 9 in 10', favorsHome, pFav };
  }
  const n = Math.min(9, Math.max(5, Math.round(pFav * 10)));
  return { n, phrase: 'in 10', favorsHome, pFav };
}

// Campo v2. Ancho de referencia 360 dp. x en dp desde el borde izquierdo.
// End zones 30 + juego 300. El 72% cae en 246, no en el 72% del ancho total.
export const field = {
  width: 360,
  endZone: 30,
  play: 300,
  detailHeight: 112,
  rowHeight: 24,
  stripHeight: 72,
  markerClamp: [38, 322] as const,
  labelSeparateUnder: 18,
  modelRing: 16,
  modelStroke: 3,
  x: (pHomePercent: number, width = 360) => {
    const scale = width / 360;
    return (30 + 3 * pHomePercent) * scale;
  },
  clampX: (x: number, width = 360) => {
    const scale = width / 360;
    const lo = 38 * scale;
    const hi = 322 * scale;
    return Math.min(hi, Math.max(lo, x));
  },
} as const;

export function lineHeightOf(t: TypeToken, scale = 1): number {
  const capped = Math.min(scale, t.maxFontSizeMultiplier);
  return Math.round(t.size * capped * t.line);
}

export function typeStyle(t: TypeToken, opts?: { fontScale?: number }): TextStyle {
  const scale = Math.min(opts?.fontScale ?? 1, t.maxFontSizeMultiplier);
  const style: TextStyle = {
    fontFamily: font[t.role],
    fontSize: t.size * scale,
    lineHeight: Math.round(t.size * scale * t.line),
    letterSpacing: t.letterSpacing * scale,
    includeFontPadding: t.includeFontPadding ?? undefined,
    textTransform: t.transform,
    fontVariant: t.variant as TextStyle['fontVariant'],
  };
  return style;
}

export const motion = {
  duration: { sm: 120, md: 200, lg: 320 },
  easing: { standard: [0.2, 0, 0, 1] as const },
  stagger: 30, // ms, primeras 6 filas
  // Solo formas de marca en primer uso, vacío y offline sin caché.
  springShape: { damping: 16, stiffness: 180, mass: 1, overshootClamping: false },
  heroCollapseScroll: { start: 0, compactFrom: 80, compactVisible: 120 },
  reducedMotion: {
    duration: { sm: 1, md: 1, lg: 1 },
    disableSpring: true,
    keepContent: true,
  },
} as const;

export const hitSlop = { min: 48 } as const;

export const elevation = {
  none: { elevation: 0, shadowOpacity: 0 },
  card: { elevation: 0, shadowOpacity: 0 },
} as const;

export const opacity = {
  pressed: 0.72,
  disabled: 0.4,
  skeletonMin: 0.6,
  skeletonMax: 1,
  overlay: 0.92,
  fieldRule: 0.25, // filete cream del campo, ver contraste compuesto
  fieldMid: 0.6,
} as const;

export const darkPalette = {
  bg: '#1B1F23',
  surface: '#262B30',
  surfaceRaised: '#30363C',
  border: '#30363C',
  borderStrong: '#8C877D', // solo para el mark, no para bordes de UI
  text: '#F4EEDF',
  textMuted: '#A9A396',
  textInverse: '#151515',
  brand: '#5A86D6',
  accent: '#D04A63', // solo tipo grande o wordmark -mlops
  model: '#5A86D6',
  modelLabel: '#8AA6DC',
  accentNav: '#EDB01A',
  accentNavInk: '#151515',
  logoDisc: '#F4EEDF',
  logoDiscInk: '#151515',
  score: '#F4EEDF',
  scoreMuted: '#A9A396',
  bannerBg: '#262B30',
  bannerBorder: '#D04A63',
  // Tinte de forma para app. Pedir registro en el kit (Should 2).
  crimsonHero: '#9A3350', // app token: cream 6.12 AA cuerpo; end zones del Detalle. Not a widget bar.
  // blueHero #2E5EC2 remains in the kit. It is not used in this app UI (2.76:1 on the dark background).
  blueDeep: '#24344F',
  crimsonDeep: '#3A2228',
  blueSoft: '#8AA6DC',
  glass: '#22262B',
  playField: '#14181C',
  fieldTick: '#3A4148', // textura cada 10; 1.72:1, ver H2.md, ticks como textura
  fieldCap: '#30363C',
} as const;

export const lightPalette = {
  bg: '#F4EEDF',
  surface: '#E8E0CC',
  surfaceRaised: '#D9D1BD',
  border: '#D9D1BD',
  borderStrong: '#5E5950',
  text: '#151515',
  textMuted: '#5E5950',
  textInverse: '#F4EEDF',
  brand: '#22509B',
  accent: '#AE2440',
  model: '#22509B',
  modelLabel: '#22509B',
  accentNav: '#EDB01A',
  accentNavInk: '#151515',
  logoDisc: '#151515',
  logoDiscInk: '#F4EEDF',
  score: '#151515',
  scoreMuted: '#5E5950',
  bannerBg: '#E8E0CC',
  bannerBorder: '#AE2440',
  crimsonHero: '#AE2440',
  playField: '#E8E0CC',
  fieldTick: '#BAB3A4',
  fieldCap: '#D9D1BD',
  blueDeep: '#D5DEEE',
  crimsonDeep: '#F0D4DA',
  blueSoft: '#3E68B0',
  glass: '#EFE8D6',
} as const;

export const contrastLight = {
  inkOnBg: 15.78,
  inkOnSurface: 13.88,
  mutedOnBg: 6.01,
  mutedOnSurface: 5.29,
  modelOnBg: 6.75,
  modelOnSurface: 5.94,
  modelOnPlayField: 5.94,
  creamOnCrimsonHero: 5.8,
  inkOnCream: 15.78,
  inkOnYellow: 9.41,
  fieldTickOnPlayField: 1.59,
  mutedOnPlayField: 5.29,
} as const;

export const contrastDark = {
  creamOnBg: 14.32,
  creamOnSurface: 12.34,
  mutedOnBg: 6.6,
  mutedOnSurface: 5.69,
  modelOnBg: 4.59,
  modelOnSurface: 3.95, // no usar como cuerpo sobre surface
  modelOnPlayField: 4.94, // anillo O
  modelLabelOnPlayField: 7.28,
  creamOnCrimsonHero: 6.12,
  inkOnCream: 15.78,
  inkOnYellow: 9.41,
  fieldTickOnPlayField: 1.72, // no cumple 3:1; solo textura
  cream25OnPlayField: 2.13, // filete del campo, no es el dato
  cream60OnPlayField: 6.18, // línea de 50%
} as const;

export const hapticEvents = {
  weekChange: { ios: 'selectionAsync', android: 'selectionAsync' },
  navChange: { ios: 'selectionAsync', android: 'selectionAsync' },
  switchOn: { ios: 'impactLight', android: 'AndroidHaptics.Toggle_On' },
  switchOff: { ios: 'impactLight', android: 'AndroidHaptics.Toggle_Off' },
  never: [
    'probabilityUpdate',
    'heroCollapse',
    'refresh',
    'finalResult',
    'modelHit',
    'skeletonPulse',
  ],
} as const;

export const dots = {
  size: 16,
  gap: 8,
  count: 10,
} as const;

export const widget = {
  size2x2: { width: 156, height: 156 },
  size4x2: { width: 328, height: 156 },
  size4x1: { width: 328, height: 72 },
  padX: 12,
  padY: 10,
  miniField: { width: 152, height: 48 },
} as const;

export const langOption = {
  minHeight: 48,
  radio: 20,
} as const;

export const teamLogos = {
  flag: 'teamLogos.enabled',
  sizeRow: 24, // Week rows and widget 4x2
  sizeHeader: 32, // Detail heading
  sizeBar: 24, // compact Detail bar 64
  ring: 1.5, // monogram ring, dp
  monogramDot: 5,
  cacheTtlDays: 7,
  // Runtime only. Public nflverse URLs, never stored in the repo or the APK.
} as const;

export const nav = {
  height: 64,
  item: { width: 109, height: 64 },
  icon: 24,
  indicator: { width: 56, height: 32 },
  sideMargin: 16,
  bottomGap: 12, // más inset del sistema
  listPaddingBottom: (inset = 0) => 64 + 12 + inset + 16,
} as const;

// Masthead strip lanes. x never moves. Up to 3 lanes. Never hide a ring.
export const stripLanes = {
  laneCenters: [36, 16, 56] as const,
  maxLanes: 3,
  ring: { diameter: 16, stroke: 3 },
  ringMin: { diameter: 12, stroke: 2.5 },
  gap: 4,
  moveDuration: 200,
} as const;

export function assignStripLanes(xs: readonly { id: string; x: number; kickoff: number }[]): {
  diameter: number;
  stroke: number;
  lanes: Record<string, { x: number; y: number }>;
} {
  const order = [...xs].sort(
    (a, b) => a.x - b.x || a.kickoff - b.kickoff || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
  const place = (d: number, strict: boolean) => {
    const minDx = d + stripLanes.gap;
    const last = [-Infinity, -Infinity, -Infinity];
    const lanes: Record<string, { x: number; y: number }> = {};
    for (const ring of order) {
      let lane = -1;
      if (strict) {
        lane = [0, 1, 2].find((index) => ring.x - last[index]! >= minDx) ?? -1;
        if (lane < 0) {
          return null;
        }
      } else {
        const open = [0, 1, 2].find((index) => ring.x - last[index]! >= minDx);
        lane =
          open ??
          [0, 1, 2].reduce((best, index) =>
            ring.x - last[index]! > ring.x - last[best]! ? index : best,
          );
      }
      last[lane] = ring.x;
      lanes[ring.id] = { x: ring.x, y: stripLanes.laneCenters[lane]! };
    }
    return lanes;
  };
  const big = place(stripLanes.ring.diameter, true);
  if (big) {
    return { ...stripLanes.ring, lanes: big };
  }
  const small = place(stripLanes.ringMin.diameter, true);
  if (small) {
    return { ...stripLanes.ringMin, lanes: small };
  }
  return { ...stripLanes.ringMin, lanes: place(stripLanes.ringMin.diameter, false)! };
}

export const weekField = {
  row: { width: 296, height: 24, endZone: 6, play: 284, clamp: [14, 282] as const },
  strip: { width: 328, height: 72, endZone: 20, play: 288, clamp: [28, 300] as const },
  playFieldInCard: { dark: '#14181C', light: '#F4EEDF' },
  x: (pHomePercent: number, frame: { width: number; endZone: number }) =>
    frame.endZone + (frame.width - 2 * frame.endZone) * (pHomePercent / 100),
  clampX: (x: number, frame: { clamp: readonly [number, number] }) =>
    Math.min(frame.clamp[1], Math.max(frame.clamp[0], x)),
} as const;

export const weekCard = {
  marginX: 16,
  padding: 16,
  gap: 12,
  radius: 16,
  border: 1,
  contentWidth: 296,
  logoToName: 12,
  box: 136,
} as const;

export const howCalibration = holdoutData;
