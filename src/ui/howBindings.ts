export type HowLive = {
  k: number;
  n: number;
  small: boolean;
};

export function howLiveBindings(
  summary: {
    pick_hits: number;
    pick_misses: number;
    sample_label?: string | null;
  } | null,
): HowLive | null {
  if (!summary) {
    return null;
  }
  return {
    k: summary.pick_hits,
    n: summary.pick_hits + summary.pick_misses,
    small: summary.sample_label === 'small' || summary.sample_label === 'one_week',
  };
}

export function formatLoss(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value);
}

export function formatCount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

/** Screenshot and test fixture. Release builds ignore the request. */
export const howTrackFixture = {
  pick_hits: 11,
  pick_misses: 5,
  sample_label: 'small',
} as const;

export function selectHowSummary<T>(
  live: T,
  requested: boolean,
  dev = __DEV__,
): T | typeof howTrackFixture {
  if (requested && dev) {
    return howTrackFixture;
  }
  return live;
}

/** Break only after a slash. The repo name keeps a non-breaking hyphen. */
export function linkBreaks(url: string): string {
  return url.replaceAll('/', '/\u200b').replaceAll('-', '\u2011');
}
