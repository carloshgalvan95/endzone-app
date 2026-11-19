import fs from 'node:fs';
import path from 'node:path';

import { translate } from '@/i18n';
import { resolveLocale } from '@/i18n/resolve';
import { en, es, stringKeys } from '@/i18n/catalog';
import { monogramLetters, resolveLogoStep } from '@/logos/resolve';
import { fieldMarkerX, fieldX } from '@/slate/field';
import { coverFromHomeProb } from '@/theme/h2';
import { widgetCopy } from '@/widget/copy';
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
    expect(keys.length).toBe(106);
    for (const key of keys) {
      expect(en[key as keyof typeof en]?.length).toBeGreaterThan(0);
      expect(es[key as keyof typeof es]?.length).toBeGreaterThan(0);
    }
    expect(stringKeys).toHaveLength(106);
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
