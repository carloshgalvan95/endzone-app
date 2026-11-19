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

/** True when every published team color is under 3:1 on this surface. */
export function logoContrastFails(colors: (string | null)[], surface: string): boolean {
  const usable = colors.filter((color): color is string => Boolean(color));
  if (usable.length === 0) {
    return false;
  }
  return Math.max(...usable.map((color) => contrastRatio(color, surface))) < 3;
}
