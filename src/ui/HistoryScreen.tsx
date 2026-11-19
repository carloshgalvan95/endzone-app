import { PixelRatio, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { TrackRecordDocument } from '@/contract/types';
import { ContractUpdateRequiredError } from '@/contract/errors';
import { useSlate, useTrackRecord } from '@/data/queries';
import { useI18n } from '@/i18n/LocaleProvider';
import { darkPalette, font, lightPalette, nav, opacity, radius } from '@/theme/h2';
import { useH2Theme } from '@/theme/ThemeProvider';

import recordFixture from '../contract/fixtures/track-record.json';
import { BottomNav } from './Chrome';
import { decidedCalls, secondaryWeeks, weeksOnChart, type WeekCalls } from './historyWeeks';

const PLOT = 96;

function recordForFixture(kind: string | undefined): TrackRecordDocument {
  const base = recordFixture as TrackRecordDocument;
  if (kind !== 'none') {
    return base;
  }
  return {
    ...base,
    available: true,
    seasons: base.seasons.map((season) => ({
      ...season,
      weeks: season.weeks.map((week) => ({
        ...week,
        state: 'no_finals' as const,
        pick_hits: 0,
        pick_misses: 0,
        decided: 0,
        finished: 0,
      })),
      summary: {
        ...season.summary,
        pick_hits: 0,
        pick_misses: 0,
        decided: 0,
        finished: 0,
        weeks_with_finals: 0,
        sample_label: 'no_finals',
      },
    })),
  };
}

export function HistoryScreen() {
  const { t, numberLocale } = useI18n();
  const { palette, reducedMotion } = useH2Theme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const params = useLocalSearchParams<{ fixture?: string }>();
  const query = useTrackRecord();
  const slate = useSlate({ kind: 'latest' });
  const fixtureOn = __DEV__ && (params.fixture === 'record' || params.fixture === 'none');
  const record = fixtureOn ? recordForFixture(params.fixture) : query.data;
  const fmt = new Intl.NumberFormat(numberLocale);
  const contentW = window.width - 32;
  const stackTiles = PixelRatio.getFontScale() >= 1.3;
  const currentWeek = fixtureOn ? null : (slate.data?.week ?? null);

  return (
    <View style={[styles.screen, { backgroundColor: palette.bg }]}>
      <ScrollView
        style={styles.list}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: nav.listPaddingBottom(insets.bottom),
        }}
      >
        {query.error instanceof ContractUpdateRequiredError && !fixtureOn ? (
          <Text style={[styles.body, { color: palette.text }]}>{t('week.contract')}</Text>
        ) : null}
        {!record && query.isPending && !fixtureOn ? (
          <View
            style={[
              styles.skeleton,
              {
                backgroundColor: palette.surface,
                opacity: reducedMotion ? 1 : opacity.skeletonMin,
              },
            ]}
          />
        ) : null}
        {!record && query.isError && !fixtureOn ? (
          <Text style={[styles.body, { color: palette.text }]}>{t('hist.na')}</Text>
        ) : null}
        {record && !record.available ? (
          <View style={{ gap: 8 }}>
            <Text style={[styles.body, { color: palette.text }]}>{t('hist.na')}</Text>
            {record.reason ? (
              <Text style={[styles.small, { color: palette.textMuted }]}>{record.reason}</Text>
            ) : null}
          </View>
        ) : null}
        {record?.available
          ? record.seasons.map((season) => {
              const hits = season.summary.pick_hits;
              const n = hits + season.summary.pick_misses;
              const chartWeeks = weeksOnChart(season.weeks, currentWeek);
              const tiles = secondaryWeeks(chartWeeks);
              const small = season.summary.decided < record.small_sample_decided;
              const heroMuted =
                palette.text === darkPalette.text ? lightPalette.textMuted : darkPalette.textMuted;
              return (
                <View key={season.season}>
                  <Text style={[styles.kicker, { color: palette.textMuted }]}>
                    {t('hist.kicker')}
                  </Text>
                  <Text style={[styles.headline, { color: palette.text, marginTop: 8 }]}>
                    {t('hist.season', { y: season.season })}
                  </Text>
                  <View
                    accessibilityLabel={t('tb.hist.hero', {
                      y: season.season,
                      k: fmt.format(hits),
                      n: fmt.format(n),
                    })}
                    style={[styles.hero, { backgroundColor: palette.text, marginTop: 24 }]}
                  >
                    {n === 0 ? (
                      <Text style={[styles.heroLine, { color: palette.textInverse }]}>
                        {t('hist.hero.none')}
                      </Text>
                    ) : (
                      <>
                        <View style={styles.heroFigures}>
                          <Text
                            allowFontScaling={false}
                            style={[styles.display, { color: palette.textInverse }]}
                          >
                            {fmt.format(hits)}
                          </Text>
                          <Text style={[styles.heroOf, { color: palette.textInverse }]}>
                            {t('hist.hero.of', { n: fmt.format(n) })}
                          </Text>
                        </View>
                        <Text
                          style={[styles.heroLine, { color: palette.textInverse, marginTop: 8 }]}
                        >
                          {t('hist.hero.line')}
                        </Text>
                        {small ? (
                          <Text style={[styles.small, { color: heroMuted, marginTop: 4 }]}>
                            {t('hist.hero.small')}
                          </Text>
                        ) : null}
                      </>
                    )}
                  </View>
                  {n > 0 && chartWeeks.length > 0 ? (
                    <WeekChart
                      weeks={chartWeeks}
                      width={contentW}
                      model={palette.model}
                      outline={palette.textMuted}
                      surface={palette.surface}
                      border={palette.border}
                      muted={palette.textMuted}
                      kicker={t('hist.weekly')}
                      hit={t('hist.legend.hit')}
                      miss={t('hist.legend.miss')}
                      labelFor={(week) => weekTalk(week, t, fmt)}
                      weekNumber={(week) => fmt.format(week.week)}
                    />
                  ) : null}
                  {n > 0 && tiles.tiles.length > 0 ? (
                    <View
                      style={[styles.tiles, stackTiles || tiles.single ? styles.tilesStack : null]}
                    >
                      {tiles.tiles.map((week, index) => {
                        const label =
                          tiles.single || index === 1 ? t('hist.latest') : t('hist.best');
                        const weekN = decidedCalls(week);
                        return (
                          <View
                            key={`${label}-${week.week}`}
                            accessibilityLabel={t('tb.hist.tile', {
                              label,
                              w: fmt.format(week.week),
                              k: fmt.format(week.pick_hits),
                              n: fmt.format(weekN),
                            })}
                            style={[
                              styles.tile,
                              {
                                backgroundColor: palette.surface,
                                borderColor: palette.border,
                                width: tiles.single || stackTiles ? contentW : (contentW - 8) / 2,
                              },
                            ]}
                          >
                            <Text style={[styles.kicker, { color: palette.textMuted }]}>
                              {label}
                            </Text>
                            <View style={styles.tileFigures}>
                              <Text
                                allowFontScaling={false}
                                style={[styles.tileFigure, { color: palette.text }]}
                              >
                                {fmt.format(week.pick_hits)}
                              </Text>
                              <Text
                                allowFontScaling={false}
                                style={[styles.tileOf, { color: palette.text }]}
                              >
                                {t('hist.hero.of', { n: fmt.format(weekN) })}
                              </Text>
                            </View>
                            <Text
                              style={[styles.small, { color: palette.textMuted, marginTop: 4 }]}
                            >
                              {t('hist.week', { w: fmt.format(week.week) })}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                  <View style={{ marginTop: 24, gap: 8 }}>
                    <Text style={[styles.small, { color: palette.textMuted }]}>
                      {t('detail.footer')}
                    </Text>
                    <Text
                      accessibilityRole="link"
                      onPress={() => router.push('/how')}
                      style={[styles.link, { color: palette.modelLabel }]}
                    >
                      {t('detail.how')}
                    </Text>
                  </View>
                </View>
              );
            })
          : null}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

function weekTalk(
  week: WeekCalls,
  t: (key: string, vars?: Record<string, string | number>) => string,
  fmt: Intl.NumberFormat,
): string {
  const n = decidedCalls(week);
  if (week.state === 'no_finals' || n === 0) {
    return t('tb.hist.week.none', { w: fmt.format(week.week) });
  }
  if (week.state === 'partial') {
    return t('tb.hist.week.partial', {
      w: fmt.format(week.week),
      k: fmt.format(week.pick_hits),
      n: fmt.format(n),
    });
  }
  return t('tb.hist.week', {
    w: fmt.format(week.week),
    k: fmt.format(week.pick_hits),
    n: fmt.format(n),
  });
}

function WeekChart({
  weeks,
  width,
  model,
  outline,
  surface,
  border,
  muted,
  kicker,
  hit,
  miss,
  labelFor,
  weekNumber,
}: {
  weeks: WeekCalls[];
  width: number;
  model: string;
  outline: string;
  surface: string;
  border: string;
  muted: string;
  kicker: string;
  hit: string;
  miss: string;
  labelFor: (week: WeekCalls) => string;
  weekNumber: (week: WeekCalls) => string;
}) {
  const inner = Math.max(1, width - 32);
  const pitch = Math.min(40, inner / Math.max(1, weeks.length));
  const barW = Math.min(24, Math.max(8, pitch - 8));
  const maxN = Math.max(8, ...weeks.map((week) => decidedCalls(week)));
  const unit = PLOT / maxN;
  const blockH = Math.max(2, unit - 2);
  const missStroke = blockH < 6 ? 1 : 1.5;
  const showNumber = (week: WeekCalls, index: number) =>
    pitch >= 20 || week.week % 2 === 1 || index === weeks.length - 1;
  return (
    <View style={[styles.chart, { backgroundColor: surface, borderColor: border, width }]}>
      <Text style={[styles.kicker, { color: muted }]}>{kicker}</Text>
      <View style={styles.plot}>
        <View style={[styles.baseline, { backgroundColor: border }]} />
        {weeks.map((week) => {
          const n = decidedCalls(week);
          const empty = week.state === 'no_finals' || n === 0;
          return (
            <View
              key={week.week}
              accessibilityLabel={labelFor(week)}
              style={[styles.column, { width: pitch }]}
            >
              {empty ? null : (
                <View style={[styles.stack, { width: barW }]}>
                  {Array.from({ length: week.pick_hits }, (_, block) => (
                    <View
                      key={`h-${block}`}
                      style={{
                        width: barW,
                        height: blockH,
                        borderRadius: 2,
                        backgroundColor: model,
                      }}
                    />
                  ))}
                  {Array.from({ length: week.pick_misses }, (_, block) => (
                    <View
                      key={`m-${block}`}
                      style={{
                        width: barW,
                        height: blockH,
                        borderRadius: 2,
                        borderWidth: missStroke,
                        borderColor: outline,
                      }}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.numbers}>
        {weeks.map((week, index) => (
          <Text key={week.week} style={[styles.axis, { color: muted, width: pitch }]}>
            {showNumber(week, index) ? weekNumber(week) : ''}
          </Text>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={[styles.swatch, { backgroundColor: model }]} />
        <Text style={[styles.small, { color: muted }]}>{hit}</Text>
        <View style={[styles.swatch, { borderWidth: 1.5, borderColor: outline, marginLeft: 16 }]} />
        <Text style={[styles.small, { color: muted }]}>{miss}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { flex: 1 },
  skeleton: { height: 168, borderRadius: radius.hero, marginTop: 24 },
  kicker: {
    fontFamily: font.monoMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headline: { fontFamily: font.sansBold, fontSize: 32, lineHeight: 36 },
  hero: { borderRadius: radius.hero, padding: 16, minHeight: 168 },
  heroFigures: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  display: {
    fontFamily: font.sansBold,
    fontSize: 96,
    lineHeight: 96,
    letterSpacing: -4,
    includeFontPadding: false,
  },
  heroOf: {
    fontFamily: font.sansBold,
    fontSize: 24,
    lineHeight: 30,
    includeFontPadding: false,
  },
  heroLine: { fontFamily: font.sans, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  body: { fontFamily: font.sans, fontSize: 16, lineHeight: 24 },
  chart: { borderWidth: 1, borderRadius: radius.tile, padding: 16, marginTop: 8 },
  plot: { height: PLOT, marginTop: 12, flexDirection: 'row', alignItems: 'flex-end' },
  column: { height: PLOT, alignItems: 'center', justifyContent: 'flex-end' },
  stack: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    flexDirection: 'column-reverse',
  },
  baseline: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 1 },
  numbers: { flexDirection: 'row', marginTop: 8 },
  axis: { fontFamily: font.monoMedium, fontSize: 11, lineHeight: 14, textAlign: 'center' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  swatch: { width: 10, height: 10, borderRadius: 2 },
  tiles: { flexDirection: 'row', gap: 8, marginTop: 8 },
  tilesStack: { flexDirection: 'column' },
  tile: { borderWidth: 1, borderRadius: radius.tile, padding: 16, minHeight: 124 },
  tileFigures: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 8 },
  tileFigure: {
    fontFamily: font.sansBold,
    fontSize: 40,
    lineHeight: 44,
    includeFontPadding: false,
  },
  tileOf: {
    fontFamily: font.sansBold,
    fontSize: 24,
    lineHeight: 30,
    includeFontPadding: false,
  },
  link: {
    fontFamily: font.sansMedium,
    fontSize: 14,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
});
