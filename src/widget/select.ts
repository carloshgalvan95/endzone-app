export type WidgetCandidate = {
  id: string;
  kickoff: string;
  status: 'scheduled' | 'final';
};

/** The next kickoff that is not final. Scheduled games with no clock sort after dated ones. */
export function selectNextKickoff<T extends WidgetCandidate>(games: T[], now: number): T | null {
  const upcoming = games.filter((game) => game.status !== 'final');
  const dated = upcoming
    .map((game) => ({ game, time: Date.parse(game.kickoff) }))
    .filter((item) => Number.isFinite(item.time))
    .sort((left, right) => left.time - right.time);
  const future = dated.find((item) => item.time >= now);
  if (future) {
    return future.game;
  }
  const started = [...dated].reverse().find((item) => item.time < now);
  if (started) {
    return started.game;
  }
  return upcoming[0] ?? null;
}

export type WidgetLayout = '2x2' | '4x2' | '4x1';

export function widgetLayout(width: number, height: number): WidgetLayout {
  if (height > 0 && height <= 100) {
    return '4x1';
  }
  if (width >= 240) {
    return '4x2';
  }
  return '2x2';
}
