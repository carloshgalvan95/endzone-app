export const DATA_BASE_URL = 'https://carloshgalvan95.github.io/endzone-mlops/data';

export const REPOSITORY_URL = 'https://github.com/carloshgalvan95/endzone-mlops';

export const SITE_URL = 'https://carloshgalvan95.github.io/endzone-mlops/';

export const MODEL_CARD_URL =
  'https://github.com/carloshgalvan95/endzone-mlops/blob/main/docs/model_card.md';

export type SlateSelection = { kind: 'latest' } | { kind: 'week'; season: number; week: number };

export function weekFileName(season: number, week: number): string {
  if (!Number.isInteger(season) || !Number.isInteger(week) || season < 1 || week < 1) {
    throw new Error('Season and week must be positive integers.');
  }
  return `${season}-w${week}.json`;
}

export function slateUrl(selection: SlateSelection): string {
  if (selection.kind === 'latest') {
    return `${DATA_BASE_URL}/latest.json`;
  }
  return `${DATA_BASE_URL}/predictions/${weekFileName(selection.season, selection.week)}`;
}

export function teamsUrl(): string {
  return `${DATA_BASE_URL}/teams.json`;
}

export function trackRecordUrl(): string {
  return `${DATA_BASE_URL}/track_record.json`;
}

export function sampleUrl(): string {
  return `${DATA_BASE_URL}/sample.json`;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export function selectionFromParams(params: {
  season?: string | string[];
  week?: string | string[];
}): SlateSelection | 'invalid' {
  const season = firstParam(params.season);
  const week = firstParam(params.week);
  const seasonBlank = season == null || season === '';
  const weekBlank = week == null || week === '';
  if (seasonBlank && weekBlank) {
    return { kind: 'latest' };
  }
  if (seasonBlank || weekBlank || season == null || week == null) {
    return 'invalid';
  }
  if (!/^[1-9]\d*$/.test(season) || !/^[1-9]\d*$/.test(week)) {
    return 'invalid';
  }
  return { kind: 'week', season: Number(season), week: Number(week) };
}
