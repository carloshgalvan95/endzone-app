export const LOGO_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function logoCacheKey(abbr: string): string {
  return `endzone-logo-${abbr}`;
}

export type LogoStep = 'monogram' | 'cache' | 'network';

/**
 * Flag off is always a monogram.
 * Flag on uses a fresh cache, otherwise the network, otherwise a monogram.
 */
export function resolveLogoStep(input: {
  enabled: boolean;
  cacheSavedAt: number | null;
  now: number;
  ttlMs?: number;
  networkFailed: boolean;
}): LogoStep {
  if (!input.enabled) {
    return 'monogram';
  }
  const ttl = input.ttlMs ?? LOGO_TTL_MS;
  const fresh =
    input.cacheSavedAt != null &&
    Number.isFinite(input.cacheSavedAt) &&
    input.now - input.cacheSavedAt < ttl;
  if (fresh && !input.networkFailed) {
    return 'cache';
  }
  if (!input.networkFailed) {
    return 'network';
  }
  return 'monogram';
}

export function monogramLetters(abbr: string, name: string): string {
  const source = abbr.trim() || name.trim();
  const letters = source.replace(/[^A-Za-z0-9]/g, '').slice(0, 3);
  return letters.toUpperCase() || '?';
}
