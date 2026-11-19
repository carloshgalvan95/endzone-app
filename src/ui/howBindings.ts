export type HowLive = {
  k: number;
  n: number;
  modelLl: number | null;
  marketLl: number | null;
  marketLower: boolean;
  small: boolean;
};

export function howLiveBindings(
  summary: {
    pick_hits: number;
    pick_misses: number;
    model_log_loss: number | null;
    market_log_loss: number | null;
    sample_label?: string | null;
  } | null,
): HowLive | null {
  if (!summary) {
    return null;
  }
  const modelLl = summary.model_log_loss;
  const marketLl = summary.market_log_loss;
  const comparable =
    modelLl != null && marketLl != null && Number.isFinite(modelLl) && Number.isFinite(marketLl);
  return {
    k: summary.pick_hits,
    n: summary.pick_hits + summary.pick_misses,
    modelLl,
    marketLl,
    marketLower: comparable ? marketLl < modelLl : false,
    small: summary.sample_label === 'small' || summary.sample_label === 'one_week',
  };
}

export function formatLoss(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value);
}

export function formatLivePair(model: number, market: number, locale: string): string {
  return `${formatLoss(model, locale)} vs ${formatLoss(market, locale)}`;
}

/** Break only after a slash. The repo name keeps a non-breaking hyphen. */
export function linkBreaks(url: string): string {
  return url.replaceAll('/', '/\u200b').replaceAll('-', '\u2011');
}
