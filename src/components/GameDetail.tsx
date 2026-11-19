import { StyleSheet, View } from 'react-native';

import type { GameDetailModel } from '@/features/game-detail/present';
import { useTheme } from '@/theme/ThemeProvider';

import { AppText } from './AppText';

type GameDetailViewProps = {
  model: GameDetailModel;
};

export function GameDetailView({ model }: GameDetailViewProps) {
  const theme = useTheme();
  return (
    <View testID="game-detail" style={[styles.screen, { backgroundColor: theme.color.bg }]}>
      <AppText variant="kicker">Game</AppText>
      <AppText variant="title">{model.matchup}</AppText>
      <View
        style={[
          styles.card,
          { borderColor: theme.color.border, backgroundColor: theme.color.surface },
        ]}
      >
        <AppText variant="kicker">Model home win</AppText>
        <AppText variant="mono">{model.modelPercent}</AppText>
        <AppText variant="kicker">Market home win</AppText>
        <AppText variant="mono">{model.marketPercent ?? 'No market price in this file'}</AppText>
        {model.diffLabel ? <AppText variant="body">Difference {model.diffLabel}</AppText> : null}
        {model.comparison ? <AppText variant="muted">{model.comparison}</AppText> : null}
        <AppText variant="kicker">Kickoff, local time</AppText>
        <AppText variant="body">{model.kickoffLocal}</AppText>
        {model.finalLabel ? <AppText variant="mono">{model.finalLabel}</AppText> : null}
      </View>
      <AppText variant="muted">
        Probabilities are for the home team. This is not a recommendation.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
});
