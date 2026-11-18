import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { TrackRecordModel } from '@/features/track-record/present';
import { useTheme } from '@/theme/ThemeProvider';

import { AppText } from './AppText';
import { NoticeBanner } from './ScreenState';

type TrackRecordViewProps = {
  model: TrackRecordModel;
};

export function TrackRecordView({ model }: TrackRecordViewProps) {
  const theme = useTheme();
  return (
    <ScrollView
      testID="track-record"
      style={{ backgroundColor: theme.color.bg }}
      contentContainerStyle={styles.content}
    >
      <AppText variant="kicker">Track record</AppText>
      <AppText variant="title">Correct picks</AppText>
      <AppText variant="body">{model.honest}</AppText>
      <AppText variant="muted">
        Correct picks use the frozen home probability. A tie is left out of log loss. This is not a
        recommendation.
      </AppText>
      {model.caveat ? <NoticeBanner testID="record-caveat" text={model.caveat} /> : null}
      {model.unavailable ? <AppText variant="body">{model.unavailable}</AppText> : null}
      {model.rows.map((row) => (
        <View
          key={row.key}
          testID={`record-${row.key}`}
          style={[
            styles.row,
            { borderColor: theme.color.border, backgroundColor: theme.color.surface },
          ]}
        >
          <AppText variant="mono">{row.label}</AppText>
          <AppText variant="body">Correct picks {row.correct}</AppText>
          <AppText variant="muted">Model log loss {row.modelLogLoss}</AppText>
          <AppText variant="muted">Market log loss {row.marketLogLoss}</AppText>
          <AppText variant="muted">{row.comparison}</AppText>
        </View>
      ))}
      {model.methodUrl ? (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="How this is counted"
          onPress={() => {
            Linking.openURL(model.methodUrl as string).catch(() => undefined);
          }}
        >
          <AppText variant="button" style={{ color: theme.color.brand }}>
            How this is counted
          </AppText>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  row: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
});
