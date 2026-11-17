// Hand-written from contracts/v1. Source commit b9f8342c4e24009ce74a942d82b285626259a43e.

export type ScoreDecision = 'accepted' | 'rejected' | 'inconclusive' | 'not_run';

export type ScoreTarget = {
  decision: ScoreDecision;
  baseline_name: string;
  mae: number | null;
  rmse?: number | null;
  baseline_mae: number | null;
  market_mae: number | null;
  mae_diff?: number | null;
  mae_diff_ci_low?: number | null;
  mae_diff_ci_high?: number | null;
  coverage_80?: number | null;
  implied_win_log_loss?: number | null;
  winprob_log_loss_benchmark?: number | null;
  seasons_improved?: number | null;
  seasons_scored?: number | null;
  n?: number | null;
  model_version?: string | null;
};

export type ScoreModel = {
  feature_set: string;
  accepted: boolean;
  hidden_reason: string | null;
  margin: ScoreTarget;
  total: ScoreTarget;
};

type GameBase = {
  game_id: string;
  kickoff: string;
  home: string;
  away: string;
  model_home_wp: number;
  market_home_wp: number | null;
  diff: number | null;
  model_version: string;
  generated_at: string;
  estimated_margin: number | null;
  estimated_total: number | null;
  estimated_home_points: number | null;
  estimated_away_points: number | null;
};

export type ScheduledGame = GameBase & {
  status: 'scheduled';
};

export type FinalGame = GameBase & {
  status: 'final';
  home_score: number;
  away_score: number;
  result: 'home' | 'away' | 'tie';
};

export type Game = ScheduledGame | FinalGame;

export type Slate = {
  contract_version?: string;
  sample: boolean;
  is_example?: boolean;
  label?: string;
  season: number | null;
  week: number | null;
  weeks_available: number[];
  generated_at: string;
  model_name: string;
  model_version: string;
  model_alias?: string | null;
  feature_set: string;
  threshold_pp: number;
  results_updated_at?: string;
  score_model: ScoreModel;
  games: Game[];
};

export type Team = {
  abbr: string;
  name: string;
  team_color: string | null;
  team_color2: string | null;
  logo: string | null;
};

export type TeamsDocument = {
  contract_version?: string;
  source: string;
  source_url: string;
  teams: Record<string, Team>;
};

export type TrackRecordCounts = {
  games: number;
  finished: number;
  unfinished: number;
  ties: number;
  decided: number;
  pick_hits: number;
  pick_misses: number;
  pick_unavailable: number;
  tie_hits: number;
  market_games: number;
  market_missing: number;
  score_games: number;
  score_missing: number;
  prediction_games_from_archive: number;
  prediction_games_from_this_build: number;
};

export type TrackRecordRates = {
  model_log_loss: number | null;
  market_log_loss: number | null;
  margin_mae: number | null;
  total_mae: number | null;
};

export type TrackRecordWeek = TrackRecordCounts &
  TrackRecordRates & {
    season: number;
    week: number;
    state: 'no_finals' | 'partial' | 'complete';
  };

export type TrackRecordSummary = TrackRecordCounts &
  TrackRecordRates & {
    weeks: number;
    weeks_with_finals: number;
    sample_label: 'one_week' | 'small' | 'no_finals' | null;
  };

export type TrackRecordSeason = {
  season: number;
  weeks: TrackRecordWeek[];
  summary: TrackRecordSummary;
};

export type TrackRecordDocument = {
  contract_version?: string;
  available: boolean;
  reason: string | null;
  generated_at: string;
  method: string;
  method_url: string;
  probability_clip: number;
  small_sample_decided: number;
  seasons: TrackRecordSeason[];
};
