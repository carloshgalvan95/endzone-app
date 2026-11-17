import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import { AppText } from './AppText';

type WeekPickerProps = {
  season: number | null;
  weeks: number[];
  selectedWeek: number | null;
  example: boolean;
  onSelect: (week: number) => void;
};

export function WeekPicker({ season, weeks, selectedWeek, example, onSelect }: WeekPickerProps) {
  const theme = useTheme();
  const ordered = [...weeks].sort((left, right) => right - left);

  return (
    <View style={[styles.screen, { backgroundColor: theme.color.bg }]} testID="week-picker">
      <AppText variant="kicker">Weeks</AppText>
      <AppText variant="title">{season == null ? 'No season' : String(season)}</AppText>
      {example ? (
        <AppText variant="body">This slate is an example, so there is no season to browse.</AppText>
      ) : null}
      {!example && ordered.length === 0 ? (
        <AppText variant="body">No weeks are listed on this slate.</AppText>
      ) : null}
      <View style={styles.list}>
        {ordered.map((week) => {
          const selected = week === selectedWeek;
          return (
            <Pressable
              key={week}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onSelect(week)}
              testID={`week-${week}`}
              style={[
                styles.row,
                {
                  borderColor: selected ? theme.color.accent : theme.color.border,
                  backgroundColor: theme.color.surface,
                },
              ]}
            >
              <AppText variant="mono">Week {week}</AppText>
              {selected ? <AppText variant="muted">Showing</AppText> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  list: {
    gap: 8,
  },
  row: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
