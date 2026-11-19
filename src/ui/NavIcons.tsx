import { StyleSheet, View } from 'react-native';

import { nav } from '@/theme/h2';
import { useH2Theme } from '@/theme/ThemeProvider';

type IconProps = { color: string; active?: boolean };

export function WeekIcon({ color }: IconProps) {
  return (
    <View style={styles.box}>
      <View style={[styles.calendar, { borderColor: color }]}>
        <View style={[styles.calendarHead, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function HistoryIcon({ color }: IconProps) {
  return (
    <View style={styles.box}>
      <View style={styles.bars}>
        <View style={[styles.bar, { height: 8, borderColor: color }]} />
        <View style={[styles.bar, { height: 14, borderColor: color }]} />
        <View style={[styles.bar, { height: 11, borderColor: color }]} />
      </View>
    </View>
  );
}

export function SettingsIcon({ color, active = false }: IconProps) {
  const { palette } = useH2Theme();
  const hole = active ? palette.accentNav : palette.bg;
  return (
    <View style={styles.box}>
      {[0, 60, 120].map((deg) => (
        <View
          key={deg}
          style={[styles.tooth, { backgroundColor: color, transform: [{ rotate: `${deg}deg` }] }]}
        />
      ))}
      <View style={[styles.gearHole, { borderColor: color, backgroundColor: hole }]} />
    </View>
  );
}

export function BackIcon({ color }: { color: string }) {
  return (
    <View style={styles.box}>
      <View style={[styles.chevron, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: nav.icon,
    height: nav.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendar: {
    width: 18,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  calendarHead: { height: 4 },
  bars: {
    width: 22,
    height: 18,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bar: { width: 5, borderWidth: 2 },
  tooth: { position: 'absolute', width: 2, height: 22 },
  gearHole: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5 },
  chevron: {
    width: 16,
    height: 16,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
});
