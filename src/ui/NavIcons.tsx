import { StyleSheet, View } from 'react-native';

import { darkPalette, nav } from '@/theme/h2';

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
      <View style={[styles.clock, { borderColor: color }]}>
        <View style={[styles.handV, { backgroundColor: color }]} />
        <View style={[styles.handH, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function SettingsIcon({ color, active = false }: IconProps) {
  const hole = active ? darkPalette.text : darkPalette.bg;
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
  clock: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  handV: { position: 'absolute', width: 1.5, height: 6, top: 3, left: 7.5 },
  handH: { position: 'absolute', width: 5, height: 1.5, top: 8, left: 7.5 },
  tooth: { position: 'absolute', width: 2, height: 22 },
  gearHole: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5 },
  chevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
});
