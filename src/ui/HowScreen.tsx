import { useState, type ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTrackRecord } from '@/data/queries';
import { useI18n } from '@/i18n/LocaleProvider';
import { font, howCalibration, rhythm } from '@/theme/h2';
import type { H2Palette } from '@/theme/ThemeProvider';
import { useH2Theme } from '@/theme/ThemeProvider';

import { TopBar } from './Chrome';
import { ModelStrip } from './FieldStrip';
import { formatLivePair, howLiveBindings, linkBreaks } from './howBindings';

const YEARS = [1999, 2016, 2024, 2026] as const;

export function HowScreen() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { palette } = useH2Theme();
  const [coverRule, setCoverRule] = useState(false);
  const [gateRule, setGateRule] = useState(false);
  const record = useTrackRecord();
  const season = record.data?.available ? record.data.seasons[0] : undefined;
  const live = howLiveBindings(season?.summary ?? null);
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
            foot={t('how.s1.foot')}
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
          <Text style={[styles.stamp, { color: palette.textMuted }]}>{t('how.s5.holdout')}</Text>
          <View style={[styles.plot, { borderColor: palette.border }]}>
            <View style={[styles.diagonal, { borderColor: palette.textMuted }]} />
            {howCalibration.pred.map((pred, index) => (
              <View
                key={`bin-${index}`}
                style={[
                  styles.point,
                  {
                    left: `${pred * 100}%`,
                    bottom: `${(howCalibration.obs[index] ?? 0) * 100}%`,
                    backgroundColor: palette.model,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.foot, { color: palette.text }]}>{t('how.s5.note')}</Text>
          <Text style={[styles.foot, { color: palette.text }]}>
            {live ? t('how.s5.calls', { k: live.k, n: live.n }) : t('how.chart.empty')}
          </Text>
        </Step>

        <Step index={5} n="06" title={t('how.s6.title')} palette={palette}>
          <Body palette={palette}>{t('how.s6.p1')}</Body>
          <Body palette={palette}>{t('how.s6.p2')}</Body>
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
  const heights = [36, 52, 64, 28];
  return (
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
                borderRadius: 2,
                marginTop: 8,
              }}
            />
            <View
              style={{
                height: Math.max(12, (heights[index] ?? 20) * 0.45),
                backgroundColor: palette.crimsonDeep,
                borderRadius: 2,
                marginTop: 4,
              }}
            />
          </View>
        ))}
      </View>
      <Text style={[styles.foot, { color: palette.textMuted }]}>
        {plays} / {results}
      </Text>
      <Text style={[styles.foot, { color: palette.textMuted }]}>{foot}</Text>
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
  return (
    <View style={[styles.chart, { height: 340, backgroundColor: palette.surface }]}>
      <Text style={[styles.stamp, styles.stampAbs, { color: palette.textMuted }]}>{stamp}</Text>
      <View style={styles.balance}>
        <Monogram letters="HK" palette={palette} />
        <View style={styles.balanceBars}>
          <View style={[styles.balanceBar, { width: '46%', backgroundColor: palette.blueDeep }]} />
          <View style={[styles.balanceBar, { width: '72%', backgroundColor: palette.blueDeep }]} />
        </View>
        <Monogram letters="ST" palette={palette} />
      </View>
      <View style={[styles.pill, { borderColor: palette.border }]}>
        <Text style={[styles.pillText, { color: palette.text }]}>{home}</Text>
      </View>
      <Text style={[styles.foot, { color: palette.textMuted }]}>{out}</Text>
      <ModelStrip games={[{ id: 'how-strength', pHome: 0.62, kickoff: '2026-01-01T00:00:00Z' }]} />
      <Text style={[styles.foot, { color: palette.modelLabel }]}>{pLab}</Text>
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
  const marks = [
    { at: 52, card: t('cover.tossup') },
    { at: 69, card: 'seven' },
    { at: 96, card: t('cover.more9') },
  ];
  return (
    <View style={[styles.chart, { backgroundColor: palette.surface }]}>
      <Text style={[styles.stamp, { color: palette.textMuted }]}>{t('how.illustrative')}</Text>
      <View style={styles.ruleTrack}>
        <View style={[styles.ruleLine, { backgroundColor: palette.border }]} />
        {[55, 95].map((tick) => (
          <View
            key={tick}
            style={[styles.productTick, { left: `${tick}%`, backgroundColor: palette.textMuted }]}
          />
        ))}
        {marks.map((mark) => (
          <View
            key={mark.at}
            style={[styles.thumb, { left: `${mark.at}%`, borderColor: palette.model }]}
          />
        ))}
      </View>
      {marks.map((mark) => (
        <View key={`card-${mark.at}`} style={styles.stateRow}>
          <View style={[styles.leader, { backgroundColor: palette.border }]} />
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
                        width: 8,
                        height: 8,
                        borderRadius: 4,
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
  balance: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 28 },
  balanceBars: { flex: 1, gap: 8 },
  balanceBar: { height: 16, borderRadius: 4 },
  mono: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 12,
  },
  pillText: { fontFamily: font.sansMedium, fontSize: 12, lineHeight: 16 },
  ruleTrack: { height: 28, marginTop: 16, justifyContent: 'center' },
  ruleLine: { height: 2 },
  productTick: { position: 'absolute', width: 2, height: 12, top: 8 },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    top: 4,
    marginLeft: -10,
    backgroundColor: 'transparent',
  },
  stateRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  leader: { width: 2, alignSelf: 'stretch' },
  stateCard: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 8 },
  example: { fontFamily: font.sans, fontSize: 12, lineHeight: 16 },
  exampleFigure: { fontFamily: font.sansBold, fontSize: 40, lineHeight: 40 },
  stateText: { fontFamily: font.sansMedium, fontSize: 16, lineHeight: 24 },
  dots: { flexDirection: 'row', gap: 4, marginTop: 4 },
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
  plot: { height: 268, marginTop: 16, borderWidth: 1, position: 'relative' },
  diagonal: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: '50%',
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginBottom: -4,
  },
  link: { fontFamily: font.sansMedium, fontSize: 14, lineHeight: 20, marginTop: 16 },
  track: { height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 4 },
  fill: { height: 8 },
});
