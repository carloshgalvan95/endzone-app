import { formatDiffPp, formatKickoff, formatMargin, homePick, modelDisagrees } from './format';

describe('slate formatting', () => {
  test('formats probability gaps in percentage points', () => {
    expect(formatDiffPp(0.175782)).toBe('+17.6 pp');
    expect(formatDiffPp(-0.032)).toBe('-3.2 pp');
    expect(formatDiffPp(0)).toBe('0.0 pp');
  });

  test('marks a disagreement at the threshold', () => {
    expect(modelDisagrees(0.05, 5)).toBe(true);
    expect(modelDisagrees(0.049, 5)).toBe(false);
    expect(modelDisagrees(null, 5)).toBe(false);
  });

  test('rounds the home pick the way the site does', () => {
    expect(homePick(0.718526)).toBe('home');
    expect(homePick(0.494)).toBe('away');
    expect(homePick(0.5)).toBe('tie');
  });

  test('describes margin from the home side', () => {
    expect(formatMargin(6.975388)).toBe('Home by 7.0');
    expect(formatMargin(-3.2)).toBe('Away by 3.2');
    expect(formatMargin(null)).toBe('n/a');
  });

  test('keeps a date-only kickoff and formats a timestamp in Mexico City', () => {
    expect(formatKickoff('2026-11-15')).toContain('Nov');
    expect(formatKickoff('2026-11-15')).toContain('15');
    const stamped = formatKickoff('2026-11-12T20:15:00-05:00');
    expect(stamped).toContain('Nov');
    expect(stamped).toContain('12');
  });
});
