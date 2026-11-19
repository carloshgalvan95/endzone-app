import fs from 'node:fs';
import path from 'node:path';

import { translate } from '@/i18n';
import { numberLocaleFor, resolveLocale } from '@/i18n/resolve';
import { en, es, stringKeys } from '@/i18n/catalog';
import { monogramLetters, resolveLogoStep } from '@/logos/resolve';
import { fieldMarkerX, fieldX } from '@/slate/field';
import { hydratePreference } from '@/prefs/hydratePreference';
import { countdownCopy, dayBucket, groupByLocalDay } from '@/ui/schedule';
import { motionDuration, resolveThemePreference } from '@/theme/resolveTheme';
import { assignStripLanes, coverFromHomeProb, weekField } from '@/theme/h2';
import { rowLabelLeft } from '@/ui/FieldStrip';
import { darkLogoMark, darkLogoRatio, meanOpaqueContrast } from '@/logos/contrast';
import {
  formatCount,
  formatLivePair,
  formatLoss,
  howLiveBindings,
  selectHowSummary,
} from '@/ui/howBindings';
import { formatCompactWhen } from '@/ui/weekModel';
import { favoritePercentLabel, weekRowFigure } from '@/ui/weekFigure';
import { widgetCopy } from '@/widget/copy';
import { widgetMark } from '@/widget/mark';
import { selectNextKickoff, widgetLayout } from '@/widget/select';

const table: { p: number; phrase: string; n: number }[] = [
  { p: 0.3, phrase: 'in 10', n: 7 },
  { p: 0.72, phrase: 'in 10', n: 7 },
  { p: 0.52, phrase: 'Toss-up', n: 5 },
  { p: 0.68, phrase: 'in 10', n: 7 },
  { p: 0.61, phrase: 'in 10', n: 6 },
  { p: 0.55, phrase: 'in 10', n: 6 },
  { p: 0.8, phrase: 'in 10', n: 8 },
  { p: 0.41, phrase: 'in 10', n: 6 },
  { p: 0.96, phrase: 'More than 9 in 10', n: 9 },
  { p: 0.57, phrase: 'in 10', n: 6 },
  { p: 0.64, phrase: 'in 10', n: 6 },
  { p: 0.7, phrase: 'in 10', n: 7 },
  { p: 0.5, phrase: 'Toss-up', n: 5 },
  { p: 0.63, phrase: 'in 10', n: 6 },
];

describe('cover figure', () => {
  test('matches the H2 verification table and never returns 10', () => {
    for (const row of table) {
      const cover = coverFromHomeProb(row.p);
      expect(cover.phrase).toBe(row.phrase);
      expect(cover.n).toBe(row.n);
      expect(cover.n).toBeLessThanOrEqual(9);
      expect(cover.n).toBeGreaterThanOrEqual(5);
      expect(cover.pFav).toBeCloseTo(Math.max(row.p, 1 - row.p));
    }
  });
});

describe('field mapping', () => {
  test('places 72 percent at 246 and clamps the marker', () => {
    expect(fieldX(0.72)).toBeCloseTo(246);
    expect(fieldX(0)).toBeCloseTo(30);
    expect(fieldX(1)).toBeCloseTo(330);
    expect(fieldMarkerX(0)).toBeCloseTo(38);
    expect(fieldMarkerX(1)).toBeCloseTo(322);
  });
});

describe('i18n catalog', () => {
  test('every handoff key exists in English and Spanish', () => {
    const csv = fs.readFileSync(
      path.join(process.cwd(), 'docs/design/sprint3/strings_en_es.csv'),
      'utf8',
    );
    const keys = csv
      .split('\n')
      .slice(1)
      .map((line) => line.split(',')[0] ?? '')
      .filter((key) => key.length > 0);
    expect(keys.length).toBe(191);
    for (const key of keys) {
      expect(en[key as keyof typeof en]?.length).toBeGreaterThan(0);
      expect(es[key as keyof typeof es]?.length).toBeGreaterThan(0);
    }
    expect(stringKeys).toHaveLength(191);
    expect(resolveLocale('system', 'es-MX')).toBe('es');
    expect(resolveLocale('system', 'en-US')).toBe('en');
    expect(resolveLocale('en', 'es')).toBe('en');
    expect(translate('en', 'cover.in10', { n: 7 })).toBe('7 in 10');
    expect(translate('es', 'cover.tossup')).toBe('Juego parejo');
    expect(translate('es', 'wid.cover', { n: 7, team: 'Halcones' })).toBe('7 de 10 Halcones');
  });
});

describe('logo fallback', () => {
  const now = 1_000_000_000_000;
  test('follows flag, cache, network, then monogram', () => {
    expect(resolveLogoStep({ enabled: false, cacheSavedAt: now, now, networkFailed: false })).toBe(
      'monogram',
    );
    expect(
      resolveLogoStep({ enabled: true, cacheSavedAt: now - 1000, now, networkFailed: false }),
    ).toBe('cache');
    expect(resolveLogoStep({ enabled: true, cacheSavedAt: null, now, networkFailed: false })).toBe(
      'network',
    );
    expect(resolveLogoStep({ enabled: true, cacheSavedAt: null, now, networkFailed: true })).toBe(
      'monogram',
    );
    expect(monogramLetters('nyg', 'Giants')).toBe('NYG');
  });
});

describe('strip lanes and week field', () => {
  test('keeps every ring and separates a dense strip', () => {
    const packed = Array.from({ length: 8 }, (_, index) => ({
      id: `g${index}`,
      x: 180 + index * 4,
      kickoff: index,
    }));
    const placed = assignStripLanes(packed);
    expect(Object.keys(placed.lanes)).toHaveLength(8);
    expect(placed.diameter).toBeLessThanOrEqual(16);
    const byLane: Record<number, number[]> = {};
    for (const lane of Object.values(placed.lanes)) {
      const bucket = byLane[lane.y] ?? [];
      bucket.push(lane.x);
      byLane[lane.y] = bucket;
    }
    for (const xs of Object.values(byLane)) {
      const sorted = [...xs].sort((a, b) => a - b);
      for (let index = 1; index < sorted.length; index += 1) {
        expect(sorted[index]! - sorted[index - 1]!).toBeGreaterThanOrEqual(placed.diameter);
      }
    }
  });

  test('places the strip and row rings with the thin end zone formulas', () => {
    expect(weekField.x(72, weekField.strip)).toBeCloseTo(20 + 2.88 * 72);
    expect(weekField.clampX(0, weekField.strip)).toBe(28);
    expect(weekField.clampX(400, weekField.strip)).toBe(300);
    expect(weekField.x(50, weekField.row)).toBeCloseTo(6 + 2.84 * 50);
    expect(weekField.clampX(0, weekField.row)).toBe(14);
    expect(weekField.clampX(400, weekField.row)).toBe(282);
  });
});

describe('how copy', () => {
  test('every how key resolves in Spanish to the catalog, not an English fallback', () => {
    const csv = fs.readFileSync(
      path.join(process.cwd(), 'docs/design/sprint3/strings_en_es.csv'),
      'utf8',
    );
    const rows = csv
      .split('\n')
      .slice(1)
      .map((line) => line.split(',')[0] ?? '')
      .filter((key) => key.startsWith('how.'));
    expect(rows).toHaveLength(80);
    for (const key of rows) {
      const spanish = es[key as keyof typeof es];
      expect(spanish.length).toBeGreaterThan(0);
      const vars: Record<string, string> = {};
      for (const match of spanish.matchAll(/\{(\w+)\}/g)) {
        const name = match[1] ?? '';
        vars[name] = `{${name}}`;
      }
      expect(translate('es', key, vars)).toBe(spanish);
    }
    expect(translate('es', 'how.title')).toBe('Cómo se calcula');
    expect(translate('es', 'how.s1.title')).not.toBe(en['how.s1.title']);
  });
});

describe('how live bindings', () => {
  test('binds hits and keeps the market sentence conditional', () => {
    const lower = howLiveBindings({
      pick_hits: 23,
      pick_misses: 6,
      model_log_loss: 0.559,
      market_log_loss: 0.506,
      sample_label: 'small',
    });
    expect(lower).toMatchObject({ k: 23, n: 29, marketLower: true, small: true });
    const higher = howLiveBindings({
      pick_hits: 10,
      pick_misses: 2,
      model_log_loss: 0.4,
      market_log_loss: 0.5,
      sample_label: null,
    });
    expect(higher?.marketLower).toBe(false);
    expect(howLiveBindings(null)).toBeNull();
    const sample = howLiveBindings({
      pick_hits: 8,
      pick_misses: 3,
      model_log_loss: 0.612,
      market_log_loss: 0.588,
      sample_label: 'small',
    });
    expect(sample?.marketLower).toBe(true);
    expect(formatLivePair(0.612, 0.588, 'en')).toBe('0.612 vs 0.588');
    expect(formatLivePair(0.612, 0.588, 'es')).toBe('0,612 contra 0,588');
    expect(sample).not.toMatchObject({ k: 23, n: 29 });
  });
});

describe('logo contrast', () => {
  const teams: { abbr: string; mark: 'monogram' | 'logo' }[] = [
    { abbr: 'NYG', mark: 'monogram' },
    { abbr: 'NYJ', mark: 'monogram' },
    { abbr: 'CAR', mark: 'monogram' },
    { abbr: 'IND', mark: 'logo' },
    { abbr: 'ARI', mark: 'logo' },
    { abbr: 'BUF', mark: 'logo' },
    { abbr: 'WAS', mark: 'logo' },
    { abbr: 'BAL', mark: 'logo' },
    { abbr: 'HOU', mark: 'logo' },
    { abbr: 'KC', mark: 'logo' },
  ];

  test('the mean of opaque pixels decides the dark slot', () => {
    const navy = new Uint8Array([0x00, 0x1d, 0x67, 255, 0x00, 0x1d, 0x67, 10]);
    expect(meanOpaqueContrast(navy)).toBeCloseTo(1.07, 1);
    expect(meanOpaqueContrast(new Uint8Array([255, 255, 255, 255])) ?? 0).toBeGreaterThan(3);
    expect(meanOpaqueContrast(new Uint8Array([255, 255, 255, 10]))).toBeNull();
  });

  test.each(teams)('$abbr is a $mark from the decoded logo ratio', ({ abbr, mark }) => {
    const ratio = darkLogoRatio(abbr);
    expect(ratio).not.toBeNull();
    expect(darkLogoMark(abbr)).toBe(mark);
    expect((ratio ?? 0) < 3).toBe(mark === 'monogram');
  });
});

describe('how fixture gate', () => {
  test('a release build ignores the screenshot fixture', () => {
    expect(selectHowSummary(null, true, false)).toBeNull();
    expect(selectHowSummary(null, true, true)).toMatchObject({
      pick_hits: 11,
      pick_misses: 5,
      model_log_loss: 0.612,
      market_log_loss: 0.588,
    });
    expect(formatLoss(0.612, 'es-MX')).toBe('0.612');
    expect(formatCount(7000, 'es-MX')).toBe('7,000');
    expect(formatLoss(0.612, 'es-ES')).toBe('0,612');
    expect(numberLocaleFor('es', 'es-MX')).toBe('es-MX');
    expect(numberLocaleFor('es', 'es')).toBe('es-MX');
    expect(numberLocaleFor('es', 'es-ES')).toBe('es-ES');
  });
});

describe('row label and compact stamp', () => {
  test('keeps 6 dp from the ring and flips before the end zone', () => {
    expect(rowLabelLeft(100, 40, 326)).toBe(114);
    const flipped = rowLabelLeft(250, 80, 326);
    expect(flipped).toBe(156);
    expect(flipped + 80).toBe(250 - 14);
  });

  test('compact stamp drops the saved word', () => {
    const iso = '2026-11-18T19:03:00Z';
    expect(formatCompactWhen(iso, 'en')).toMatch(/^Wed Nov 18,/);
    expect(formatCompactWhen(iso, 'es')).toMatch(/^mié 18 nov,/);
    expect(formatCompactWhen(iso, 'es')).not.toMatch(/Guardado/);
    expect(formatCompactWhen(iso, 'en')).not.toMatch(/Saved/);
  });
});

describe('preference hydration', () => {
  test('keeps a choice made this session when an older stored value arrives later', () => {
    expect(hydratePreference('dark', 'light', true, ['system', 'light', 'dark'])).toBe('light');
    expect(hydratePreference('en', 'es', true, ['system', 'en', 'es'])).toBe('es');
    expect(hydratePreference('dark', 'system', false, ['system', 'light', 'dark'])).toBe('dark');
    expect(hydratePreference(null, 'system', false, ['system', 'en', 'es'])).toBe('system');
    expect(hydratePreference('nope', 'system', false, ['system', 'light', 'dark'])).toBe('system');
  });
});

describe('theme, countdown, and motion', () => {
  test('keeps an explicit theme and follows the phone on auto', () => {
    expect(resolveThemePreference('light', 'dark')).toBe('light');
    expect(resolveThemePreference('dark', 'light')).toBe('dark');
    expect(resolveThemePreference('system', 'light')).toBe('light');
    expect(resolveThemePreference('system', null)).toBe('dark');
  });

  test('formats the countdown in days, hours, and minutes', () => {
    expect(countdownCopy(26 * 60 * 60 * 1000)).toEqual({
      key: 'detail.countdown',
      vars: { d: 1, h: 2 },
    });
    expect(countdownCopy(3 * 60 * 60 * 1000 + 5 * 60 * 1000)).toEqual({
      key: 'detail.countdown.short',
      vars: { h: 3, m: 5 },
    });
    expect(countdownCopy(12 * 60 * 1000)?.key).toBe('detail.countdown.min');
    expect(countdownCopy(0)).toBeNull();
  });

  test('groups kickoffs into today, tomorrow, and a later weekday', () => {
    const now = Date.parse('2026-11-20T15:00:00');
    expect(dayBucket(Date.parse('2026-11-20T23:00:00'), now)).toBe('today');
    expect(dayBucket(Date.parse('2026-11-21T01:00:00'), now)).toBe('tomorrow');
    const groups = groupByLocalDay(
      [
        { kickoff: '2026-11-20T18:00:00' },
        { kickoff: '2026-11-21T18:00:00' },
        { kickoff: '2026-11-22T18:00:00' },
      ],
      now,
    );
    expect(groups.map((group) => group.bucket)).toEqual(['today', 'tomorrow', 'weekday']);
  });

  test('snaps motion to 1 ms when reduce motion is on', () => {
    expect(motionDuration('lg', false)).toBe(320);
    expect(motionDuration('sm', true)).toBe(1);
    expect(motionDuration('md', true)).toBe(1);
  });
});

describe('week row figure', () => {
  test('names the favorite beside the compact figure and drops the name on a toss-up', () => {
    expect(
      weekRowFigure({
        phrase: 'in 10',
        n: 7,
        favorite: 'Texans',
        in10Short: 'in 10',
        tossup: 'Toss-up',
        more9: 'More than 9 in 10',
      }),
    ).toEqual({ digit: '7', phrase: 'in 10 Texans' });
    expect(
      weekRowFigure({
        phrase: 'in 10',
        n: 7,
        favorite: 'Texans',
        in10Short: 'de 10',
        tossup: 'Juego parejo',
        more9: 'Más de 9 de cada 10',
      }).phrase,
    ).toBe('de 10 Texans');
    expect(
      weekRowFigure({
        phrase: 'Toss-up',
        n: 5,
        favorite: 'Texans',
        in10Short: 'in 10',
        tossup: 'Toss-up',
        more9: 'More than 9 in 10',
      }),
    ).toEqual({ digit: null, phrase: 'Toss-up' });
    expect(favoritePercentLabel(0.3)).toBe('70%');
    expect(favoritePercentLabel(0.72)).toBe('72%');
  });
});

describe('widget monogram', () => {
  const now = 1_000_000_000_000;
  test('falls back to a monogram when the flag is off, the cache is cold, or the network fails', () => {
    expect(
      widgetMark({
        enabled: false,
        abbr: 'ATL',
        name: 'Falcons',
        color: '#9A3350',
        logoUrl: 'https://example.test/atl.png',
        cacheSavedAt: now,
        now,
        networkFailed: false,
      }).uri,
    ).toBeNull();
    const cached = widgetMark({
      enabled: true,
      abbr: 'ATL',
      name: 'Falcons',
      color: '#9A3350',
      logoUrl: 'https://example.test/atl.png',
      cacheSavedAt: now,
      now,
      networkFailed: false,
    });
    expect(cached.uri).toBe('https://example.test/atl.png');
    expect(cached.letters).toBe('ATL');
    const failed = widgetMark({
      enabled: true,
      abbr: 'nyj',
      name: 'Jets',
      color: null,
      logoUrl: 'https://example.test/nyj.png',
      cacheSavedAt: null,
      now,
      networkFailed: true,
    });
    expect(failed.uri).toBeNull();
    expect(failed.letters).toBe('NYJ');
  });
});

describe('widget selection', () => {
  test('picks the next kickoff and the layout from size', () => {
    const now = Date.parse('2026-11-12T18:00:00Z');
    const next = selectNextKickoff(
      [
        { id: 'past', kickoff: '2026-11-12T12:00:00Z', status: 'scheduled' as const },
        { id: 'next', kickoff: '2026-11-12T20:00:00Z', status: 'scheduled' as const },
        { id: 'done', kickoff: '2026-11-13T20:00:00Z', status: 'final' as const },
      ],
      now,
    );
    expect(next?.id).toBe('next');
    expect(widgetLayout(156, 156)).toBe('2x2');
    expect(widgetLayout(328, 156)).toBe('4x2');
    expect(widgetLayout(328, 72)).toBe('4x1');
  });

  test('names the favorite on wide layouts and keeps a toss-up unnamed', () => {
    const base = {
      offline: false as const,
      empty: 'none' as const,
      when: 'Sun',
      updatedAt: 'Mon',
      phrase: 'in 10' as const,
      n: 7,
      team: 'Hawks',
      away: 'NYJ',
      home: 'ATL',
    };
    const small = widgetCopy({ ...base, strings: en, layout: '2x2' });
    expect(small.nameLine).toBe('Hawks');
    expect(small.figure).toBe('7 in 10');
    expect(small.match).toBeNull();
    expect(small.showLogos).toBe(false);
    const wide = widgetCopy({ ...base, strings: en, layout: '4x2' });
    expect(wide.figure).toBe('7 in 10 Hawks');
    expect(wide.match).toBe('NYJ at ATL');
    expect(wide.showField).toBe(true);
    const strip = widgetCopy({ ...base, strings: en, layout: '4x1' });
    expect(strip.match).toBeNull();
    expect(strip.showLogos).toBe(false);
    const toss = widgetCopy({ ...base, strings: en, layout: '4x2', phrase: 'Toss-up' });
    expect(toss.figure).toBe('Toss-up');
    expect(toss.nameLine).toBeNull();
    const spanish = widgetCopy({ ...base, strings: es, layout: '4x2' });
    expect(spanish.figure).toBe('7 de 10 Hawks');
    expect(spanish.match).toBe('NYJ en ATL');
    const more = widgetCopy({
      ...base,
      strings: en,
      layout: '4x1',
      phrase: 'More than 9 in 10',
    });
    expect(more.figure).toBe('More than 9 Hawks');
  });
});
