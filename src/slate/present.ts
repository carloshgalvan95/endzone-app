import type { Game, ScoreModel, Slate, Team, TeamsDocument } from '@/contract/types';

import {
  formatDiffPp,
  formatKickoff,
  formatMargin,
  formatPercent,
  formatTotal,
  homePick,
  isFinalGame,
  modelDisagrees,
  resultLabel,
} from './format';

export type GameCardModel = {
  gameId: string;
  awayAbbr: string;
  homeAbbr: string;
  awayName: string;
  homeName: string;
  awayColor: string | null;
  homeColor: string | null;
  awayLogo: string | null;
  homeLogo: string | null;
  modelPercent: string;
  marketPercent: string;
  modelWidth: number;
  marketWidth: number | null;
  diffLabel: string | null;
  disagrees: boolean;
  pick: 'home' | 'away' | 'tie';
  marginLabel: string | null;
  totalLabel: string | null;
  estimateNote: string | null;
  kickoffLabel: string;
  finalScore: {
    away: number;
    home: number;
    winner: 'home' | 'away' | 'tie';
    label: string;
  } | null;
};

function lookupTeam(teams: TeamsDocument | null, abbr: string): Team | undefined {
  return teams?.teams[abbr];
}

function barWidth(probability: number): number {
  if (!Number.isFinite(probability)) {
    return 0;
  }
  return Math.max(0, Math.min(100, probability * 100));
}

export function seasonWeekLabel(slate: Slate): string {
  if (slate.sample || slate.season == null || slate.week == null) {
    return 'Example data';
  }
  return `${slate.season} week ${slate.week}`;
}

export function exampleBannerText(slate: Slate): string | null {
  if (!slate.sample && slate.is_example !== true) {
    return null;
  }
  if (slate.label && slate.label.trim().length > 0) {
    return slate.label.trim();
  }
  return 'Example data. These are not predictions for a real week.';
}

export function presentGame(
  game: Game,
  teams: TeamsDocument | null,
  scoreModel: ScoreModel,
  thresholdPp: number,
): GameCardModel {
  const away = lookupTeam(teams, game.away);
  const home = lookupTeam(teams, game.home);
  const awayName = away?.name ?? game.away;
  const homeName = home?.name ?? game.home;
  const estimatesHidden = !scoreModel.accepted;

  return {
    gameId: game.game_id,
    awayAbbr: game.away,
    homeAbbr: game.home,
    awayName,
    homeName,
    awayColor: away?.team_color ?? null,
    homeColor: home?.team_color ?? null,
    awayLogo: away?.logo ?? null,
    homeLogo: home?.logo ?? null,
    modelPercent: formatPercent(game.model_home_wp),
    marketPercent: game.market_home_wp == null ? 'n/a' : formatPercent(game.market_home_wp),
    modelWidth: barWidth(game.model_home_wp),
    marketWidth: game.market_home_wp == null ? null : barWidth(game.market_home_wp),
    diffLabel: game.diff == null ? null : formatDiffPp(game.diff),
    disagrees: modelDisagrees(game.diff, thresholdPp),
    pick: homePick(game.model_home_wp),
    marginLabel: estimatesHidden ? null : formatMargin(game.estimated_margin),
    totalLabel: estimatesHidden ? null : formatTotal(game.estimated_total),
    estimateNote: estimatesHidden ? scoreModel.hidden_reason : null,
    kickoffLabel: formatKickoff(game.kickoff),
    finalScore: isFinalGame(game)
      ? {
          away: game.away_score,
          home: game.home_score,
          winner: game.result,
          label: resultLabel(game.result, homeName, awayName),
        }
      : null,
  };
}

export function presentSlate(slate: Slate, teams: TeamsDocument | null): GameCardModel[] {
  return slate.games.map((game) => presentGame(game, teams, slate.score_model, slate.threshold_pp));
}
