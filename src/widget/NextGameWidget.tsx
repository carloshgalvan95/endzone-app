import React from 'react';
import { FlexWidget, ImageWidget, TextWidget } from 'react-native-android-widget';

import { fieldMarkerX } from '@/slate/field';

import type { WidgetCopy } from './copy';

export type WidgetMark = {
  letters: string;
  color: string | null;
  uri: `https:${string}` | null;
  label: string;
};

export type WidgetGameView = {
  id: string;
  pHome: number;
  awayMark: WidgetMark;
  homeMark: WidgetMark;
};

type NextGameWidgetProps = {
  game: WidgetGameView | null;
  copy: WidgetCopy;
  width: number;
  height: number;
};

const CREAM = '#F4EEDF' as const;
const MUTED = '#A9A396' as const;
const BG = '#1B1F23' as const;
const JOST = 'Jost_400Regular';
const JOST_BOLD = 'Jost_700Bold';

export function NextGameWidget({ game, copy }: NextGameWidgetProps) {
  const uri = game ? `endzone://game/${game.id}` : 'endzone://';
  if (!game || !copy.kicker) {
    return (
      <FlexWidget
        clickAction="OPEN_URI"
        clickActionData={{ uri: 'endzone://' }}
        accessibilityLabel={copy.a11y}
        style={shell}
      >
        <TextWidget text="endzone" style={{ fontSize: 16, color: CREAM, fontFamily: JOST_BOLD }} />
        <TextWidget text={copy.figure} style={{ fontSize: 13, color: MUTED, fontFamily: JOST }} />
      </FlexWidget>
    );
  }
  const figureSize = copy.showField ? 28 : 24;
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri }}
      accessibilityLabel={copy.a11y}
      style={shell}
    >
      <TextWidget
        text={copy.kicker}
        maxLines={1}
        style={{ fontSize: 12, color: MUTED, fontFamily: JOST }}
      />
      {copy.match ? (
        <TextWidget
          text={copy.match}
          maxLines={1}
          style={{ fontSize: 14, color: CREAM, fontFamily: JOST }}
        />
      ) : null}
      {copy.showLogos && game ? (
        <FlexWidget
          style={{
            width: 'match_parent',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <MarkSlot mark={game.awayMark} />
          <MarkSlot mark={game.homeMark} />
        </FlexWidget>
      ) : null}
      {copy.showField && game ? <MiniField pHome={game.pHome} /> : null}
      {copy.nameLine ? (
        <TextWidget
          text={copy.nameLine}
          maxLines={1}
          style={{ fontSize: 16, color: CREAM, fontFamily: JOST_BOLD }}
        />
      ) : null}
      <TextWidget
        text={copy.figure}
        maxLines={1}
        style={{ fontSize: figureSize, color: CREAM, fontFamily: JOST_BOLD }}
      />
      {copy.updated ? (
        <TextWidget
          text={copy.updated}
          maxLines={1}
          style={{ fontSize: 12, color: MUTED, fontFamily: JOST }}
        />
      ) : null}
    </FlexWidget>
  );
}

function MarkSlot({ mark }: { mark: WidgetMark }) {
  if (mark.uri) {
    return (
      <ImageWidget
        image={mark.uri}
        imageWidth={24}
        imageHeight={24}
        style={{ width: 24, height: 24 }}
      />
    );
  }
  return (
    <FlexWidget
      accessibilityLabel={mark.label}
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#262B30',
        borderWidth: 1.5,
        borderColor: ringColor(mark.color),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextWidget
        text={mark.letters}
        style={{ fontSize: 9, color: CREAM, fontFamily: JOST_BOLD }}
      />
    </FlexWidget>
  );
}

function MiniField({ pHome }: { pHome: number }) {
  const marker = fieldMarkerX(pHome, 152);
  return (
    <FlexWidget
      style={{ width: 152, height: 48, flexDirection: 'row', backgroundColor: '#14181C' }}
    >
      <FlexWidget style={{ width: 2, height: 48, backgroundColor: '#30363C' }} />
      <FlexWidget style={{ width: 148, height: 48, flexDirection: 'row', alignItems: 'center' }}>
        <FlexWidget
          style={{
            width: 16,
            height: 16,
            marginLeft: Math.max(0, Math.round(marker - 2 - 8)),
            borderRadius: 8,
            borderWidth: 3,
            borderColor: '#5A86D6',
          }}
        />
      </FlexWidget>
      <FlexWidget style={{ width: 2, height: 48, backgroundColor: '#30363C' }} />
    </FlexWidget>
  );
}

function ringColor(color: string | null): `#${string}` {
  return color && /^#[0-9A-Fa-f]{6}$/.test(color) ? (color as `#${string}`) : '#8C877D';
}

const shell = {
  height: 'match_parent' as const,
  width: 'match_parent' as const,
  backgroundColor: BG,
  padding: 12,
  flexDirection: 'column' as const,
  justifyContent: 'space-between' as const,
};
