import { StyleSheet, Text, View } from 'react-native';

import { fieldMarkerX } from '@/slate/field';
import { field, font, lightPalette, opacity } from '@/theme/h2';
import { useH2Theme } from '@/theme/ThemeProvider';

type FieldStripProps = {
  pHome: number;
  height: number;
  width?: number;
  variant: 'mini' | 'detail';
  caption?: string;
  ringLabel?: string;
};

const YARDS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

export function ModelStrip({ values, height }: { values: number[]; height: number }) {
  const { palette } = useH2Theme();
  const light = palette.bg === lightPalette.bg;
  return (
    <View style={[styles.field, { height, width: '100%', backgroundColor: palette.playField }]}>
      <View style={[styles.cap, styles.left, { backgroundColor: palette.fieldCap }]} />
      <View style={[styles.cap, styles.right, { backgroundColor: palette.fieldCap }]} />
      {YARDS.map((yard) => (
        <View
          key={yard}
          style={[
            styles.tick,
            {
              left: `${((field.endZone + (yard / 100) * field.play) / field.width) * 100}%`,
              backgroundColor:
                yard === 50 && !light
                  ? palette.text
                  : yard === 50
                    ? palette.textMuted
                    : palette.fieldTick,
              opacity: yard === 50 && !light ? opacity.fieldMid : 1,
            },
          ]}
        />
      ))}
      {values.map((pHome, index) => {
        const marker = fieldMarkerX(pHome);
        const ringLeft = ((marker - field.modelRing / 2) / field.width) * 100;
        return (
          <View
            key={`${pHome}-${index}`}
            style={[
              styles.ring,
              {
                left: `${ringLeft}%`,
                top: (height - field.modelRing) / 2,
                borderColor: palette.model,
                width: field.modelRing,
                height: field.modelRing,
                borderRadius: field.modelRing / 2,
                borderWidth: field.modelStroke,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

export function FieldStrip({ pHome, height, width, variant, caption, ringLabel }: FieldStripProps) {
  const { palette } = useH2Theme();
  const light = palette.bg === lightPalette.bg;
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
            backgroundColor: palette.playField,
          },
        ]}
      >
        {variant === 'detail' ? (
          <>
            <View style={[styles.zone, styles.left, { backgroundColor: palette.crimsonHero }]} />
            <View style={[styles.zone, styles.right, { backgroundColor: palette.crimsonHero }]} />
          </>
        ) : (
          <>
            <View style={[styles.cap, styles.left, { backgroundColor: palette.fieldCap }]} />
            <View style={[styles.cap, styles.right, { backgroundColor: palette.fieldCap }]} />
          </>
        )}
        {YARDS.map((yard) => (
          <View
            key={yard}
            style={[
              styles.tick,
              {
                left: `${((field.endZone + (yard / 100) * field.play) / field.width) * 100}%`,
                backgroundColor:
                  yard === 50 && !light
                    ? palette.text
                    : yard === 50
                      ? palette.textMuted
                      : palette.fieldTick,
                opacity: yard === 50 && !light ? opacity.fieldMid : 1,
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
              borderColor: palette.model,
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
              variant === 'mini'
                ? {
                    color: palette.modelLabel,
                    top: 4,
                    left: ringLeft > 50 ? 8 : undefined,
                    right: ringLeft > 50 ? undefined : 8,
                  }
                : {
                    color: palette.modelLabel,
                    left: `${Math.min(78, Math.max(8, ringLeft + 6))}%`,
                    top: height / 2 - 18,
                  },
            ]}
          >
            {ringLabel}
          </Text>
        ) : null}
      </View>
      {caption ? (
        <Text
          maxFontSizeMultiplier={1.3}
          style={[styles.caption, { color: palette.modelLabel }]}
          numberOfLines={1}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  field: { borderRadius: 0, overflow: 'visible' },
  zone: { position: 'absolute', top: 0, bottom: 0, width: field.endZone },
  cap: { position: 'absolute', top: 0, bottom: 0, width: 2 },
  left: { left: 0 },
  right: { right: 0 },
  tick: { position: 'absolute', top: 0, bottom: 0, width: 1 },
  ring: { position: 'absolute', backgroundColor: 'transparent' },
  ringLabel: {
    position: 'absolute',
    fontFamily: font.monoSemi,
    fontSize: 14,
    lineHeight: 16,
  },
  caption: {
    fontFamily: font.monoSemi,
    fontSize: 14,
    lineHeight: 16,
  },
});
