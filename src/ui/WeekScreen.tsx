import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ContractUpdateRequiredError, ContractValidationError } from '@/contract/errors';
import type { SlateSelection } from '@/contract/urls';
import { useIsOnline } from '@/data/online';
import { useSlate, useTeams } from '@/data/queries';
import { useI18n } from '@/i18n/LocaleProvider';
import { coverFromHomeProb, darkPalette, font, nav, teamLogos } from '@/theme/h2';

import { BottomNav, ExperimentFooter } from './Chrome';
import { FieldStrip } from './FieldStrip';
import { TeamSlot } from './TeamSlot';
import { favoriteName, formatLocalWhen, gamePhase, shortName } from './weekModel';

const FIRST_RUN = 'endzone-first-run-seen';

export function WeekScreen({ selection }: { selection: SlateSelection }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const online = useIsOnline();
  const slateQuery = useSlate(selection);
  const teamsQuery = useTeams();
  const [firstRun, setFirstRun] = useState(false);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    AsyncStorage.getItem(FIRST_RUN)
      .then((value) => {
        if (value !== '1') {
          setFirstRun(true);
        }
      })
      .catch(() => undefined);
  }, []);

  if (firstRun) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 24 }]}>
        <Text maxFontSizeMultiplier={1.3} style={styles.wordmark}>
          endzone-mlops
        </Text>
        <Text maxFontSizeMultiplier={1.5} style={styles.lead}>
          {t('first.lead')}
        </Text>
        <Pressable
          accessibilityRole="button"
          style={styles.cta}
          onPress={() => {
            setFirstRun(false);
            AsyncStorage.setItem(FIRST_RUN, '1').catch(() => undefined);
          }}
        >
          <Text style={styles.ctaText}>{t('first.cta')}</Text>
        </Pressable>
      </View>
    );
  }

  if (slateQuery.error instanceof ContractUpdateRequiredError) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>{t('week.contract')}</Text>
        <Text style={styles.body}>{t('week.contract.body')}</Text>
      </View>
    );
  }

  if (!slateQuery.data) {
    const offline = !online;
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>{offline ? t('off.nocache') : t('tb.loading')}</Text>
        {slateQuery.isError ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => slateQuery.refetch()}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>{t('cta.retry')}</Text>
          </Pressable>
        ) : null}
        {slateQuery.error instanceof ContractValidationError ? (
          <Text style={styles.body}>{t('week.contract.body')}</Text>
        ) : null}
      </View>
    );
  }

  const slate = slateQuery.data;
  const weekLabel = slate.week == null ? t('week.kicker') : t('week.title', { n: slate.week });
  const saved = slate.generated_at
    ? t('week.saved', { dt: formatLocalWhen(slate.generated_at, locale) })
    : '';

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: nav.listPaddingBottom(insets.bottom),
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        <Text maxFontSizeMultiplier={1.5} style={styles.kicker}>
          {t('alpha')}
        </Text>
        <Text maxFontSizeMultiplier={1.3} style={styles.title} numberOfLines={1}>
          {weekLabel}
        </Text>
        <Text maxFontSizeMultiplier={1.5} style={styles.muted}>
          {t('week.count', { n: slate.games.length })}
          {saved ? `  ${saved}` : ''}
        </Text>
        {!online ? (
          <Text style={styles.banner}>{t('ban.offline', { dt: saved || weekLabel })}</Text>
        ) : null}
        {slateQuery.isError ? <Text style={styles.banner}>{t('ban.error')}</Text> : null}
        {slate.games.length === 0 ? <Text style={styles.body}>{t('week.empty')}</Text> : null}
        {slate.games.map((game) => {
          const phase = gamePhase(game, now);
          const cover = coverFromHomeProb(game.model_home_wp);
          const fav = favoriteName(game, teamsQuery.data ?? null);
          const away = teamsQuery.data?.teams[game.away];
          const home = teamsQuery.data?.teams[game.home];
          const awayName = away?.name ?? game.away;
          const homeName = home?.name ?? game.home;
          const figure =
            cover.phrase === 'Toss-up'
              ? t('chip.tossup')
              : cover.phrase === 'More than 9 in 10'
                ? t('cover.more9')
                : String(cover.n);
          return (
            <Pressable
              key={game.game_id}
              accessibilityRole="button"
              accessibilityLabel={t('tb.week.row', {
                away: awayName,
                home: homeName,
                n: cover.n,
                team: fav,
                state: phase,
                when: formatLocalWhen(game.kickoff, locale),
              })}
              onPress={() =>
                router.push({
                  pathname: '/game/[gameId]',
                  params:
                    selection.kind === 'week'
                      ? {
                          gameId: game.game_id,
                          season: String(selection.season),
                          week: String(selection.week),
                        }
                      : { gameId: game.game_id },
                })
              }
              style={styles.row}
            >
              <View style={styles.rowTop}>
                <TeamSlot
                  name={awayName}
                  abbr={game.away}
                  color={away?.team_color ?? null}
                  logoUrl={away?.logo ?? null}
                  size={teamLogos.sizeRow}
                />
                <View style={styles.names}>
                  <Text numberOfLines={1} style={styles.team}>
                    {shortName(awayName)}
                  </Text>
                  <Text numberOfLines={1} style={styles.team}>
                    {shortName(homeName)}
                  </Text>
                  <Text style={styles.muted}>{formatLocalWhen(game.kickoff, locale)}</Text>
                </View>
                {phase === 'final' || phase === 'tie' ? (
                  <View>
                    <Text style={styles.kicker}>
                      {phase === 'tie' ? t('chip.tie') : t('chip.final')}
                    </Text>
                    <Text style={styles.score}>
                      {game.status === 'final' ? `${game.away_score}  ${game.home_score}` : ''}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.figure}>
                    <Text maxFontSizeMultiplier={1.15} style={styles.rowFigure}>
                      {figure}
                    </Text>
                    {cover.phrase === 'in 10' ? (
                      <Text style={styles.muted}>{t('cover.in10.short')}</Text>
                    ) : null}
                  </View>
                )}
              </View>
              <FieldStrip
                pHome={game.model_home_wp}
                height={24}
                label={
                  cover.phrase === 'Toss-up'
                    ? t('chip.tossup')
                    : `${shortName(fav)} ${Math.round(cover.pFav * 100)}%`
                }
              />
              {phase === 'live' ? <Text style={styles.kicker}>{t('chip.live')}</Text> : null}
            </Pressable>
          );
        })}
        <ExperimentFooter onHow={() => router.push('/how')} />
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  wordmark: { color: darkPalette.text, fontFamily: font.sansBold, fontSize: 28 },
  lead: {
    color: darkPalette.text,
    fontFamily: font.sans,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
  },
  title: { color: darkPalette.text, fontFamily: font.sansBold, fontSize: 24, lineHeight: 30 },
  body: { color: darkPalette.text, fontFamily: font.sans, fontSize: 16, lineHeight: 24 },
  muted: { color: darkPalette.textMuted, fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  kicker: {
    color: darkPalette.textMuted,
    fontFamily: font.monoMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  banner: { color: darkPalette.text, fontFamily: font.sans, fontSize: 14 },
  row: { paddingVertical: 12, gap: 8, minHeight: 48 },
  rowTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  names: { flex: 1, gap: 2 },
  team: { color: darkPalette.text, fontFamily: font.sansMedium, fontSize: 16, lineHeight: 22 },
  figure: { alignItems: 'flex-end' },
  rowFigure: { color: darkPalette.text, fontFamily: font.sansBold, fontSize: 48, lineHeight: 48 },
  score: { color: darkPalette.text, fontFamily: font.monoSemi, fontSize: 22 },
  cta: {
    minHeight: 48,
    marginTop: 24,
    borderRadius: 8,
    backgroundColor: darkPalette.text,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  ctaText: { color: darkPalette.textInverse, fontFamily: font.sansMedium, fontSize: 16 },
});
