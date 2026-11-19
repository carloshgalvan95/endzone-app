import { monogramLetters, resolveLogoStep } from '@/logos/resolve';

export type WidgetMarkChoice = {
  letters: string;
  color: string | null;
  uri: `https:${string}` | null;
};

/**
 * Same chain as the in-app slot: flag off is a monogram,
 * otherwise a fresh cache, then the network, then a monogram.
 */
export function widgetMark(input: {
  enabled: boolean;
  abbr: string;
  name: string;
  color: string | null;
  logoUrl: string | null;
  cacheSavedAt: number | null;
  now: number;
  networkFailed: boolean;
}): WidgetMarkChoice {
  const https = input.logoUrl?.startsWith('https:') ? (input.logoUrl as `https:${string}`) : null;
  const step = resolveLogoStep({
    enabled: input.enabled && https != null,
    cacheSavedAt: input.cacheSavedAt,
    now: input.now,
    networkFailed: input.networkFailed,
  });
  return {
    letters: monogramLetters(input.abbr, input.name),
    color: input.color,
    uri: step === 'monogram' ? null : https,
  };
}
