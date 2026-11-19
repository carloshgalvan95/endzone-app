import { StyleSheet, Text, View } from 'react-native';

import { fieldMarkerX } from '@/slate/field';
import { darkPalette, field, font, opacity } from '@/theme/h2';

type FieldStripProps = {
  pHome: number;
  height: number;
  width?: number;
  variant: 'mini' | 'detail';
  caption?: string;
  ringLabel?: string;
};

const YARDS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

export function FieldStrip({ pHome, height, width, variant, caption, ringLabel }: FieldStripProps) {
  const marker = fieldMarkerX(pHome);
  const ringLeft = ((marker - field.modelRing / 2) / field.width) * 100;
  return (
    <View style={[styles.wrap, width ? { width } : null]}>
      <View
        style={[
          styles.field,
          {
            height,
            width: width ?? '100%',
            backgroundColor: darkPalette.playField,
          },
        ]}
      >
        {variant === 'detail' ? (
          <>
            <View
              style={[styles.zone, styles.left, { backgroundColor: darkPalette.crimsonHero }]}
            />
            <View
              style={[styles.zone, styles.right, { backgroundColor: darkPalette.crimsonHero }]}
            />
          </>
        ) : (
          <>
            <View style={[styles.cap, styles.left, { backgroundColor: darkPalette.fieldCap }]} />
            <View style={[styles.cap, styles.right, { backgroundColor: darkPalette.fieldCap }]} />
          </>
        )}
        {YARDS.map((yard) => (
          <View
            key={yard}
            style={[
              styles.tick,
              {
                left: `${((field.endZone + (yard / 100) * field.play) / field.width) * 100}%`,
                backgroundColor: yard === 50 ? darkPalette.text : darkPalette.fieldTick,
                opacity: yard === 50 ? opacity.fieldMid : 1,
              },
            ]}
          />
        ))}
        <View
          style={[
            styles.ring,
            {
              left: `${ringLeft}%`,
              top: (height - field.modelRing) / 2,
              borderColor: darkPalette.model,
              width: field.modelRing,
              height: field.modelRing,
              borderRadius: field.modelRing / 2,
              borderWidth: field.modelStroke,
            },
          ]}
        />
        {ringLabel ? (
          <Text
            maxFontSizeMultiplier={1.3}
            style={[
              styles.ringLabel,
              { left: `${Math.min(78, Math.max(8, ringLeft + 6))}%`, top: height / 2 - 18 },
            ]}
          >
            {ringLabel}
          </Text>
        ) : null}
      </View>
      {caption ? (
        <Text maxFontSizeMultiplier={1.3} style={styles.caption} numberOfLines={1}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  field: { borderRadius: 0, overflow: 'hidden' },
  zone: { position: 'absolute', top: 0, bottom: 0, width: field.endZone },
  cap: { position: 'absolute', top: 0, bottom: 0, width: 2 },
  left: { left: 0 },
  right: { right: 0 },
  tick: { position: 'absolute', top: 0, bottom: 0, width: 1 },
  ring: { position: 'absolute', backgroundColor: 'transparent' },
  ringLabel: {
    position: 'absolute',
    color: darkPalette.modelLabel,
    fontFamily: font.monoSemi,
    fontSize: 14,
    lineHeight: 16,
  },
  caption: {
    color: darkPalette.modelLabel,
    fontFamily: font.monoSemi,
    fontSize: 14,
    lineHeight: 16,
  },
});
