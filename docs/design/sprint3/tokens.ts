// tokens.ts, híbrido H2.1 de endzone-app, sprint 3.
// QA r2 (18 nov 2026, America/Mexico_City): contrastLight, space,
// QA r3 (19 nov 2026, America/Mexico_City): stripLanes and
// assignStripLanes (masthead strip collisions), one merged space
// export (the file had two, a duplicate declaration), rowMinHeight
// clarified as the full row box.
// H3 How (18 nov 2026): chart.how, chart.calibration, rhythm.how.
// r4 color (19 nov 2026, America/Mexico_City): accent.nav (yellow, closed
// role list), weekField (thin Week end zones, new x), weekCard (Week row
// card, replaces the rhythm.week row box). Palette key yellow renamed to
// accentNav so the hex lives only under approved role names.
// rhythm, themePref, reducedMotion, light fieldTick and light tints.
// Listo para pegar o extender src/theme/tokens.ts en Expo 58 / RN 0.88.
// Incorpora la escala de la auditoría de Idaho (sección 5) y la regla
// de la cifra de portada (M2). Paleta del kit DARK sin cambios de hex.
// Contraste WCAG 2: (L1+0.05)/(L2+0.05), luminancia relativa sRGB.
// AA cuerpo 4.5:1. AA grande (18 pt o 14 pt bold) y gráficos 3:1.
// Sin em dash ni en dash en comentarios.

import type { TextStyle } from 'react-native';

// All padding and gaps snap to this 4 dp scale. Numeric and named keys
// are the same values (merged in QA r3; there was a duplicate export).
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
  variant?: ReadonlyArray<'tabular-nums'>;
  includeFontPadding?: false;
};

// Solo pesos del kit: Jost 400, 500, 700 y Plex Mono 400, 500, 600.
// Nada de Jost 800 ni Jost 600. Interlínea de cover, display y
// rowFigure igual al tamaño. Ajuste óptico con margen, no con line < 1.
export const type = {
  cover: { size: 168, line: 1, letterSpacing: -6, role: 'sansBold', maxFontSizeMultiplier: 1, includeFontPadding: false },
  display: { size: 96, line: 1, letterSpacing: -4, role: 'sansBold', maxFontSizeMultiplier: 1, includeFontPadding: false },
  headline: { size: 32, line: 36 / 32, letterSpacing: -0.8, role: 'sansBold', maxFontSizeMultiplier: 1.3 },
  title: { size: 24, line: 30 / 24, letterSpacing: -0.4, role: 'sansBold', maxFontSizeMultiplier: 1.3 },
  titleCompact: { size: 22, line: 28 / 22, letterSpacing: -0.3, role: 'sansBold', maxFontSizeMultiplier: 1.3 },
  rowFigure: { size: 48, line: 1, letterSpacing: -1.5, role: 'sansBold', maxFontSizeMultiplier: 1.15, includeFontPadding: false },
  rowFigureFinal: { size: 40, line: 44 / 40, letterSpacing: -1, role: 'sansBold', maxFontSizeMultiplier: 1.15 }, // unused in H2: finals use score pairs (figureLg / scoreRow)
  tileFigure: { size: 40, line: 44 / 40, letterSpacing: -1, role: 'sansBold', maxFontSizeMultiplier: 1.2 },
  subtitle: { size: 18, line: 24 / 18, letterSpacing: 0, role: 'sansMedium', maxFontSizeMultiplier: 1.5 },
  teams: { size: 16, line: 22 / 16, letterSpacing: 0, role: 'sansMedium', maxFontSizeMultiplier: 1.5 },
  body: { size: 16, line: 24 / 16, letterSpacing: 0, role: 'sans', maxFontSizeMultiplier: 1.5 },
  bodySmall: { size: 14, line: 20 / 14, letterSpacing: 0, role: 'sans', maxFontSizeMultiplier: 1.5 },
  navLabel: { size: 12, line: 16 / 12, letterSpacing: 0.2, role: 'sansMedium', maxFontSizeMultiplier: 1.3 },
  figure: { size: 16, line: 20 / 16, letterSpacing: 0, role: 'monoSemi', maxFontSizeMultiplier: 1.5, variant: ['tabular-nums'] },
  figureLg: { size: 32, line: 36 / 32, letterSpacing: -0.5, role: 'monoSemi', maxFontSizeMultiplier: 1.3, variant: ['tabular-nums'] },
  figureTile: { size: 24, line: 28 / 24, letterSpacing: 0, role: 'monoSemi', maxFontSizeMultiplier: 1.3, variant: ['tabular-nums'] },
  fieldLabel: { size: 14, line: 16 / 14, letterSpacing: 0, role: 'monoSemi', maxFontSizeMultiplier: 1.3 },
  kicker: { size: 12, line: 16 / 12, letterSpacing: 1.2, role: 'monoMedium', maxFontSizeMultiplier: 1.5, transform: 'uppercase' },
  chip: { size: 11, line: 14 / 11, letterSpacing: 0.9, role: 'monoSemi', maxFontSizeMultiplier: 1.3, transform: 'uppercase' },
  axis50: { size: 11, line: 14 / 11, letterSpacing: 0.9, role: 'mono', maxFontSizeMultiplier: 1.3 },
  // Widget figures (H2.1). Not used for the in-app cover or week row figure.
  widgetFigure: { size: 28, line: 1, letterSpacing: -1, role: 'sansBold', maxFontSizeMultiplier: 1.15, includeFontPadding: false },
  widgetFigureSm: { size: 24, line: 1, letterSpacing: -1, role: 'sansBold', maxFontSizeMultiplier: 1.15, includeFontPadding: false },
  widgetPhrase: { size: 13, line: 16 / 13, letterSpacing: 0, role: 'sansMedium', maxFontSizeMultiplier: 1.3 },
  widgetMatch: { size: 14, line: 18 / 14, letterSpacing: 0, role: 'sans', maxFontSizeMultiplier: 1.3 },
  // Final scores: Detail uses figureLg (32). Week compact rows use scoreRow (22), not rowFigureFinal.
  scoreRow: { size: 22, line: 24 / 22, letterSpacing: -0.5, role: 'monoSemi', maxFontSizeMultiplier: 1.3, variant: ['tabular-nums'] },
  scoreName: { size: 18, line: 24 / 18, letterSpacing: 0, role: 'sansMedium', maxFontSizeMultiplier: 1.5 },
} as const satisfies Record<string, TypeToken>;

export const pagePad = 16;

// Vertical rhythm targets (QA r2). Use these instead of leftover 7, 12.5, 39, 40 dp gaps.
export const rhythm = {
  week: {
    padX: 16,
    mastheadPadTop: 16,
    rowKickerGap: 8,
    namesToField: 8,
    fieldToNext: 16,
    dayHeaderGapAbove: 16,
    dayHeaderGapBelow: 8,
    // QA r3: 132 is the FULL row box: padTop 16 + content 100
    // (kicker 16, 8, names 2 x 22, 8, field 24) + padBottom 16.
    // Do not add fieldToNext or dayHeaderGapAbove on top of it.
    // Step between row kickers in one day = 132. Field bottom to the
    // next day header box = rowPadY 16 + dayHeaderGapAbove 16 = 32.
    // The first row under a day header has padTop 0 (gap is 8).
    // r4: SUPERSEDED by weekCard (card box 136 = 16 + 104 + 16, gap 12
    // between cards). rowMinHeight / rowPadY / rowContent stay only as
    // history; do not use them for the r4 Week list.
    rowMinHeight: 132,
    rowPadY: 16,
    rowContent: 100,
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
    stepGap: 48, // 24 + hairline + 24
    afterLast: 24,
    lead: { size: 18, line: 26 / 18 },
    stepTitle: { size: 28, line: 36 / 28, weight: 700, maxFontSizeMultiplier: 1.3 },
    stepNum: { size: 48, weight: 700, allowFontScaling: false, maxFontSizeMultiplier: 1 },
    progress: { segment: 16, height: 4, gap: 4, count: 6 },
  },
} as const;

export const themePref = {
  default: 'system' as const,
  options: ['system', 'light', 'dark'] as const,
  storageKey: 'theme.pref',
} as const;

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

// Masthead strip (72 dp): ring collision rule, QA r3.
// Rings that would touch are moved to up to 3 lanes. x never changes:
// r4: x is weekField.strip.x(p) clamped with weekField.strip.clamp
// (thin 20 dp end zones). Lanes, diameters and the gap do not change.
export const stripLanes = {
  laneCenters: [36, 16, 56] as const, // dp from the strip top: center, up, down
  maxLanes: 3,
  ring: { diameter: 16, stroke: 3 }, // field.modelRing / modelStroke
  ringMin: { diameter: 12, stroke: 2.5 }, // global step down, never smaller
  gap: 4, // minDx = diameter + gap (20 at 16, 16 at 12)
  moveDuration: 200, // motion.duration.md, easing standard, no spring
} as const;

// Pseudocode:
//   xs = games.map(g => weekField.clampX(weekField.strip.x(g.pHome * 100), weekField.strip))
//   order = sort by x asc, then kickoff asc, then gameId asc (stable)
//   for (d of [16, 12]):                     // pass 1 and pass 2
//     minDx = d + 4; last = [-inf, -inf, -inf]
//     for each ring in order:
//       lane = first of [0, 1, 2] with x - last[lane] >= minDx
//       if none: this pass fails, try the next d
//       last[lane] = x
//     if every ring placed: return (d, lanes)
//   // pass 3, very dense weeks: d = 12, no ring hidden,
//   // first lane with x - last[lane] >= 16, else the lane with the largest
//   // x - last[lane] (least overlap); ties to the lower index.
// The diameter is global for the whole strip (all rings same size).
// Lane changes animate translateY at 200 ms, cubic-bezier(0.2, 0, 0, 1);
// reduced motion snaps. The row mini field (24 dp) never uses lanes.
export function assignStripLanes(
  xs: ReadonlyArray<{ id: string; x: number; kickoff: number }>,
): { diameter: number; stroke: number; lanes: Record<string, { x: number; y: number }> } {
  const order = [...xs].sort(
    (a, b) => a.x - b.x || a.kickoff - b.kickoff || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
  const place = (d: number, strict: boolean) => {
    const minDx = d + stripLanes.gap;
    const last = [-Infinity, -Infinity, -Infinity];
    const lanes: Record<string, { x: number; y: number }> = {};
    for (const r of order) {
      let lane = -1;
      if (strict) {
        lane = [0, 1, 2].find((l) => r.x - last[l] >= minDx) ?? -1;
        if (lane < 0) return null;
      } else {
        lane = [0, 1, 2].find((l) => r.x - last[l] >= minDx) ??
          [0, 1, 2].reduce((best, l) => (r.x - last[l] > r.x - last[best] ? l : best), 0);
      }
      last[lane] = r.x;
      lanes[r.id] = { x: r.x, y: stripLanes.laneCenters[lane] };
    }
    return lanes;
  };
  const big = place(stripLanes.ring.diameter, true);
  if (big) return { ...stripLanes.ring, lanes: big };
  const small = place(stripLanes.ringMin.diameter, true);
  if (small) return { ...stripLanes.ringMin, lanes: small };
  return { ...stripLanes.ringMin, lanes: place(stripLanes.ringMin.diameter, false)! };
}

export function lineHeightOf(t: TypeToken, scale = 1): number {
  const capped = Math.min(scale, t.maxFontSizeMultiplier);
  return Math.round(t.size * capped * t.line);
}

export function typeStyle(
  t: TypeToken,
  opts?: { fontScale?: number },
): TextStyle {
  const scale = Math.min(opts?.fontScale ?? 1, t.maxFontSizeMultiplier);
  const style: TextStyle = {
    fontFamily: font[t.role],
    fontSize: t.size * scale,
    lineHeight: Math.round(t.size * scale * t.line),
    letterSpacing: t.letterSpacing * scale,
    includeFontPadding: t.includeFontPadding ?? undefined,
  };
  if (t.transform) style.textTransform = t.transform;
  if (t.variant) style.fontVariant = t.variant as TextStyle['fontVariant'];
  return style;
}

export const motion = {
  duration: { sm: 120, md: 200, lg: 320 },
  easing: { standard: [0.2, 0, 0, 1] as const }, // cubic-bezier(0.2, 0, 0, 1)
  stagger: 30, // ms, primeras 6 filas
  // Solo formas de marca en primer uso, vacío y offline sin caché.
  // Nunca en cifras (portada, fila, porcentajes, cuenta atrás): sin bounce.
  springShape: { damping: 16, stiffness: 180, mass: 1, overshootClamping: false },
  heroCollapseScroll: { start: 0, compactFrom: 80, compactVisible: 120 },
  // Colapso: transform (translateY / scale), no fontSize. El contenido se queda.
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
  accentNav: '#EDB01A', // ONLY for accent.nav roles (r4). Never a model signal.
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
  accentNav: '#EDB01A', // ONLY for accent.nav roles (r4). Never a model signal.
  accentNavInk: '#151515',
  logoDisc: '#151515',
  logoDiscInk: '#F4EEDF',
  score: '#151515',
  scoreMuted: '#5E5950',
  bannerBg: '#E8E0CC',
  bannerBorder: '#AE2440',
  crimsonHero: '#AE2440', // cream on this 5.80 AA. Do not put ink on the end zone.
  playField: '#E8E0CC',
  fieldTick: '#BAB3A4', // ink 22% on playField, 1.59:1, texture only
  fieldCap: '#D9D1BD',
  // Light tints, counterparts of the dark blueDeep / crimsonDeep / glass.
  blueDeep: '#D5DEEE',
  crimsonDeep: '#F0D4DA',
  blueSoft: '#3E68B0', // 4.76 on cream (AA). 4.19 on surface: not body on surface.
  glass: '#EFE8D6',
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
  yellowOnBg: 8.55, // r4: TOMORROW / TODAY kicker text
  yellowOnSurface: 7.36, // r4: nav indicator on the #262B30 nav
  yellowOnPlayField: 9.2, // r4: 50 line, 2 dp (Detail, strip and row field, all on #14181C)
  fieldTickOnPlayField: 1.72, // no cumple 3:1; solo textura
  cream25OnPlayField: 2.13, // filete del campo, no es el dato
  cream60OnPlayField: 6.18, // línea de 50%
} as const;

// Light theme, same WCAG 2 formula. 50% line uses textMuted on playField.
export const contrastLight = {
  inkOnBg: 15.78,
  inkOnSurface: 13.88,
  mutedOnBg: 6.01,
  mutedOnSurface: 5.29,
  modelOnBg: 6.75,
  modelOnSurface: 5.94,
  modelOnPlayField: 5.94,
  creamOnCrimsonHero: 5.80,
  inkOnCream: 15.78,
  inkOnYellow: 9.41, // r4: kicker chip, active orb and nav indicator
  yellowOnBg: 1.68, // r4: FORBIDDEN as text or bare shape on light
  yellowOnPlayField: 1.47, // r4: hence the 1 dp ink edges on the 50 line
  yellowOnRowField: 1.68, // r4: row field in the card is #F4EEDF; ink edges again
  inkOnRowField: 15.78, // r4: ink edge of the row 50 line on #F4EEDF
  inkOnPlayField: 13.88, // r4: ink edge of the 50 line
  fieldTickOnPlayField: 1.59, // texture only, same role as dark 1.72
  mutedOnPlayField: 5.29, // 50% line in light
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

// H3 How it is calculated (18 nov 2026, America/Mexico_City).
// H3.1 (19 nov 2026): heights, type, and frozen holdout bins from DATA_values.md.
// No existing hex is changed.
export const chart = {
  how: {
    padX: 16,
    contentWidth: 358,
    stepGap: 48, // 24 + hairline + 24
    kickerToTitle: 8,
    titleToBody: 16,
    bodyGap: 12,
    bodyToChart: 24,
    timeline: { width: 358, height: 228, radius: 12, years: [1999, 2016, 2024, 2026] as const },
    strength: { width: 358, height: 340, barHeight: 16, monogram: 32, field: 72 },
    rule: {
      width: 358,
      thumb: 20,
      // Product thresholds (coverFromHomeProb). Not invented.
      thresholds: [0.55, 0.95] as const,
      // Pedagogical example states, labeled illustrative. Not live games.
      examples: [0.52, 0.69, 0.96] as const,
    },
    flow: { width: 358, height: 424, nodeHeight: 52, radius: 12, gap: 16, gate: 88 },
    // Labeled example from track_record.json on 19 nov 2026. App binds {k} of {n}.
    calls: { exampleK: 23, exampleN: 29 },
    motion: {
      reveal: 320,
      easing: [0.2, 0, 0, 1] as const,
      translateY: 8,
      staggerInStep: 30,
      reducedMotion: 'static' as const,
    },
  },
  calibration: {
    width: 358,
    plotHeight: 268,
    point: 8,
    axisPad: 44,
    diagonalStyle: 'dashed' as const,
    // Frozen holdout 2024 to 2025, h2_full pooled, 10 equal-count groups, 57 games each.
    // Source: docs/experiments/reports/holdout_2024_2025.json, via DATA_values.md.
    nBin: 57,
    nHoldout: 570,
    pred: [0.277, 0.376, 0.435, 0.485, 0.536, 0.587, 0.638, 0.687, 0.752, 0.836] as const,
    obs: [0.298, 0.246, 0.474, 0.386, 0.456, 0.614, 0.649, 0.667, 0.719, 0.895] as const,
  },
} as const;

// r4 color (19 nov 2026, America/Mexico_City). Decision by Carlos.
// Yellow #EDB01A is a NAVIGATION AND TIME accent. Closed list: any new
// use needs approval. Never a recommendation or model signal. Model
// labels and the O ring stay blue (decided 19 nov 2026).
export const accent = {
  nav: {
    color: '#EDB01A',
    ink: '#151515',
    roles: ['nextKickoffKicker', 'weekSelectorActive', 'navIndicator', 'fieldMidline'] as const,
    // Day header of the day that holds the next kickoff, only when it reads
    // TODAY / TOMORROW (HOY / MAÑANA). Other day headers stay textMuted.
    nextKickoffKicker: {
      dark: { text: '#EDB01A' }, // 8.55 on bg
      light: { fill: '#EDB01A', text: '#151515', height: 20, padX: 6, radius: 4 }, // 9.41
    },
    weekSelectorActive: {
      dark: { fill: '#EDB01A', text: '#151515', border: 0 }, // replaces cream fill (F26)
      light: { fill: '#EDB01A', text: '#151515', border: { width: 1.5, color: '#151515' } },
    },
    navIndicator: {
      size: { width: 56, height: 32 }, // nav.indicator
      dark: { fill: '#EDB01A', icon: '#151515', border: 0 }, // 7.36 vs nav surface
      light: { fill: '#EDB01A', icon: '#151515', border: { width: 1.5, color: '#151515' } },
      label: 'text', // the tab label stays cream / ink, never yellow
    },
    // ONE role on every field: Detail, the Week masthead strip and each Week
    // row mini field (296 x 24). Decided by Carlos, 19 nov 2026. Widget: none.
    fieldMidline: {
      surfaces: ['detailField', 'weekStrip', 'weekRow'] as const,
      dark: { width: 2, color: '#EDB01A' }, // 9.2 on playField
      light: { core: 2, color: '#EDB01A', edge: 1, edgeColor: '#151515' }, // 4 dp total
    },
  },
} as const;

// Thin crimson end zones in Week (r4). Width rule, same aspect as Detail:
// endZone = height * 30 / 112, rounded to an even dp.
// Detail 112 -> 30 (reference 360), strip 72 -> 20, row 24 -> 6.
// x = e + (w - 2e) * p / 100 with p = home percent. clamp keeps the 16 dp
// ring (r 8) inside the play area: [e + 8, w - e - 8].
export const weekField = {
  endZoneRatio: 30 / 112,
  endZone: { dark: '#9A3350', light: '#AE2440' }, // crimsonHero of each palette
  row: { width: 296, height: 24, endZone: 6, play: 284, clamp: [14, 282] as const }, // x = 6 + 2.84p
  strip: { width: 328, height: 72, endZone: 20, play: 288, clamp: [28, 300] as const }, // x = 20 + 2.88p
  // Play field inside the row card. Light uses bg because the card is surface.
  playFieldInCard: { dark: '#14181C', light: '#F4EEDF' },
  // Row 50 line = accent.nav.fieldMidline at the row field center (x 148),
  // full 24 dp height. Dark: 2 dp accentNav on #14181C (9.2). Light: 1 ink +
  // 2 accentNav + 1 ink, 4 dp (ink 15.78 on #F4EEDF; bare yellow 1.68).
  rowMidline: { x: 148, height: 24, dark: { width: 2 }, light: { core: 2, edge: 1, total: 4 } },
  // Near 50 (2.84 dp per point): the filled ring (outer r 8) fully hides the
  // line when |p - 50| <= 2.4 (dark, 2 dp) or <= 2.1 (light, 4 dp), and
  // touches it up to |p - 50| = 3.2 (dark) / 3.5 (light). Those games are all toss-ups
  // (pFav < 0.55 means |p - 50| < 5), labeled chip.tossup, so a ring sitting
  // on or touching the line reads as "even", which is true. The clamp
  // [14, 282] never comes near the line (134 dp away).
  // Rings are filled with the play field color so the 50 line never crosses them.
  ringFill: 'playField' as const,
  // Model label sits 6 dp right of the ring; flips to the left when it would
  // pass w - e - 4. Label color stays model blue (modelLabel).
  labelGap: 6,
  x: (pHomePercent: number, f: { width: number; endZone: number }) =>
    f.endZone + (f.width - 2 * f.endZone) * (pHomePercent / 100),
  clampX: (x: number, f: { clamp: readonly [number, number] }) =>
    Math.min(f.clamp[1], Math.max(f.clamp[0], x)),
} as const;

// Week row card (r4). REPLACES the rhythm.week row box (132) for the list.
// Box: padding 16 + kicker 16 + 8 + names 2 x 24 + 8 + mini field 24 + 16 = 136.
// Cards are separated by 12. Kicker at x 16 inside the card (F27). Favorite
// Jost 700 text, rival Jost 400 textMuted (F27). Logo 24 centered on its
// 24 dp name line, 12 to the name. The 48 figure bottom-aligns with the names.
export const weekCard = {
  marginX: 16, // card width 328 on a 360 screen
  padding: 16,
  gap: 12,
  radius: 16, // radius.tile
  border: 1, // palette.border
  bg: 'surface' as const,
  content: { kicker: 16, kickerToNames: 8, nameLine: 24, namesToField: 8, field: 24 },
  box: 136,
  contentWidth: 296,
  logoToName: 12,
} as const;
