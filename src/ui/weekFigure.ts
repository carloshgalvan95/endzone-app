export function weekRowFigure(input: {
  phrase: 'in 10' | 'Toss-up' | 'More than 9 in 10';
  n: number;
  favorite: string;
  in10Short: string;
  tossup: string;
  more9: string;
}): { digit: string | null; phrase: string } {
  if (input.phrase === 'Toss-up') {
    return { digit: null, phrase: input.tossup };
  }
  const name = input.favorite.trim();
  if (input.phrase === 'More than 9 in 10') {
    return { digit: null, phrase: name ? `${input.more9} ${name}` : input.more9 };
  }
  return {
    digit: String(input.n),
    phrase: name ? `${input.in10Short} ${name}` : input.in10Short,
  };
}

/** Favorite percent, never the home underdog side. "70%" not "30%". */
export function favoritePercentLabel(pHome: number): string {
  const pFav = Math.max(pHome, 1 - pHome);
  return `${Math.round(pFav * 100)}%`;
}
