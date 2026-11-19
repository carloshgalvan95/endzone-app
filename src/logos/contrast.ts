import ratios from './darkContrast.json';

const darkLogoContrast = ratios as Record<string, number>;

function channel(hex: string, index: number): number {
  const value = parseInt(hex.slice(index, index + 2), 16) / 255;
  if (Number.isNaN(value)) {
    return 0;
  }
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(foreground: string, background: string): number {
  const fg = foreground.replace('#', '');
  const bg = background.replace('#', '');
  const l1 = 0.2126 * channel(fg, 0) + 0.7152 * channel(fg, 2) + 0.0722 * channel(fg, 4);
  const l2 = 0.2126 * channel(bg, 0) + 0.7152 * channel(bg, 2) + 0.0722 * channel(bg, 4);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export const DARK_LOGO_SURFACE = '#262B30';
export const LOGO_CONTRAST_FLOOR = 3;

/** Mean WCAG contrast of pixels with alpha at least 0.5 against the surface. */
export function meanOpaqueContrast(
  rgba: ArrayLike<number>,
  surface: string = DARK_LOGO_SURFACE,
): number | null {
  const background = luminance(surface);
  let total = 0;
  let count = 0;
  for (let index = 0; index + 3 < rgba.length; index += 4) {
    const alpha = (rgba[index + 3] ?? 0) / 255;
    if (alpha < 0.5) {
      continue;
    }
    const foreground = luminanceRgb(rgba[index] ?? 0, rgba[index + 1] ?? 0, rgba[index + 2] ?? 0);
    total += contrastFromLuminance(foreground, background);
    count += 1;
  }
  if (count === 0) {
    return null;
  }
  return total / count;
}

export function prefersMonogram(ratio: number | null | undefined): boolean {
  return typeof ratio === 'number' && ratio < LOGO_CONTRAST_FLOOR;
}

export function darkLogoRatio(abbr: string): number | null {
  const ratio = darkLogoContrast[abbr.toUpperCase()];
  return typeof ratio === 'number' ? ratio : null;
}

/** Below 3:1 on #262B30 the slot is a monogram. An unmeasured team keeps its logo. */
export function darkLogoMark(abbr: string): 'monogram' | 'logo' {
  return prefersMonogram(darkLogoRatio(abbr)) ? 'monogram' : 'logo';
}

function luminance(hex: string): number {
  const bare = hex.replace('#', '');
  return luminanceRgb(
    parseInt(bare.slice(0, 2), 16),
    parseInt(bare.slice(2, 4), 16),
    parseInt(bare.slice(4, 6), 16),
  );
}

function luminanceRgb(red: number, green: number, blue: number): number {
  return 0.2126 * channelByte(red) + 0.7152 * channelByte(green) + 0.0722 * channelByte(blue);
}

function channelByte(value: number): number {
  const channelValue = value / 255;
  if (Number.isNaN(channelValue)) {
    return 0;
  }
  return channelValue <= 0.03928 ? channelValue / 12.92 : ((channelValue + 0.055) / 1.055) ** 2.4;
}

function contrastFromLuminance(first: number, second: number): number {
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}
