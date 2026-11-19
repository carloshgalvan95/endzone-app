import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { coverFromHomeProb, coverFigure, font, rhythm } from '@/theme/h2';
import { useH2Theme } from '@/theme/ThemeProvider';
import { useI18n } from '@/i18n/LocaleProvider';

type CoverFigureProps = {
  pHome: number;
  favorite: string;
  fontScale?: number;
};

export function CoverFigure({ pHome, favorite, fontScale }: CoverFigureProps) {
  const { t } = useI18n();
  const { palette } = useH2Theme();
  const windowScale = useWindowDimensions().fontScale || 1;
  const scale = fontScale ?? windowScale;
  const cover = coverFromHomeProb(pHome);
  const stacked = scale >= coverFigure.stackFromFontScale;
  let phrase = t('cover.in10', { n: cover.n });
  if (cover.phrase === 'Toss-up') {
    phrase = t('cover.tossup');
  } else if (cover.phrase === 'More than 9 in 10') {
    phrase = t('cover.more9');
  }
  const talk =
    cover.phrase === 'Toss-up'
      ? t('tb.cover.tossup')
      : cover.phrase === 'More than 9 in 10'
        ? t('tb.cover.more9', { team: favorite })
        : t('tb.cover', { team: favorite, n: cover.n });

  return (
    <View accessibilityLabel={talk}>
      <View style={[styles.row, stacked ? styles.stack : null]}>
        {cover.phrase === 'in 10' ? (
          <Text
            allowFontScaling={false}
            maxFontSizeMultiplier={1}
            style={[styles.figure, { color: palette.text }]}
          >
            {cover.n}
          </Text>
        ) : null}
        <Text maxFontSizeMultiplier={1.5} style={[styles.phrase, { color: palette.text }]}>
          {cover.phrase === 'in 10' ? t('cover.in10.short') : phrase}
        </Text>
      </View>
      {cover.phrase === 'in 10' ? (
        <Text
          maxFontSizeMultiplier={1.5}
          numberOfLines={1}
          style={[styles.wins, { color: palette.text, marginTop: rhythm.detail.in10ToWins }]}
        >
          {t('cover.wins', { team: favorite })}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  stack: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  figure: {
    fontFamily: font.sansBold,
    fontSize: coverFigure.size,
    lineHeight: coverFigure.size,
    letterSpacing: -6,
    marginLeft: coverFigure.marginLeft,
  },
  phrase: {
    fontFamily: font.sansMedium,
    fontSize: 18,
    lineHeight: 24,
  },
  wins: {
    fontFamily: font.sansMedium,
    fontSize: 18,
    lineHeight: 24,
  },
});
