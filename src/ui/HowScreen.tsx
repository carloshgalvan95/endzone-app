import { useState, type ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTrackRecord } from '@/data/queries';
import { useI18n } from '@/i18n/LocaleProvider';
import { font, howCalibration, lightPalette, rhythm } from '@/theme/h2';
import { useH2Theme } from '@/theme/ThemeProvider';

import { TopBar } from './Chrome';
import { formatLoss, howLiveBindings } from './howBindings';

const MODEL_CARD = 'https://github.com/carloshgalvan95/endzone-mlops/blob/main/docs/model_card.md';
const YEARS = [1999, 2016, 2024, 2026];

export function HowScreen() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { palette } = useH2Theme();
  const [openRule, setOpenRule] = useState(false);
  const record = useTrackRecord();
  const season = record.data?.available ? record.data.seasons[0] : undefined;
  const live = howLiveBindings(season?.summary ?? null);
  const light = palette.bg === lightPalette.bg;

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
        <Step n="01" title={t('how.s1.title')} palette={palette}>
          <Body palette={palette}>{t('how.s1.p1')}</Body>
          <Body palette={palette}>{t('how.s1.p2')}</Body>
          <Body palette={palette}>{t('how.s1.p3')}</Body>
          <View style={[styles.panel, { backgroundColor: palette.surface }]}>
            <Text style={[styles.stamp, { color: palette.textMuted }]}>
              {t('how.illustrative')}
            </Text>
            <View style={styles.yearRow}>
              {YEARS.map((year) => (
                <Text key={year} style={[styles.year, { color: palette.text }]}>
                  {year}
                  {year === 2026 ? ` ${t('how.s1.partial')}` : ''}
                </Text>
              ))}
            </View>
            <View style={styles.bands}>
              <View style={[styles.band, { height: 28, backgroundColor: palette.model }]} />
              <View style={[styles.band, { height: 16, backgroundColor: palette.surfaceRaised }]} />
            </View>
            <Text style={[styles.foot, { color: palette.textMuted }]}>{t('how.s1.foot')}</Text>
          </View>
        </Step>
        <Step n="02" title={t('how.s2.title')} palette={palette}>
          <Body palette={palette}>{t('how.s2.p1')}</Body>
          <Body palette={palette}>{t('how.s2.p2')}</Body>
          <Body palette={palette}>{t('how.s2.p3')}</Body>
          <Text style={[styles.stamp, { color: palette.textMuted }]}>{t('how.illustrative')}</Text>
          <Text style={[styles.foot, { color: palette.modelLabel }]}>{t('how.s2.p_lab')}</Text>
        </Step>
        <Step n="03" title={t('how.s3.title')} palette={palette}>
          <Body palette={palette}>{t('how.s3.p1')}</Body>
          <Body palette={palette}>{t('how.s3.p2')}</Body>
          <Body palette={palette}>{t('how.s3.p3')}</Body>
          {['52%', '69%', '96%'].map((mark) => (
            <Text key={mark} style={[styles.example, { color: palette.text }]}>
              {t('how.example')} {mark}
            </Text>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={() => setOpenRule((value) => !value)}
            style={styles.ruleButton}
          >
            <Text style={[styles.ruleTitle, { color: palette.text }]}>
              {t('how.s3.exact.title')}
            </Text>
          </Pressable>
          {openRule ? (
            <Text style={[styles.mono, { color: palette.textMuted }]}>{t('how.s3.exact')}</Text>
          ) : null}
        </Step>
        <Step n="04" title={t('how.s4.title')} palette={palette}>
          <Body palette={palette}>{t('how.s4.p1')}</Body>
          <Body palette={palette}>{t('how.s4.p2')}</Body>
          <Text style={[styles.foot, { color: palette.textMuted }]}>{t('how.s4.foot')}</Text>
          <Pressable accessibilityRole="button" onPress={() => setOpenRule((value) => !value)}>
            <Text style={[styles.ruleTitle, { color: palette.text }]}>
              {t('how.s3.exact.title')}
            </Text>
          </Pressable>
          {openRule ? (
            <Text style={[styles.mono, { color: palette.textMuted }]}>{t('how.s4.exact')}</Text>
          ) : null}
        </Step>
        <Step n="05" title={t('how.s5.title')} palette={palette}>
          <Body palette={palette}>{t('how.s5.p1')}</Body>
          <Body palette={palette}>{t('how.s5.p2')}</Body>
          <Text style={[styles.stamp, { color: palette.textMuted }]}>{t('how.s5.holdout')}</Text>
          <View style={[styles.plot, { borderColor: palette.border }]}>
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
          <Text style={[styles.foot, { color: palette.textMuted }]}>{t('how.s5.calls_ex')}</Text>
        </Step>
        <Step n="06" title={t('how.s6.title')} palette={palette}>
          <Body palette={palette}>{t('how.s6.p1')}</Body>
          <Body palette={palette}>{t('how.s6.p2')}</Body>
          <Body palette={palette}>{t('how.s6.p3')}</Body>
          <Honesty
            label={t('how.s6.holdout')}
            model={howCalibration.holdoutModel}
            market={howCalibration.holdoutMarket}
            locale={locale}
            palette={palette}
            light={light}
          />
          <Text style={[styles.foot, { color: palette.textMuted }]}>{t('how.s6.n')}</Text>
          <Text style={[styles.foot, { color: palette.text }]}>{t('how.s6.live')}</Text>
          {live?.modelLl != null && live.marketLl != null ? (
            <Honesty
              label={live.small ? t('how.s6.live') : t('how.s6.model')}
              model={live.modelLl}
              market={live.marketLl}
              locale={locale}
              palette={palette}
              light={false}
            />
          ) : (
            <Text style={[styles.foot, { color: palette.textMuted }]}>{t('how.chart.empty')}</Text>
          )}
          {live?.marketLower ? (
            <Text style={[styles.foot, { color: palette.text }]}>{t('how.s6.market_lower')}</Text>
          ) : null}
          <Text style={[styles.foot, { color: palette.textMuted }]}>{t('how.s6.live_ex')}</Text>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(MODEL_CARD)}>
            <Text style={[styles.link, { color: palette.text }]}>{t('how.s6.foot')}</Text>
          </Pressable>
        </Step>
      </ScrollView>
    </View>
  );
}

function Step({
  n,
  title,
  palette,
  children,
}: {
  n: string;
  title: string;
  palette: { text: string; textMuted: string };
  children: ReactNode;
}) {
  return (
    <View style={{ marginTop: rhythm.how.stepGap }}>
      <Text allowFontScaling={false} style={[styles.folio, { color: palette.textMuted }]}>
        {n}
      </Text>
      <Text style={[styles.stepTitle, { color: palette.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function Body({ children, palette }: { children: string; palette: { text: string } }) {
  return <Text style={[styles.body, { color: palette.text }]}>{children}</Text>;
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
  palette: { text: string; textMuted: string; surfaceRaised: string };
  light: boolean;
}) {
  return (
    <View style={{ marginTop: 12, gap: 8 }}>
      <Text style={[styles.foot, { color: palette.textMuted }]}>{label}</Text>
      <Bar name="how.s6.model" value={model} locale={locale} palette={palette} />
      <Bar name="how.s6.market" value={market} locale={locale} palette={palette} />
    </View>
  );
}

function Bar({
  name,
  value,
  locale,
  palette,
}: {
  name: 'how.s6.model' | 'how.s6.market';
  value: number;
  locale: string;
  palette: { text: string; surfaceRaised: string };
}) {
  const { t } = useI18n();
  return (
    <View>
      <Text style={[styles.foot, { color: palette.text }]}>
        {t(name)} {formatLoss(value, locale)}
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
  folio: { fontFamily: font.sansBold, fontSize: 48, lineHeight: 48 },
  stepTitle: { fontFamily: font.sansBold, fontSize: 28, lineHeight: 36, marginTop: 8 },
  body: { fontFamily: font.sans, fontSize: 16, lineHeight: 24, marginTop: 12 },
  foot: { fontFamily: font.sans, fontSize: 14, lineHeight: 20, marginTop: 8 },
  stamp: {
    fontFamily: font.monoMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 12,
  },
  panel: { borderRadius: 12, padding: 12, marginTop: 16 },
  yearRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  year: { fontFamily: font.monoMedium, fontSize: 12 },
  bands: { marginTop: 16, gap: 8 },
  band: { borderRadius: 4 },
  example: { fontFamily: font.sansMedium, fontSize: 16, lineHeight: 24, marginTop: 8 },
  ruleButton: { minHeight: 48, justifyContent: 'center' },
  ruleTitle: { fontFamily: font.sansMedium, fontSize: 16 },
  mono: { fontFamily: font.mono, fontSize: 13, lineHeight: 20 },
  plot: { height: 180, marginTop: 16, borderWidth: 1, position: 'relative' },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginBottom: -4,
  },
  link: { fontFamily: font.sans, fontSize: 14, lineHeight: 20, marginTop: 16 },
  track: { height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 4 },
  fill: { height: 8 },
});
