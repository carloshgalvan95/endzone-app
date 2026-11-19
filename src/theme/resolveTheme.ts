import { themePref } from './h2';

export type ThemePreference = (typeof themePref.options)[number];

export function resolveThemePreference(
  preference: ThemePreference,
  system: 'light' | 'dark' | null,
): 'light' | 'dark' {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }
  return system === 'light' ? 'light' : 'dark';
}

export function motionDuration(kind: 'sm' | 'md' | 'lg', reduced: boolean): number {
  if (reduced) {
    return 1;
  }
  if (kind === 'sm') {
    return 120;
  }
  if (kind === 'md') {
    return 200;
  }
  return 320;
}
