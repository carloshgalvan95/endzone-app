import type {
  TrackRecordDocument,
  TrackRecordRates,
  TrackRecordSummary,
  TrackRecordWeek,
} from '@/contract/types';

export type TrackRecordRow = {
  key: string;
  label: string;
  correct: string;
  modelLogLoss: string;
  marketLogLoss: string;
  comparison: string;
};

export type TrackRecordModel = {
  unavailable: string | null;
  honest: string;
  caveat: string | null;
  rows: TrackRecordRow[];
  methodUrl: string | null;
};

function formatLogLoss(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return 'n/a';
  }
  return value.toFixed(4);
}

function correctPicks(hits: number | undefined, misses: number | undefined): string {
  const safeHits = Number.isFinite(hits) ? (hits as number) : 0;
  const safeMisses = Number.isFinite(misses) ? (misses as number) : 0;
  const judged = safeHits + safeMisses;
  if (judged <= 0) {
    return 'No finals yet';
  }
  return `${safeHits} of ${judged}`;
}

export function logLossComparison(
  model: number | null | undefined,
  market: number | null | undefined,
): string {
  if (model == null || market == null || !Number.isFinite(model) || !Number.isFinite(market)) {
    return 'Log loss is not available for this row.';
  }
  if (market < model) {
    return 'The market has the lower log loss. Lower is closer to the results.';
  }
  if (model < market) {
    return 'The model has the lower log loss on this row. Lower is closer to the results.';
  }
  return 'The model and the market have the same log loss on this row.';
}

function rowFromRates(
  key: string,
  label: string,
  hits: number | undefined,
  misses: number | undefined,
  rates: Partial<TrackRecordRates> | undefined,
): TrackRecordRow {
  const model = rates?.model_log_loss ?? null;
  const market = rates?.market_log_loss ?? null;
  return {
    key,
    label,
    correct: correctPicks(hits, misses),
    modelLogLoss: formatLogLoss(model),
    marketLogLoss: formatLogLoss(market),
    comparison: logLossComparison(model, market),
  };
}

function caveatFor(
  summary: TrackRecordSummary | undefined,
  smallSampleDecided: number,
): string | null {
  if (!summary) {
    return null;
  }
  const decided = Number.isFinite(summary.decided) ? summary.decided : 0;
  const small =
    summary.sample_label === 'small' ||
    summary.sample_label === 'one_week' ||
    summary.sample_label === 'no_finals' ||
    decided < smallSampleDecided;
  if (!small) {
    return null;
  }
  if (summary.sample_label === 'no_finals' || decided === 0) {
    return 'No finished games yet. Rates start once a week has finals.';
  }
  if (summary.sample_label === 'one_week') {
    return `Small sample. One week, ${decided} decided games. Rates move until the record is larger.`;
  }
  return `Small sample. ${decided} decided games, under ${smallSampleDecided}. Rates move until the record is larger.`;
}

export function presentTrackRecord(document: TrackRecordDocument): TrackRecordModel {
  if (!document.available) {
    const unavailable =
      document.reason === 'archive_unreachable'
        ? 'The published archive could not be reached, so there is no record to show.'
        : 'The record is not available.';
    return {
      unavailable,
      honest: 'This screen does not fill in a record that was not published.',
      caveat: null,
      rows: [],
      methodUrl: document.method_url ?? null,
    };
  }

  const rows: TrackRecordRow[] = [];
  for (const season of document.seasons ?? []) {
    const summary = season.summary;
    rows.push(
      rowFromRates(
        `${season.season}-summary`,
        `${season.season} season to date`,
        summary?.pick_hits,
        summary?.pick_misses,
        summary,
      ),
    );
    for (const week of season.weeks ?? []) {
      rows.push(weekRow(week));
    }
  }

  const headlineSummary = document.seasons?.[0]?.summary;
  const honest = logLossComparison(
    headlineSummary?.model_log_loss,
    headlineSummary?.market_log_loss,
  );

  return {
    unavailable: rows.length === 0 ? 'No archived week yet.' : null,
    honest,
    caveat: caveatFor(headlineSummary, document.small_sample_decided),
    rows,
    methodUrl: document.method_url ?? null,
  };
}

function weekRow(week: TrackRecordWeek): TrackRecordRow {
  const label =
    week.state === 'no_finals'
      ? `${week.season} week ${week.week}, no finals`
      : `${week.season} week ${week.week}`;
  return rowFromRates(
    `${week.season}-w${week.week}`,
    label,
    week.pick_hits,
    week.pick_misses,
    week,
  );
}
