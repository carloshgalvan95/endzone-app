import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import type { Slate, TeamsDocument } from '@/contract/types';
import { exampleBannerText, presentSlate, seasonWeekLabel } from '@/slate/present';
import { formatUtcDay } from '@/slate/format';
import { useTheme } from '@/theme/ThemeProvider';

import { AppText } from './AppText';
import { GameCard } from './GameCard';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  NoticeBanner,
  UpdateRequiredState,
} from './ScreenState';

type WeeklySlateProps =
  | { status: 'loading' }
  | { status: 'update'; onRetry: () => void }
  | { status: 'error'; message: string; onRetry: () => void }
  | {
      status: 'empty';
      slate: Slate;
      notice: string | null;
      refreshing: boolean;
      onRefresh: () => void;
      onOpenWeeks: () => void;
    }
  | {
      status: 'ready';
      slate: Slate;
      teams: TeamsDocument | null;
      notice: string | null;
      refreshing: boolean;
      onRefresh: () => void;
      onOpenWeeks: () => void;
      onOpenGame?: (gameId: string) => void;
    };

function SlateIntro({ slate, onOpenWeeks }: { slate: Slate; onOpenWeeks: () => void }) {
  const theme = useTheme();
  const example = exampleBannerText(slate);
  return (
    <View style={styles.intro}>
      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <AppText variant="kicker">Weekly predictions</AppText>
          <AppText variant="title">
            Model vs{' '}
            <AppText variant="title" style={{ color: theme.color.accent }}>
              market
            </AppText>
          </AppText>
          <AppText variant="body">{seasonWeekLabel(slate)}</AppText>
          <AppText variant="mono">{slate.model_version}</AppText>
          <AppText variant="muted">Published {formatUtcDay(slate.generated_at)}</AppText>
          {slate.results_updated_at ? (
            <AppText variant="muted">
              Finals updated {formatUtcDay(slate.results_updated_at)}
            </AppText>
          ) : null}
          <AppText variant="muted">Not betting advice.</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose a week"
          onPress={onOpenWeeks}
          style={[styles.weeksButton, { borderColor: theme.color.border }]}
        >
          <AppText variant="button">Weeks</AppText>
        </Pressable>
      </View>
      {example ? <NoticeBanner testID="example-banner" text={example} /> : null}
    </View>
  );
}

function Legend() {
  const theme = useTheme();
  return (
    <View style={styles.legend}>
      <LegendSwatch color={theme.color.model} label="Model" />
      <LegendSwatch color={theme.color.market} label="Market" />
      <LegendSwatch color={theme.color.disagreement} label="Gap" />
    </View>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.swatchRow}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <AppText variant="muted">{label}</AppText>
    </View>
  );
}

export function WeeklySlate(props: WeeklySlateProps) {
  const theme = useTheme();

  if (props.status === 'loading') {
    return (
      <View style={[styles.fill, { backgroundColor: theme.color.bg }]}>
        <LoadingState />
      </View>
    );
  }
  if (props.status === 'update') {
    return (
      <View style={[styles.fill, { backgroundColor: theme.color.bg }]}>
        <UpdateRequiredState onRetry={props.onRetry} />
      </View>
    );
  }
  if (props.status === 'error') {
    return (
      <View style={[styles.fill, { backgroundColor: theme.color.bg }]}>
        <ErrorState message={props.message} onRetry={props.onRetry} />
      </View>
    );
  }

  const notice = props.notice;
  const header = (
    <View style={styles.header}>
      <SlateIntro slate={props.slate} onOpenWeeks={props.onOpenWeeks} />
      {notice ? <NoticeBanner testID="offline-banner" text={notice} /> : null}
      <Legend />
      <AppText variant="muted">
        Home win probability. Difference is model minus market, in percentage points. A gap of at
        least {props.slate.threshold_pp} pp is marked Disagrees.
      </AppText>
    </View>
  );

  if (props.status === 'empty') {
    return (
      <View style={[styles.fill, { backgroundColor: theme.color.bg }]} testID="slate-empty-screen">
        {header}
        <EmptyState onRetry={props.onRefresh} />
      </View>
    );
  }

  const cards = presentSlate(props.slate, props.teams);
  return (
    <FlatList
      testID="slate-ready"
      style={{ backgroundColor: theme.color.bg }}
      contentContainerStyle={styles.list}
      data={cards}
      keyExtractor={(item) => item.gameId}
      renderItem={({ item }) => (
        <GameCard
          card={item}
          onPress={
            props.onOpenGame
              ? () => {
                  props.onOpenGame?.(item.gameId);
                }
              : undefined
          }
        />
      )}
      ListHeaderComponent={header}
      refreshControl={
        <RefreshControl
          refreshing={props.refreshing}
          onRefresh={props.onRefresh}
          tintColor={theme.color.text}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  header: {
    gap: 16,
    marginBottom: 8,
  },
  intro: {
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleCopy: {
    flex: 1,
    gap: 4,
  },
  weeksButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});
