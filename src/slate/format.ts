import type { Game } from '@/contract/types';

export function formatPercent(probability: number): string {
  return `${(probability * 100).toFixed(1)}%`;
}

export function formatDiffPp(diff: number): string {
  const rounded = (diff * 100).toFixed(1);
  if (rounded === '-0.0' || rounded === '0.0') {
    return '0.0 pp';
  }
  if (diff > 0) {
    return `+${rounded} pp`;
  }
  return `${rounded} pp`;
}

export function modelDisagrees(diff: number | null, thresholdPp: number): boolean {
  if (diff == null || !Number.isFinite(diff) || !Number.isFinite(thresholdPp)) {
    return false;
  }
  return Math.abs(diff) * 100 + 1e-6 >= thresholdPp;
}

export function homePick(modelHomeWp: number): 'home' | 'away' | 'tie' {
  const rounded = Math.round(modelHomeWp * 100);
  if (rounded > 50) {
    return 'home';
  }
  if (rounded < 50) {
    return 'away';
  }
  return 'tie';
}

export function formatMargin(margin: number | null): string {
  if (margin == null || !Number.isFinite(margin)) {
    return 'n/a';
  }
  const abs = Math.abs(margin).toFixed(1);
  if (Number(abs) === 0) {
    return 'Even';
  }
  if (margin > 0) {
    return `Home by ${abs}`;
  }
  return `Away by ${abs}`;
}

export function formatTotal(total: number | null): string {
  if (total == null || !Number.isFinite(total)) {
    return 'n/a';
  }
  return total.toFixed(1);
}

export function formatKickoff(kickoff: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(kickoff)) {
    const [yearText, monthText, dayText] = kickoff.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    if (!year || !month || !day) {
      return kickoff;
    }
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }

  const date = new Date(kickoff);
  if (Number.isNaN(date.getTime())) {
    return kickoff;
  }
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Mexico_City',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  } catch {
    return kickoff;
  }
}

export function formatUtcDay(stamp: string): string {
  const date = new Date(stamp);
  if (Number.isNaN(date.getTime())) {
    return stamp;
  }
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function resultLabel(
  result: 'home' | 'away' | 'tie',
  homeName: string,
  awayName: string,
): string {
  if (result === 'tie') {
    return 'Tie';
  }
  if (result === 'home') {
    return `${homeName} won`;
  }
  return `${awayName} won`;
}

export function isFinalGame(game: Game): game is Extract<Game, { status: 'final' }> {
  return game.status === 'final';
}
