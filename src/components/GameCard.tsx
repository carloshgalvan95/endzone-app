import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import type { GameCardModel } from '@/slate/present';
import { useTheme } from '@/theme/ThemeProvider';

import { AppText } from './AppText';

type GameCardProps = {
  card: GameCardModel;
};

function TeamMark({ abbr, logo, ink }: { abbr: string; logo: string | null; ink: string }) {
  const [failed, setFailed] = useState(false);
  const theme = useTheme();
  const showImage = logo != null && !failed;
  return (
    <View
      style={[
        styles.disc,
        { backgroundColor: theme.color.logoDisc, borderColor: theme.color.border },
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: logo }}
          style={styles.logo}
          contentFit="contain"
          accessibilityIgnoresInvertColors
          onError={() => setFailed(true)}
        />
      ) : (
        <AppText variant="kicker" style={{ color: ink }}>
          {abbr}
        </AppText>
      )}
    </View>
  );
}

function ProbabilityBar({ width, color }: { width: number; color: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.track, { backgroundColor: theme.color.surfaceRaised }]}>
      <View style={[styles.fill, { width: `${width}%`, backgroundColor: color }]} />
      <View style={[styles.tick, { backgroundColor: theme.color.borderStrong }]} />
    </View>
  );
}

function TeamLine({
  abbr,
  name,
  color,
  logo,
  score,
  scoreMuted,
  wins,
}: {
  abbr: string;
  name: string;
  color: string | null;
  logo: string | null;
  score: number | null;
  scoreMuted: boolean;
  wins: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={styles.teamLine}>
      <View style={[styles.accent, { backgroundColor: color ?? theme.color.border }]} />
      <TeamMark abbr={abbr} logo={logo} ink={theme.color.logoDiscInk} />
      <View style={styles.teamNames}>
        <AppText variant="mono" style={styles.abbr}>
          {abbr}
        </AppText>
        <AppText variant="muted">{name}</AppText>
      </View>
      {wins ? (
        <View style={[styles.wins, { backgroundColor: theme.color.disagreement }]}>
          <AppText variant="kicker" style={{ color: theme.color.disagreementInk }}>
            Wins
          </AppText>
        </View>
      ) : null}
      {score != null ? (
        <AppText
          variant="mono"
          style={[styles.score, { color: scoreMuted ? theme.color.scoreMuted : theme.color.score }]}
        >
          {score}
        </AppText>
      ) : null}
    </View>
  );
}

export function GameCard({ card }: GameCardProps) {
  const theme = useTheme();
  const final = card.finalScore;
  const awayScoreMuted = final != null && final.winner === 'home';
  const homeScoreMuted = final != null && final.winner === 'away';
  const diffColor =
    card.diffLabel != null && card.diffLabel.startsWith('+')
      ? theme.color.positive
      : card.diffLabel != null && card.diffLabel.startsWith('-')
        ? theme.color.negative
        : theme.color.text;

  return (
    <View
      testID={`game-${card.gameId}`}
      accessibilityLabel={`${card.awayName} at ${card.homeName}. Model ${card.modelPercent}. Market ${card.marketPercent}.`}
      style={[
        styles.card,
        {
          backgroundColor: theme.color.surface,
          borderColor: card.disagrees ? theme.color.disagreement : theme.color.border,
        },
      ]}
    >
      <TeamLine
        abbr={card.awayAbbr}
        name={card.awayName}
        color={card.awayColor}
        logo={card.awayLogo}
        score={final ? final.away : null}
        scoreMuted={awayScoreMuted}
        wins={card.pick === 'away'}
      />
      <TeamLine
        abbr={card.homeAbbr}
        name={card.homeName}
        color={card.homeColor}
        logo={card.homeLogo}
        score={final ? final.home : null}
        scoreMuted={homeScoreMuted}
        wins={card.pick === 'home'}
      />
      {card.pick === 'tie' ? <AppText variant="muted">Tie pick at 50.</AppText> : null}

      <View style={styles.block}>
        <AppText variant="kicker">Model</AppText>
        <AppText variant="mono">{card.modelPercent}</AppText>
        <ProbabilityBar width={card.modelWidth} color={theme.color.model} />
      </View>
      <View style={styles.block}>
        <AppText variant="kicker">Market</AppText>
        <AppText variant="mono">{card.marketPercent}</AppText>
        {card.marketWidth != null ? (
          <ProbabilityBar width={card.marketWidth} color={theme.color.market} />
        ) : null}
      </View>

      <View style={styles.diffRow}>
        <AppText variant="kicker">Diff</AppText>
        <AppText variant="mono" style={{ color: diffColor }}>
          {card.diffLabel ?? 'n/a'}
        </AppText>
        {card.disagrees ? (
          <View style={[styles.wins, { backgroundColor: theme.color.disagreement }]}>
            <AppText variant="kicker" style={{ color: theme.color.disagreementInk }}>
              Disagrees
            </AppText>
          </View>
        ) : null}
      </View>

      {card.estimateNote ? <AppText variant="muted">{card.estimateNote}</AppText> : null}
      {card.marginLabel || card.totalLabel ? (
        <View style={styles.estimateRow}>
          <AppText variant="muted">Margin {card.marginLabel}</AppText>
          <AppText variant="muted">Total {card.totalLabel}</AppText>
        </View>
      ) : null}
      {final ? (
        <AppText variant="mono" testID={`result-${card.gameId}`}>
          Final. {final.label}
        </AppText>
      ) : null}
      <AppText variant="muted">{card.kickoffLabel} CDMX</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  teamLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accent: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  disc: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 28,
    height: 28,
  },
  teamNames: {
    flex: 1,
    gap: 2,
  },
  abbr: {
    fontSize: 16,
  },
  wins: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  score: {
    fontSize: 22,
    minWidth: 36,
    textAlign: 'right',
  },
  block: {
    gap: 4,
  },
  track: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
  },
  tick: {
    position: 'absolute',
    left: '50%',
    width: 1,
    top: 0,
    bottom: 0,
  },
  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
