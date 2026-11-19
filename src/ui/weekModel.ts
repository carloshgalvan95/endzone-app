import type { Game, TeamsDocument } from '@/contract/types';
import { coverFromHomeProb } from '@/theme/h2';

export type GamePhase = 'preview' | 'live' | 'final' | 'tie';

export function gamePhase(game: Game, now: number): GamePhase {
  if (game.status === 'final') {
    return game.result === 'tie' ? 'tie' : 'final';
  }
  const kick = Date.parse(game.kickoff);
  if (Number.isFinite(kick) && kick <= now) {
    return 'live';
  }
  return 'preview';
}

export function favoriteName(game: Game, teams: TeamsDocument | null): string {
  const cover = coverFromHomeProb(game.model_home_wp);
  const side = cover.favorsHome ? game.home : game.away;
  return teams?.teams[side]?.name ?? side;
}

export function shortName(name: string): string {
  const word = name.trim().split(/\s+/)[0] ?? name;
  return word;
}

export function formatLocalWhen(iso: string, locale: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [year, month, day] = iso.split('-').map(Number);
    if (!year || !month || !day) {
      return iso;
    }
    return new Intl.DateTimeFormat(locale, {
      timeZone: 'UTC',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
