import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ContractUpdateRequiredError } from '@/contract/errors';
import { useTrackRecord } from '@/data/queries';
import { useI18n } from '@/i18n/LocaleProvider';
import { field, font, nav } from '@/theme/h2';
import { useH2Theme } from '@/theme/ThemeProvider';

import { BottomNav } from './Chrome';

export function HistoryScreen() {
  const { t } = useI18n();
  const { palette } = useH2Theme();
  const insets = useSafeAreaInsets();
  const query = useTrackRecord();
  const record = query.data;

  return (
    <View style={[styles.screen, { backgroundColor: palette.bg }]}>
      <ScrollView
        style={styles.list}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: nav.listPaddingBottom(insets.bottom),
          gap: 16,
        }}
      >
        <Text style={[styles.kicker, { color: palette.textMuted }]}>{t('hist.kicker')}</Text>
        {query.error instanceof ContractUpdateRequiredError ? (
          <Text style={[styles.body, { color: palette.text }]}>{t('week.contract')}</Text>
        ) : null}
        {!record && query.isPending ? (
          <Text style={[styles.body, { color: palette.text }]}>{t('tb.loading')}</Text>
        ) : null}
        {!record && query.isError ? (
          <Text style={[styles.body, { color: palette.text }]}>{t('hist.na')}</Text>
        ) : null}
        {record && !record.available ? (
          <Text style={[styles.body, { color: palette.text }]}>{t('hist.na')}</Text>
        ) : null}
        {record?.available
          ? record.seasons.map((season) => {
              const hits = season.summary.pick_hits;
              const judged = season.summary.pick_hits + season.summary.pick_misses;
              return (
                <View key={season.season} style={styles.block}>
                  <Text style={[styles.title, { color: palette.text }]}>
                    {t('hist.season', { y: season.season })}
                  </Text>
                  <View style={[styles.tile, { backgroundColor: palette.surface }]}>
                    <Text style={[styles.tileTitle, { color: palette.text }]}>
                      {t('hist.title')}
                    </Text>
                  </View>
                  <Text style={[styles.calls, { color: palette.textMuted }]}>
                    {t('hist.calls')}
                  </Text>
                  <Text style={[styles.figure, { color: palette.text }]}>
                    {t('hist.calls.n', { hits, n: judged })}
                  </Text>
                  <Text style={[styles.muted, { color: palette.textMuted }]}>
                    {t('hist.calls.note')}
                  </Text>
                  <Text style={[styles.muted, { color: palette.textMuted }]}>
                    {t('hist.sample', {
                      have: season.summary.decided,
                      need: record.small_sample_decided,
                    })}
                  </Text>
                  <Text style={[styles.kicker, { color: palette.textMuted }]}>
                    {t('hist.weekly')}
                  </Text>
                  {season.weeks.map((week) => {
                    const weekHits = week.pick_hits;
                    const weekMisses = week.pick_misses;
                    const decided = weekHits + weekMisses;
                    const empty = week.state === 'no_finals' || decided === 0;
                    return (
                      <WeekHits
                        key={`${week.season}-${week.week}`}
                        label={
                          empty
                            ? t('hist.nofinals')
                            : t('tb.weekhits', {
                                n: week.week,
                                hits: weekHits,
                                decided,
                              })
                        }
                        rate={empty ? 0 : weekHits / decided}
                        empty={empty}
                        ring={palette.model}
                        fieldColor={palette.playField}
                        text={palette.textMuted}
                      />
                    );
                  })}
                </View>
              );
            })
          : null}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

function WeekHits({
  label,
  rate,
  empty,
  ring,
  fieldColor,
  text,
}: {
  label: string;
  rate: number;
  empty: boolean;
  ring: string;
  fieldColor: string;
  text: string;
}) {
  return (
    <View accessibilityLabel={label} style={styles.row}>
      <Text style={[styles.muted, { color: text }]}>{label}</Text>
      {empty ? null : (
        <View style={[styles.axis, { backgroundColor: fieldColor }]}>
          <View
            style={[
              styles.mark,
              {
                left: `${Math.min(1, Math.max(0, rate)) * 100}%`,
                borderColor: ring,
                backgroundColor: fieldColor,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { flex: 1 },
  block: { gap: 8 },
  kicker: {
    fontFamily: font.monoMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: { fontFamily: font.sansBold, fontSize: 24 },
  tile: { borderRadius: 16, padding: 16 },
  tileTitle: { fontFamily: font.sansBold, fontSize: 18, lineHeight: 24 },
  calls: { fontFamily: font.sansMedium, fontSize: 14 },
  figure: { fontFamily: font.sansBold, fontSize: 40 },
  muted: { fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  body: { fontFamily: font.sans, fontSize: 16 },
  row: { gap: 6, minHeight: 48 },
  axis: { height: 24, justifyContent: 'center' },
  mark: {
    position: 'absolute',
    width: field.modelRing,
    height: field.modelRing,
    marginLeft: -field.modelRing / 2,
    borderRadius: field.modelRing / 2,
    borderWidth: field.modelStroke,
  },
});
