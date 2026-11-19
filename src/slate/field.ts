import { field } from '@/theme/h2';

/** Home probability 0 to 1. 72% lands at 246 dp on the 360 dp field. */
export function fieldX(pHome: number, width: number = field.width): number {
  const percent = Math.min(100, Math.max(0, pHome * 100));
  return field.x(percent, width);
}

export function fieldMarkerX(pHome: number, width: number = field.width): number {
  return field.clampX(fieldX(pHome, width), width);
}
