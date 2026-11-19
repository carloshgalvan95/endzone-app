export type WeekCalls = {
  week: number;
  state: 'no_finals' | 'partial' | 'complete';
  pick_hits: number;
  pick_misses: number;
};

export function decidedCalls(week: WeekCalls): number {
  return week.pick_hits + week.pick_misses;
}

/** Weeks from the first with a final through the current week. Earlier empty weeks drop. */
export function weeksOnChart(weeks: WeekCalls[], currentWeek: number | null): WeekCalls[] {
  const capped = currentWeek == null ? weeks : weeks.filter((week) => week.week <= currentWeek);
  const first = capped.find((week) => decidedCalls(week) > 0);
  if (!first) {
    return [];
  }
  return capped.filter((week) => week.week >= first.week);
}

export function bestWeek(weeks: WeekCalls[]): WeekCalls | null {
  const played = weeks.filter((week) => decidedCalls(week) > 0);
  return played.reduce<WeekCalls | null>((best, week) => {
    if (!best) {
      return week;
    }
    if (week.pick_hits !== best.pick_hits) {
      return week.pick_hits > best.pick_hits ? week : best;
    }
    if (week.pick_misses !== best.pick_misses) {
      return week.pick_misses < best.pick_misses ? week : best;
    }
    return week.week > best.week ? week : best;
  }, null);
}

export function latestWeek(weeks: WeekCalls[]): WeekCalls | null {
  const played = weeks.filter((week) => decidedCalls(week) > 0);
  return played.reduce<WeekCalls | null>(
    (latest, week) => (!latest || week.week > latest.week ? week : latest),
    null,
  );
}

export function secondaryWeeks(weeks: WeekCalls[]): { single: boolean; tiles: WeekCalls[] } {
  const best = bestWeek(weeks);
  const latest = latestWeek(weeks);
  const played = weeks.filter((week) => decidedCalls(week) > 0);
  if (!latest || !best || played.length < 2 || best.week === latest.week) {
    return { single: true, tiles: latest ? [latest] : [] };
  }
  return { single: false, tiles: [best, latest] };
}
