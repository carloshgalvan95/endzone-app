import type { Game, TeamsDocument } from '@/contract/types';
import {
  formatDiffPp,
  formatKickoffInZone,
  formatPercent,
  isFinalGame,
  resultLabel,
} from '@/slate/format';

export type GameDetailModel = {
  gameId: string;
  matchup: string;
  modelPercent: string;
  marketPercent: string | null;
  diffLabel: string | null;
  comparison: string | null;
  kickoffLocal: string;
  finalLabel: string | null;
};

export function formatKickoffLocal(kickoff: string, timeZone?: string): string {
  return formatKickoffInZone(kickoff, timeZone);
}

export function presentGameDetail(
  game: Game,
  teams: TeamsDocument | null,
  timeZone?: string,
): GameDetailModel {
  const awayName = teams?.teams[game.away]?.name ?? game.away;
  const homeName = teams?.teams[game.home]?.name ?? game.home;
  const market = game.market_home_wp;
  const hasMarket = market != null && Number.isFinite(market);
  let finalLabel: string | null = null;
  if (isFinalGame(game)) {
    finalLabel = `Final. ${resultLabel(game.result, homeName, awayName)}. Away ${game.away_score}, home ${game.home_score}.`;
  }
  return {
    gameId: game.game_id,
    matchup: `${awayName} at ${homeName}`,
    modelPercent: formatPercent(game.model_home_wp),
    marketPercent: hasMarket ? formatPercent(market) : null,
    diffLabel: hasMarket && game.diff != null ? formatDiffPp(game.diff) : null,
    comparison: hasMarket
      ? 'Market is the no-vig home price. Difference is model minus market.'
      : null,
    kickoffLocal: formatKickoffLocal(game.kickoff, timeZone),
    finalLabel,
  };
}
