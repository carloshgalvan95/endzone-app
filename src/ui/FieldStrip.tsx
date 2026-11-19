import { StyleSheet, Text, View } from 'react-native';

import { fieldMarkerX } from '@/slate/field';
import { assignStripLanes, field, font, lightPalette, weekField } from '@/theme/h2';
import { useH2Theme } from '@/theme/ThemeProvider';

type FieldStripProps = {
  pHome: number;
  height: number;
  width?: number;
  variant: 'mini' | 'detail';
  caption?: string;
  ringLabel?: string;
};

const YARDS = [10, 20, 30, 40, 60, 70, 80, 90];

/** 6 dp to the right of the ring, or 6 dp to the left if the label would pass the end zone. */
export function rowLabelPercent(marker: number, letters: number, width: number): number {
  const ring = 16;
  const gap = 6;
  const end = 6;
  const label = Math.min(140, Math.max(48, letters * 7));
  const right = marker + ring / 2 + gap;
  const x = right + label <= width - end - 4 ? right : marker - ring / 2 - gap - label;
  return (Math.max(end, x) / width) * 100;
}

function Midline({ light, color, ink }: { light: boolean; color: string; ink: string }) {
  if (!light) {
    return <View style={[styles.mid, { width: 2, marginLeft: -1, backgroundColor: color }]} />;
  }
  return (
    <View style={[styles.mid, { width: 4, marginLeft: -2, flexDirection: 'row' }]}>
      <View style={{ width: 1, backgroundColor: ink }} />
      <View style={{ width: 2, backgroundColor: color }} />
      <View style={{ width: 1, backgroundColor: ink }} />
    </View>
  );
}

export function ModelStrip({ games }: { games: { id: string; pHome: number; kickoff: string }[] }) {
  const { palette } = useH2Theme();
  const light = palette.bg === lightPalette.bg;
  const frame = weekField.strip;
  const placed = assignStripLanes(
    games.map((game) => ({
      id: game.id,
      x: weekField.clampX(weekField.x(game.pHome * 100, frame), frame),
      kickoff: Number.isFinite(Date.parse(game.kickoff)) ? Date.parse(game.kickoff) : 0,
    })),
  );
  const zone = `${(frame.endZone / frame.width) * 100}%`;
  return (
    <View
      style={[
        styles.field,
        { height: frame.height, width: '100%', backgroundColor: palette.playField },
      ]}
    >
      <View
        style={[styles.zonePct, styles.left, { width: zone, backgroundColor: palette.crimsonHero }]}
      />
      <View
        style={[
          styles.zonePct,
          styles.right,
          { width: zone, backgroundColor: palette.crimsonHero },
        ]}
      />
      {YARDS.map((yard) => (
        <View
          key={`tick-${yard}`}
          style={[
            styles.tick,
            {
              left: `${(weekField.x(yard, frame) / frame.width) * 100}%`,
              backgroundColor: palette.fieldTick,
            },
          ]}
        />
      ))}
      <Midline light={light} color={palette.accentNav} ink={palette.accentNavInk} />
      {games.map((game) => {
        const lane = placed.lanes[game.id];
        if (!lane) {
          return null;
        }
        const size = placed.diameter;
        return (
          <View
            key={game.id}
            style={[
              styles.ring,
              {
                left: `${((lane.x - size / 2) / frame.width) * 100}%`,
                top: lane.y - size / 2,
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: placed.stroke,
                borderColor: palette.model,
                backgroundColor: palette.playField,
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
  const row = variant === 'mini';
  const frame = row ? weekField.row : null;
  const play = row
    ? light
      ? weekField.playFieldInCard.light
      : weekField.playFieldInCard.dark
    : palette.playField;
  const marker = frame
    ? weekField.clampX(weekField.x(pHome * 100, frame), frame)
    : fieldMarkerX(pHome);
  const basis = frame ? frame.width : field.width;
  const ringSize = field.modelRing;
  const ringLeft = ((marker - ringSize / 2) / basis) * 100;
  const zone = frame ? `${(frame.endZone / frame.width) * 100}%` : field.endZone;
  return (
    <View style={[styles.wrap, width ? { width } : null]}>
      <View style={[styles.field, { height, width: width ?? '100%', backgroundColor: play }]}>
        <View
          style={[
            styles.zonePct,
            styles.left,
            { width: zone, backgroundColor: palette.crimsonHero },
          ]}
        />
        <View
          style={[
            styles.zonePct,
            styles.right,
            { width: zone, backgroundColor: palette.crimsonHero },
          ]}
        />
        {YARDS.map((yard) => (
          <View
            key={`tick-${yard}`}
            style={[
              styles.tick,
              {
                left: `${((frame ? weekField.x(yard, frame) : field.endZone + (yard / 100) * field.play) / basis) * 100}%`,
                backgroundColor: palette.fieldTick,
              },
            ]}
          />
        ))}
        <Midline light={light} color={palette.accentNav} ink={palette.accentNavInk} />
        <View
          style={[
            styles.ring,
            {
              left: `${ringLeft}%`,
              top: (height - ringSize) / 2,
              borderColor: palette.model,
              backgroundColor: play,
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderWidth: field.modelStroke,
            },
          ]}
        />
        {ringLabel ? (
          <Text
            maxFontSizeMultiplier={1.3}
            numberOfLines={1}
            style={[
              styles.ringLabel,
              row
                ? {
                    color: palette.modelLabel,
                    top: 4,
                    left: `${rowLabelPercent(marker, ringLabel.length, basis)}%`,
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
  field: { borderRadius: 0, overflow: 'hidden' },
  zonePct: { position: 'absolute', top: 0, bottom: 0 },
  left: { left: 0 },
  right: { right: 0 },
  tick: { position: 'absolute', top: 0, bottom: 0, width: 1 },
  mid: { position: 'absolute', top: 0, bottom: 0, left: '50%' },
  ring: { position: 'absolute' },
  ringLabel: {
    position: 'absolute',
    fontFamily: font.monoSemi,
    fontSize: 14,
    lineHeight: 16,
  },
  caption: { fontFamily: font.monoSemi, fontSize: 14, lineHeight: 16 },
});
