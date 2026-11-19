export type DayBucket = 'today' | 'tomorrow' | 'weekday';

export type CountdownCopy = {
  key: 'detail.countdown' | 'detail.countdown.short' | 'detail.countdown.min';
  vars: Record<string, number>;
};

function localDayStart(ms: number): number {
  const date = new Date(ms);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function dayBucket(kickoffMs: number, nowMs: number): DayBucket {
  const diff = Math.round((localDayStart(kickoffMs) - localDayStart(nowMs)) / 86_400_000);
  if (diff === 0) {
    return 'today';
  }
  if (diff === 1) {
    return 'tomorrow';
  }
  return 'weekday';
}

export function groupByLocalDay<T extends { kickoff: string }>(
  games: T[],
  nowMs: number,
): { bucket: DayBucket; at: number; games: T[] }[] {
  const groups: { bucket: DayBucket; at: number; games: T[] }[] = [];
  for (const game of games) {
    const at = Date.parse(game.kickoff);
    const stamp = Number.isFinite(at) ? at : nowMs;
    const bucket = Number.isFinite(at) ? dayBucket(stamp, nowMs) : 'weekday';
    const day = Number.isFinite(at) ? localDayStart(stamp) : 0;
    const last = groups[groups.length - 1];
    if (last && last.bucket === bucket && localDayStart(last.at) === day) {
      last.games.push(game);
      continue;
    }
    groups.push({ bucket, at: stamp, games: [game] });
  }
  return groups;
}

/** Remaining time until kickoff. Null once the game has started. */
export function countdownCopy(remainingMs: number): CountdownCopy | null {
  if (!Number.isFinite(remainingMs) || remainingMs <= 0) {
    return null;
  }
  const totalMin = Math.floor(remainingMs / 60_000);
  const days = Math.floor(totalMin / (24 * 60));
  const hours = Math.floor((totalMin % (24 * 60)) / 60);
  const minutes = totalMin % 60;
  if (days >= 1) {
    return { key: 'detail.countdown', vars: { d: days, h: hours } };
  }
  if (hours >= 1) {
    return { key: 'detail.countdown.short', vars: { h: hours, m: minutes } };
  }
  return { key: 'detail.countdown.min', vars: { m: Math.max(1, minutes) } };
}
