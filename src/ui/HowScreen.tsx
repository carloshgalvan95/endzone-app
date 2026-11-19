import { useState, type ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';

import { useTrackRecord } from '@/data/queries';
import { useI18n } from '@/i18n/LocaleProvider';
import { font, howCalibration, lightPalette, rhythm, weekField } from '@/theme/h2';
import type { H2Palette } from '@/theme/ThemeProvider';
import { useH2Theme } from '@/theme/ThemeProvider';

import { TopBar } from './Chrome';
import { ModelStrip } from './FieldStrip';
import {
  formatCount,
  formatLivePair,
  formatLoss,
  howLiveBindings,
  linkBreaks,
  selectHowSummary,
} from './howBindings';

const YEARS = [1999, 2016, 2024, 2026] as const;

export function HowScreen() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { palette } = useH2Theme();
  const [coverRule, setCoverRule] = useState(false);
  const [gateRule, setGateRule] = useState(false);
  const record = useTrackRecord();
  const params = useLocalSearchParams<{ fixture?: string }>();
  const season = record.data?.available ? record.data.seasons[0] : undefined;
  const summary = selectHowSummary(season?.summary ?? null, params.fixture === 'track');
  const live = howLiveBindings(summary);
  const foot = t('how.s6.foot');
  const urlAt = foot.indexOf('https://');
  const footLead = urlAt >= 0 ? foot.slice(0, urlAt) : foot;
  const footUrl = urlAt >= 0 ? foot.slice(urlAt) : '';

  return (
    <View style={[styles.screen, { backgroundColor: palette.bg }]}>
      <TopBar onBack={() => router.back()} title={t('how.title')} showTitle={false} />
      <ScrollView
        style={styles.list}
        contentContainerStyle={{
          paddingHorizontal: rhythm.how.padX,
          paddingBottom: insets.bottom + rhythm.how.afterLast,
        }}
      >
        <Text style={[styles.title, { color: palette.text, marginTop: rhythm.how.afterBar }]}>
          {t('how.title')}
        </Text>
        <Text style={[styles.lead, { color: palette.text, marginTop: 16 }]}>{t('how.lead')}</Text>

        <Step index={0} n="01" title={t('how.s1.title')} palette={palette}>
          <Body palette={palette}>{t('how.s1.p1')}</Body>
          <Body palette={palette}>{t('how.s1.p2')}</Body>
          <Body palette={palette}>{t('how.s1.p3')}</Body>
          <Timeline
            palette={palette}
            partial={t('how.s1.partial')}
            stamp={t('how.illustrative')}
            plays={t('how.s1.plays')}
            results={t('how.s1.results')}
            foot={t('how.s1.foot', { n: formatCount(7000, locale) })}
          />
        </Step>

        <Step index={1} n="02" title={t('how.s2.title')} palette={palette}>
          <Body palette={palette}>{t('how.s2.p1')}</Body>
          <Body palette={palette}>{t('how.s2.p2')}</Body>
          <Body palette={palette}>{t('how.s2.p3')}</Body>
          <Strength
            palette={palette}
            home={t('how.s2.home')}
            out={t('how.s2.out')}
            stamp={t('how.illustrative')}
            pLab={t('how.s2.p_lab')}
          />
        </Step>

        <Step index={2} n="03" title={t('how.s3.title')} palette={palette}>
          <Body palette={palette}>{t('how.s3.p1')}</Body>
          <Body palette={palette}>{t('how.s3.p2')}</Body>
          <Body palette={palette}>{t('how.s3.p3')}</Body>
          <CoverRule palette={palette} example={t('how.example')} />
          <RuleFold
            title={t('how.s3.exact.title')}
            body={t('how.s3.exact')}
            open={coverRule}
            onPress={() => setCoverRule((value) => !value)}
            palette={palette}
          />
        </Step>

        <Step index={3} n="04" title={t('how.s4.title')} palette={palette}>
          <Body palette={palette}>{t('how.s4.p1')}</Body>
          <Body palette={palette}>{t('how.s4.p2')}</Body>
          <Gate palette={palette} />
          <Text style={[styles.foot, { color: palette.textMuted }]}>{t('how.s4.foot')}</Text>
          <RuleFold
            title={t('how.s3.exact.title')}
            body={t('how.s4.exact')}
            open={gateRule}
            onPress={() => setGateRule((value) => !value)}
            palette={palette}
          />
        </Step>

        <Step index={4} n="05" title={t('how.s5.title')} palette={palette}>
          <Body palette={palette}>{t('how.s5.p1')}</Body>
          <Body palette={palette}>{t('how.s5.p2')}</Body>
          <Text style={[styles.stamp, { color: palette.textMuted, marginTop: 24 }]}>
            {t('how.s5.holdout')}
          </Text>
          <CalibrationPlot
            palette={palette}
            predTitle={t('how.s5.pred')}
            obsTitle={t('how.s5.obs')}
          />
          <Text style={[styles.foot, { color: palette.text }]}>{t('how.s5.note')}</Text>
          <Text style={[styles.foot, { color: palette.text }]}>
            {live ? t('how.s5.calls', { k: live.k, n: live.n }) : t('how.chart.empty')}
          </Text>
        </Step>

        <Step index={5} n="06" title={t('how.s6.title')} palette={palette}>
          <Body palette={palette}>{t('how.s6.p1')}</Body>
          <Body palette={palette}>
            {t('how.s6.p2', {
              market: formatLoss(howCalibration.holdoutMarket, locale),
              model: formatLoss(howCalibration.holdoutModel, locale),
            })}
          </Body>
          <Body palette={palette}>{t('how.s6.p3')}</Body>
          <Honesty
            label={t('how.s6.holdout')}
            model={howCalibration.holdoutModel}
            market={howCalibration.holdoutMarket}
            locale={locale}
            palette={palette}
          />
          <Text style={[styles.foot, { color: palette.textMuted }]}>{t('how.s6.n')}</Text>
          {live?.marketLower ? (
            <Text style={[styles.foot, { color: palette.text }]}>{t('how.s6.market_lower')}</Text>
          ) : null}
          <Text style={[styles.small, { color: palette.textMuted }]}>{t('how.s6.live')}</Text>
          <Text style={[styles.small, { color: palette.textMuted }]}>
            {live?.modelLl != null && live.marketLl != null
              ? formatLivePair(live.modelLl, live.marketLl, locale)
              : t('how.chart.empty')}
          </Text>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(footUrl || '')}>
            <Text style={[styles.link, { color: palette.text }]}>
              {footLead}
              {linkBreaks(footUrl)}
            </Text>
          </Pressable>
        </Step>
      </ScrollView>
    </View>
  );
}

function Step({
  index,
  n,
  title,
  palette,
  children,
}: {
  index: number;
  n: string;
  title: string;
  palette: H2Palette;
  children: ReactNode;
}) {
  return (
    <View style={{ marginTop: index === 0 ? rhythm.how.leadToFirst : 24 }}>
      {index > 0 ? (
        <View style={{ height: 1, backgroundColor: palette.border, marginBottom: 24 }} />
      ) : null}
      <View style={styles.folioRow}>
        <Text allowFontScaling={false} style={[styles.folio, { color: palette.textMuted }]}>
          {n}
        </Text>
        <View style={styles.progress}>
          {Array.from({ length: 6 }, (_, segment) => (
            <View
              key={segment}
              style={{
                width: 16,
                height: 4,
                borderRadius: 2,
                backgroundColor: segment === index ? palette.text : palette.textMuted,
              }}
            />
          ))}
        </View>
      </View>
      <Text style={[styles.stepTitle, { color: palette.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function Body({ children, palette }: { children: string; palette: H2Palette }) {
  return <Text style={[styles.body, { color: palette.text }]}>{children}</Text>;
}

function Timeline({
  palette,
  partial,
  stamp,
  plays,
  results,
  foot,
}: {
  palette: H2Palette;
  partial: string;
  stamp: string;
  plays: string;
  results: string;
  foot: string;
}) {
  const heights = [48, 64, 80, 36];
  return (
    <View>
      <View style={[styles.chart, { height: 228, backgroundColor: palette.surface }]}>
        <Text style={[styles.stamp, styles.stampAbs, { color: palette.textMuted }]}>{stamp}</Text>
        <View style={styles.yearBlocks}>
          {YEARS.map((year, index) => (
            <View key={year} style={styles.yearBlock}>
              <Text style={[styles.year, { color: palette.text }]}>{year}</Text>
              {year === 2026 ? (
                <Text style={[styles.year, { color: palette.textMuted }]}>{partial}</Text>
              ) : (
                <Text style={styles.year}> </Text>
              )}
              <View
                style={{
                  height: heights[index],
                  backgroundColor: palette.blueDeep,
                  borderWidth: 1,
                  borderColor: palette.fieldTick,
                  borderRadius: 2,
                  marginTop: 8,
                }}
              />
              <View
                style={{
                  height: Math.max(12, (heights[index] ?? 20) * 0.4),
                  backgroundColor: palette.surfaceRaised,
                  borderWidth: 1,
                  borderColor: palette.fieldTick,
                  borderRadius: 2,
                  marginTop: 4,
                }}
              />
            </View>
          ))}
        </View>
        <View style={styles.legend}>
          <LegendSwatch
            color={palette.blueDeep}
            border={palette.fieldTick}
            label={plays}
            palette={palette}
          />
          <LegendSwatch
            color={palette.surfaceRaised}
            border={palette.fieldTick}
            label={results}
            palette={palette}
          />
        </View>
      </View>
      <Text style={[styles.timelineFoot, { color: palette.textMuted }]}>{foot}</Text>
    </View>
  );
}

function LegendSwatch({
  color,
  border,
  label,
  palette,
}: {
  color: string;
  border: string;
  label: string;
  palette: H2Palette;
}) {
  return (
    <View style={styles.legendItem}>
      <View
        style={{
          width: 12,
          height: 12,
          backgroundColor: color,
          borderWidth: 1,
          borderColor: border,
        }}
      />
      <Text style={[styles.legendText, { color: palette.textMuted }]}>{label}</Text>
    </View>
  );
}

function Strength({
  palette,
  home,
  out,
  stamp,
  pLab,
}: {
  palette: H2Palette;
  home: string;
  out: string;
  stamp: string;
  pLab: string;
}) {
  const light = palette.bg === lightPalette.bg;
  const bar = palette.model;
  return (
    <View style={[styles.chart, { height: 340, backgroundColor: palette.surface }]}>
      <Text style={[styles.stamp, styles.stampAbs, { color: palette.textMuted }]}>{stamp}</Text>
      <View style={styles.balance}>
        <View style={styles.pans}>
          <View style={styles.pan}>
            <Monogram letters="HK" palette={palette} />
            <View style={[styles.vbar, { height: 28, backgroundColor: bar }]} />
          </View>
          <View style={styles.pan}>
            <Monogram letters="ST" palette={palette} />
            <View style={[styles.vbar, { height: 56, backgroundColor: bar }]} />
          </View>
        </View>
        <View style={[styles.beam, { backgroundColor: palette.text }]} />
        <View style={[styles.fulcrum, { borderTopColor: palette.text }]} />
      </View>
      <View style={styles.arrowCol}>
        <View style={[styles.drop, { backgroundColor: palette.textMuted }]} />
        <View style={[styles.arrowHead, { borderTopColor: palette.textMuted }]} />
      </View>
      <View style={[styles.pill, { borderColor: palette.border }]}>
        <Text style={[styles.pillText, { color: palette.text }]}>{home}</Text>
      </View>
      <Text style={[styles.pLab, { color: palette.modelLabel }]}>{pLab}</Text>
      <ModelStrip
        fill={light ? weekField.playFieldInCard.light : weekField.playFieldInCard.dark}
        games={[{ id: 'how-strength', pHome: 0.62, kickoff: '2026-01-01T00:00:00Z' }]}
      />
      <Text style={[styles.outLine, { color: palette.textMuted }]}>{out}</Text>
    </View>
  );
}

function Monogram({ letters, palette }: { letters: string; palette: H2Palette }) {
  return (
    <View
      style={[
        styles.mono,
        { backgroundColor: palette.surfaceRaised, borderColor: palette.borderStrong },
      ]}
    >
      <Text style={{ color: palette.text, fontFamily: font.sansBold, fontSize: 11 }}>
        {letters}
      </Text>
    </View>
  );
}

function CoverRule({ palette, example }: { palette: H2Palette; example: string }) {
  const { t } = useI18n();
  const [rail, setRail] = useState(0);
  const marks = [
    { at: 52, card: t('cover.tossup') },
    { at: 69, card: 'seven' },
    { at: 96, card: t('cover.more9') },
  ];
  const cardW = rail > 0 ? (rail - 16) / 3 : 0;
  return (
    <View style={[styles.chart, { backgroundColor: palette.surface }]}>
      <Text style={[styles.stamp, { color: palette.textMuted }]}>{t('how.illustrative')}</Text>
      <View onLayout={(event) => setRail(event.nativeEvent.layout.width)} style={styles.ruleTrack}>
        <View style={[styles.ruleLine, { backgroundColor: palette.border }]} />
        {marks.map((mark) => (
          <View
            key={mark.at}
            style={[
              styles.thumb,
              {
                left: `${mark.at}%`,
                backgroundColor: palette.model,
                borderColor: palette.surface,
              },
            ]}
          />
        ))}
        {[0.55, 0.95].map((tick) => (
          <View
            key={tick}
            style={[
              styles.productTick,
              { left: `${tick * 100}%`, backgroundColor: palette.textMuted },
            ]}
          />
        ))}
      </View>
      <View style={styles.leaderRow}>
        {rail > 0
          ? marks.map((mark, index) => {
              const thumbX = (mark.at / 100) * rail;
              const cardCenter = index * (cardW + 8) + cardW / 2;
              const dx = cardCenter - thumbX;
              const dy = 16;
              const len = Math.hypot(dx, dy);
              const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
              return (
                <View
                  key={`lead-${mark.at}`}
                  style={{
                    position: 'absolute',
                    left: thumbX,
                    top: 0,
                    width: len,
                    height: 1,
                    backgroundColor: palette.textMuted,
                    transform: [{ rotate: `${deg}deg` }],
                    transformOrigin: 'left top',
                  }}
                />
              );
            })
          : null}
      </View>
      <View style={styles.cardRow}>
        {marks.map((mark) => (
          <View key={`card-${mark.at}`} style={styles.stateCol}>
            <View style={[styles.stateCard, { borderColor: palette.border }]}>
              <Text style={[styles.example, { color: palette.textMuted }]}>
                {example} {mark.at}%
              </Text>
              {mark.card === 'seven' ? (
                <View>
                  <Text
                    allowFontScaling={false}
                    style={[styles.exampleFigure, { color: palette.text }]}
                  >
                    7
                  </Text>
                  <Text style={{ color: palette.text, fontFamily: font.sansBold, fontSize: 16 }}>
                    {t('cover.in10.short')}
                  </Text>
                  <Text style={{ color: palette.text, fontFamily: font.sansMedium, fontSize: 16 }}>
                    {t('cover.wins', { team: 'Hawks' })}
                  </Text>
                  <View style={styles.dots}>
                    {Array.from({ length: 10 }, (_, dot) => (
                      <View
                        key={dot}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: dot < 7 ? palette.text : palette.border,
                        }}
                      />
                    ))}
                  </View>
                </View>
              ) : (
                <Text style={[styles.stateText, { color: palette.text }]}>{mark.card}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function Gate({ palette }: { palette: H2Palette }) {
  const { t } = useI18n();
  const nodes = [t('how.s4.train'), t('how.s4.test'), t('how.s4.retrain')];
  return (
    <View style={[styles.chart, { height: 424, backgroundColor: palette.surface }]}>
      {nodes.map((label) => (
        <View key={label}>
          <View style={[styles.node, { borderColor: palette.border }]}>
            <Text style={[styles.nodeText, { color: palette.text }]}>{label}</Text>
          </View>
          <View style={[styles.arrow, { backgroundColor: palette.textMuted }]} />
        </View>
      ))}
      <View style={[styles.gate, { borderColor: palette.model }]}>
        <Text style={[styles.nodeText, { color: palette.text }]}>{t('how.s4.gate')}</Text>
        <Text style={[styles.nodeText, { color: palette.textMuted }]}>{t('how.s4.metric')}</Text>
      </View>
      <View style={styles.exits}>
        <View style={[styles.exit, { borderColor: palette.border }]}>
          <Text style={[styles.nodeText, { color: palette.text }]}>{t('how.s4.accept')}</Text>
        </View>
        <View style={[styles.exit, { borderColor: palette.border }]}>
          <Text style={[styles.nodeText, { color: palette.text }]}>{t('how.s4.keep')}</Text>
        </View>
      </View>
    </View>
  );
}

function RuleFold({
  title,
  body,
  open,
  onPress,
  palette,
}: {
  title: string;
  body: string;
  open: boolean;
  onPress: () => void;
  palette: H2Palette;
}) {
  return (
    <View>
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.ruleButton}>
        <Text style={[styles.ruleTitle, { color: palette.text }]}>{title}</Text>
      </Pressable>
      {open ? <Text style={[styles.monoRule, { color: palette.textMuted }]}>{body}</Text> : null}
    </View>
  );
}

const AXIS = 44;

function CalibrationPlot({
  palette,
  predTitle,
  obsTitle,
}: {
  palette: H2Palette;
  predTitle: string;
  obsTitle: string;
}) {
  const [width, setWidth] = useState(358);
  const innerW = Math.max(1, width - AXIS * 2);
  const innerH = 268 - AXIS * 2;
  const originX = AXIS;
  const originY = 268 - AXIS;
  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[styles.plot, { borderColor: palette.border }]}
    >
      <Svg width={width} height={268} style={StyleSheet.absoluteFill}>
        <Line
          x1={originX}
          y1={originY}
          x2={originX + innerW}
          y2={originY - innerH}
          stroke={palette.textMuted}
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <Line
          x1={originX}
          y1={AXIS}
          x2={originX}
          y2={originY}
          stroke={palette.textMuted}
          strokeWidth={1}
        />
        <Line
          x1={originX}
          y1={originY}
          x2={originX + innerW}
          y2={originY}
          stroke={palette.textMuted}
          strokeWidth={1}
        />
      </Svg>
      {howCalibration.pred.map((pred, index) => (
        <View
          key={`bin-${index}`}
          style={[
            styles.point,
            {
              left: originX + pred * innerW - 4,
              top: originY - (howCalibration.obs[index] ?? 0) * innerH - 4,
              backgroundColor: palette.model,
            },
          ]}
        />
      ))}
      <Text
        style={[
          styles.axisTick,
          {
            left: originX - 8,
            top: originY + 6,
            width: 16,
            textAlign: 'center',
            color: palette.textMuted,
          },
        ]}
      >
        0
      </Text>
      <Text
        style={[
          styles.axisTick,
          {
            left: originX + innerW - 8,
            top: originY + 6,
            width: 16,
            textAlign: 'center',
            color: palette.textMuted,
          },
        ]}
      >
        1
      </Text>
      <Text
        style={[
          styles.axisTick,
          { width: originX - 6, top: originY - 7, textAlign: 'right', color: palette.textMuted },
        ]}
      >
        0
      </Text>
      <Text
        style={[
          styles.axisTick,
          { width: originX - 6, top: AXIS - 7, textAlign: 'right', color: palette.textMuted },
        ]}
      >
        1
      </Text>
      <Text
        numberOfLines={1}
        style={[
          styles.axisTitle,
          {
            left: AXIS,
            right: 8,
            top: originY + 22,
            textAlign: 'center',
            color: palette.textMuted,
          },
        ]}
      >
        {predTitle}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          styles.axisTitle,
          { left: AXIS + 12, top: 4, width: 180, color: palette.textMuted },
        ]}
      >
        {obsTitle}
      </Text>
    </View>
  );
}

function Honesty({
  label,
  model,
  market,
  locale,
  palette,
}: {
  label: string;
  model: number;
  market: number;
  locale: string;
  palette: H2Palette;
}) {
  const { t } = useI18n();
  return (
    <View style={{ marginTop: 12, gap: 8 }}>
      <Text style={[styles.foot, { color: palette.textMuted }]}>{label}</Text>
      <Bar name={t('how.s6.model')} value={model} locale={locale} palette={palette} />
      <Bar name={t('how.s6.market')} value={market} locale={locale} palette={palette} />
    </View>
  );
}

function Bar({
  name,
  value,
  locale,
  palette,
}: {
  name: string;
  value: number;
  locale: string;
  palette: H2Palette;
}) {
  return (
    <View>
      <Text style={[styles.foot, { color: palette.text }]}>
        {name}{' '}
        {new Intl.NumberFormat(locale, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        }).format(value)}
      </Text>
      <View style={[styles.track, { backgroundColor: palette.surfaceRaised }]}>
        <View
          style={[
            styles.fill,
            { width: `${Math.min(100, value * 100)}%`, backgroundColor: palette.text },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { flex: 1 },
  title: { fontFamily: font.sansBold, fontSize: 32, lineHeight: 36 },
  lead: { fontFamily: font.sans, fontSize: 18, lineHeight: 26 },
  folioRow: { flexDirection: 'row', alignItems: 'center' },
  folio: { fontFamily: font.sansBold, fontSize: 48, lineHeight: 48 },
  progress: { flexDirection: 'row', gap: 4, marginLeft: 12 },
  stepTitle: { fontFamily: font.sansBold, fontSize: 28, lineHeight: 36, marginTop: 8 },
  body: { fontFamily: font.sans, fontSize: 16, lineHeight: 24, marginTop: 12 },
  foot: { fontFamily: font.sans, fontSize: 14, lineHeight: 20, marginTop: 8 },
  small: { fontFamily: font.sans, fontSize: 14, lineHeight: 20, marginTop: 4 },
  stamp: {
    fontFamily: font.monoMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  stampAbs: { position: 'absolute', top: 12, right: 12 },
  chart: { borderRadius: 12, padding: 12, marginTop: 16, overflow: 'hidden' },
  yearBlocks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 28 },
  yearBlock: { width: 64 },
  year: { fontFamily: font.monoMedium, fontSize: 12 },
  legend: { flexDirection: 'row', gap: 16, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendText: { fontFamily: font.sans, fontSize: 12, lineHeight: 16 },
  timelineFoot: { fontFamily: font.sans, fontSize: 12, lineHeight: 16, marginTop: 8 },
  balance: { marginTop: 16, alignItems: 'center' },
  pans: {
    width: '78%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pan: { alignItems: 'center', gap: 6 },
  vbar: { width: 16, borderRadius: 2 },
  beam: { height: 3, width: '86%' },
  fulcrum: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowCol: { alignSelf: 'center', alignItems: 'center', marginTop: 4 },
  drop: { width: 2, height: 12 },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  mono: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 12,
  },
  pillText: { fontFamily: font.sansMedium, fontSize: 12, lineHeight: 16 },
  pLab: { fontFamily: font.sans, fontSize: 11, lineHeight: 14, marginTop: 8 },
  outLine: { fontFamily: font.sans, fontSize: 14, lineHeight: 20, marginTop: 4 },
  ruleTrack: { height: 36, marginTop: 12, position: 'relative' },
  ruleLine: { position: 'absolute', left: 0, right: 0, top: 13, height: 2 },
  productTick: { position: 'absolute', width: 2, height: 8, top: 26, marginLeft: -1 },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    top: 4,
    marginLeft: -10,
  },
  leaderRow: { height: 16, position: 'relative' },
  cardRow: { flexDirection: 'row', gap: 8 },
  stateCol: { flex: 1 },
  leader: { width: 1, height: 16, alignSelf: 'center' },
  stateCard: { borderWidth: 1, borderRadius: 12, padding: 8, marginTop: 0 },
  example: { fontFamily: font.sans, fontSize: 12, lineHeight: 16 },
  exampleFigure: { fontFamily: font.sansBold, fontSize: 40, lineHeight: 40 },
  stateText: { fontFamily: font.sansMedium, fontSize: 16, lineHeight: 24 },
  dots: { flexDirection: 'row', gap: 3, marginTop: 4 },
  node: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  gate: {
    height: 88,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeText: { fontFamily: font.sansMedium, fontSize: 13, lineHeight: 18, textAlign: 'center' },
  arrow: { width: 2, height: 16, alignSelf: 'center' },
  exits: { flexDirection: 'row', gap: 16, marginTop: 16 },
  exit: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleButton: { minHeight: 48, justifyContent: 'center' },
  ruleTitle: { fontFamily: font.sansMedium, fontSize: 12, lineHeight: 16 },
  monoRule: { fontFamily: font.mono, fontSize: 12, lineHeight: 18 },
  plot: { height: 268, marginTop: 12, borderWidth: 1, position: 'relative' },
  axisTick: { position: 'absolute', fontFamily: font.mono, fontSize: 11, lineHeight: 14 },
  axisTitle: { position: 'absolute', fontFamily: font.sans, fontSize: 11, lineHeight: 14 },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  link: { fontFamily: font.sansMedium, fontSize: 14, lineHeight: 20, marginTop: 16 },
  track: { height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 4 },
  fill: { height: 8 },
});
