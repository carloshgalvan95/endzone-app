import { StyleSheet, Text, View } from 'react-native';

import { fieldMarkerX } from '@/slate/field';
import { darkPalette, field, font } from '@/theme/h2';

type FieldStripProps = {
  pHome: number;
  label: string;
  height: number;
  endZones?: boolean;
};

export function FieldStrip({ pHome, label, height, endZones = false }: FieldStripProps) {
  const marker = fieldMarkerX(pHome);
  const width = field.width;
  return (
    <View style={[styles.wrap, { height, width: '100%' }]}>
      <View style={[styles.field, { height }]}>
        {endZones ? (
          <View style={[styles.end, { backgroundColor: darkPalette.crimsonHero }]} />
        ) : null}
        <View style={[styles.play, { backgroundColor: darkPalette.playField }]}>
          <View style={[styles.mid, { backgroundColor: darkPalette.text, opacity: 0.6 }]} />
        </View>
        {endZones ? (
          <View style={[styles.end, { backgroundColor: darkPalette.crimsonHero }]} />
        ) : null}
        <View
          style={[
            styles.ring,
            {
              left: `${(marker / width) * 100}%`,
              borderColor: darkPalette.model,
              width: field.modelRing,
              height: field.modelRing,
              borderRadius: field.modelRing / 2,
              borderWidth: field.modelStroke,
            },
          ]}
        />
      </View>
      <Text maxFontSizeMultiplier={1.3} style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 4,
  },
  field: {
    flexDirection: 'row',
    borderRadius: 0,
    overflow: 'hidden',
    alignItems: 'center',
  },
  end: {
    width: '8.33%',
    alignSelf: 'stretch',
  },
  play: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  mid: {
    width: 1,
    alignSelf: 'stretch',
  },
  ring: {
    position: 'absolute',
    marginLeft: -8,
    backgroundColor: 'transparent',
  },
  label: {
    color: darkPalette.modelLabel,
    fontFamily: font.monoSemi,
    fontSize: 14,
    lineHeight: 16,
  },
});
