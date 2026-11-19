import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ContractUpdateRequiredError } from '@/contract/errors';
import { useTrackRecord } from '@/data/queries';
import { useI18n } from '@/i18n/LocaleProvider';
import { darkPalette, field, font, nav } from '@/theme/h2';

import { BottomNav } from './Chrome';

export function HistoryScreen() {
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const query = useTrackRecord();
  const record = query.data;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: nav.listPaddingBottom(insets.bottom),
          gap: 16,
        }}
      >
        <Text style={styles.kicker}>{t('hist.kicker')}</Text>
        {query.error instanceof ContractUpdateRequiredError ? (
          <Text style={styles.body}>{t('week.contract')}</Text>
        ) : null}
        {!record && query.isPending ? <Text style={styles.body}>{t('tb.loading')}</Text> : null}
        {!record && query.isError ? <Text style={styles.body}>{t('hist.na')}</Text> : null}
        {record && !record.available ? <Text style={styles.body}>{t('hist.na')}</Text> : null}
        {record?.available
          ? record.seasons.map((season) => {
              const hits = season.summary.pick_hits;
              const judged = season.summary.pick_hits + season.summary.pick_misses;
              return (
                <View key={season.season} style={styles.block}>
                  <Text style={styles.title}>{t('hist.season', { y: season.season })}</Text>
                  <View style={styles.tile}>
                    <Text style={styles.tileTitle}>{t('hist.title')}</Text>
                    <Text style={styles.tileBody}>{t('hist.sub')}</Text>
                    <Text style={styles.tileBody}>{t('how.honest')}</Text>
                  </View>
                  <Text style={styles.calls}>{t('hist.calls')}</Text>
                  <Text style={styles.figure}>{t('hist.calls.n', { hits, n: judged })}</Text>
                  <Text style={styles.muted}>{t('hist.calls.note')}</Text>
                  <Text style={styles.muted}>
                    {t('hist.sample', {
                      have: season.summary.decided,
                      need: record.small_sample_decided,
                    })}
                  </Text>
                  <Text style={styles.kicker}>{t('hist.weekly')}</Text>
                  {season.weeks.map((week) => (
                    <Dumbbell
                      key={`${week.season}-${week.week}`}
                      label={
                        week.state === 'no_finals'
                          ? t('tb.dumbbell.none', { n: week.week })
                          : t('tb.dumbbell', {
                              n: week.week,
                              mo: formatLoss(week.model_log_loss, locale),
                              mk: formatLoss(week.market_log_loss, locale),
                            })
                      }
                      model={week.model_log_loss}
                      market={week.market_log_loss}
                      empty={week.state === 'no_finals'}
                      emptyLabel={t('hist.nofinals')}
                    />
                  ))}
                </View>
              );
            })
          : null}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

function formatLoss(value: number | null, locale: string): string {
  if (value == null || !Number.isFinite(value)) {
    return 'n/a';
  }
  return value.toLocaleString(locale, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

function Dumbbell({
  label,
  model,
  market,
  empty,
  emptyLabel,
}: {
  label: string;
  model: number | null;
  market: number | null;
  empty: boolean;
  emptyLabel: string;
}) {
  const span = 0.8 - 0.4;
  const place = (value: number | null) => {
    if (value == null) {
      return 0;
    }
    return Math.min(1, Math.max(0, (value - 0.4) / span));
  };
  return (
    <View accessibilityLabel={label} style={styles.dumbbell}>
      <Text style={styles.muted}>{empty ? emptyLabel : label}</Text>
      {!empty && model != null && market != null ? (
        <View style={styles.axis}>
          <View
            style={[
              styles.ring,
              { left: `${place(model) * 100}%`, borderColor: darkPalette.model },
            ]}
          />
          <Text style={[styles.cross, { left: `${place(market) * 100}%` }]}>x</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  block: { gap: 8 },
  kicker: {
    color: darkPalette.textMuted,
    fontFamily: font.monoMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: { color: darkPalette.text, fontFamily: font.sansBold, fontSize: 24 },
  tile: { backgroundColor: darkPalette.text, borderRadius: 16, padding: 16, gap: 6 },
  tileTitle: { color: darkPalette.textInverse, fontFamily: font.sansBold, fontSize: 18 },
  tileBody: { color: darkPalette.textInverse, fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  calls: { color: darkPalette.textMuted, fontFamily: font.sansMedium, fontSize: 14 },
  figure: { color: darkPalette.text, fontFamily: font.sansBold, fontSize: 40 },
  muted: { color: darkPalette.textMuted, fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  body: { color: darkPalette.text, fontFamily: font.sans, fontSize: 16 },
  dumbbell: { gap: 6, minHeight: 48 },
  axis: {
    height: 24,
    backgroundColor: darkPalette.playField,
    borderRadius: 0,
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: field.modelRing,
    height: field.modelRing,
    borderRadius: field.modelRing / 2,
    borderWidth: field.modelStroke,
  },
  cross: {
    position: 'absolute',
    color: darkPalette.market,
    fontFamily: font.monoSemi,
    fontSize: 14,
  },
});
