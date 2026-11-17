import { selectionFromParams, slateUrl, weekFileName } from './urls';

describe('slate urls', () => {
  test('builds the latest and week urls', () => {
    expect(slateUrl({ kind: 'latest' })).toBe(
      'https://carloshgalvan95.github.io/endzone-mlops/data/latest.json',
    );
    expect(slateUrl({ kind: 'week', season: 2026, week: 10 })).toBe(
      'https://carloshgalvan95.github.io/endzone-mlops/data/predictions/2026-w10.json',
    );
  });

  test('rejects a week that is not a positive integer', () => {
    expect(() => weekFileName(2026, 0)).toThrow(/positive integers/);
  });

  test('reads season and week params', () => {
    expect(selectionFromParams({})).toEqual({ kind: 'latest' });
    expect(selectionFromParams({ season: '2026', week: '9' })).toEqual({
      kind: 'week',
      season: 2026,
      week: 9,
    });
    expect(selectionFromParams({ season: '2026' })).toBe('invalid');
    expect(selectionFromParams({ season: '0', week: '1' })).toBe('invalid');
    expect(selectionFromParams({ season: ['2026'], week: ['10'] })).toEqual({
      kind: 'week',
      season: 2026,
      week: 10,
    });
  });
});
