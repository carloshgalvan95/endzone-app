import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import mark from '../../assets/images/android-icon-foreground.png';

import { ContractUpdateRequiredError, ContractValidationError } from '@/contract/errors';
import type { Game, TeamsDocument } from '@/contract/types';
import type { SlateSelection } from '@/contract/urls';
import { useIsOnline } from '@/data/online';
import { useSlate, useTeams } from '@/data/queries';
import { useI18n } from '@/i18n/LocaleProvider';
import {
  coverFromHomeProb,
  font,
  lightPalette,
  motion,
  nav,
  opacity,
  rhythm,
  teamLogos,
  weekCard,
} from '@/theme/h2';
import { useH2Theme } from '@/theme/ThemeProvider';

import { BottomNav, ExperimentFooter } from './Chrome';
import { FieldStrip, ModelStrip } from './FieldStrip';
import { hapticSelect } from './haptics';
import { dayBucket, groupByLocalDay, type DayBucket } from './schedule';
import { TeamSlot } from './TeamSlot';
import { favoritePercentLabel, weekRowFigure } from './weekFigure';
import { favoriteName, formatLocalWhen, gamePhase, shortName } from './weekModel';

const FIRST_RUN = 'endzone-first-run-seen';
const EASE = Easing.bezier(0.2, 0, 0, 1);

export function WeekScreen({ selection }: { selection: SlateSelection }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const online = useIsOnline();
  const slateQuery = useSlate(selection);
  const teamsQuery = useTeams();
  const { palette, reducedMotion } = useH2Theme();
  const [firstRun, setFirstRun] = useState(false);
  const [now] = useState(() => Date.now());
  const [compactSnap, setCompactSnap] = useState(false);
  const [scrollY] = useState(() => new Animated.Value(0));
  const [markScale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    AsyncStorage.getItem(FIRST_RUN)
      .then((value) => {
        if (value !== '1') {
          setFirstRun(true);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const brand = firstRun || (!slateQuery.data && !online);
    if (!brand || reducedMotion || motion.reducedMotion.disableSpring) {
      markScale.setValue(1);
      return;
    }
    markScale.setValue(0.86);
    Animated.spring(markScale, {
      toValue: 1,
      damping: motion.springShape.damping,
      stiffness: motion.springShape.stiffness,
      mass: motion.springShape.mass,
      useNativeDriver: true,
    }).start();
  }, [firstRun, markScale, online, reducedMotion, slateQuery.data]);

  const screen = [styles.screen, { backgroundColor: palette.bg }];

  if (firstRun) {
    return (
      <View style={[screen, styles.first, { paddingTop: insets.top + 24 }]}>
        <Animated.View style={[styles.lockup, { transform: [{ scale: markScale }] }]}>
          <Image
            source={mark}
            style={styles.mark}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
          <Text
            maxFontSizeMultiplier={1.3}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            style={[styles.wordmark, { color: palette.text }]}
          >
            endzone-mlops
          </Text>
        </Animated.View>
        <Text maxFontSizeMultiplier={1.5} style={[styles.lead, { color: palette.text }]}>
          {t('first.lead')}
        </Text>
        <Pressable
          accessibilityRole="button"
          style={[styles.cta, { backgroundColor: palette.text }]}
          onPress={() => {
            setFirstRun(false);
            AsyncStorage.setItem(FIRST_RUN, '1').catch(() => undefined);
          }}
        >
          <Text style={[styles.ctaText, { color: palette.textInverse }]}>{t('first.cta')}</Text>
        </Pressable>
      </View>
    );
  }

  if (slateQuery.error instanceof ContractUpdateRequiredError) {
    return (
      <View style={screen}>
        <Text style={[styles.title, { color: palette.text }]}>{t('week.contract')}</Text>
        <Text style={[styles.body, { color: palette.text }]}>{t('week.contract.body')}</Text>
      </View>
    );
  }

  if (!slateQuery.data) {
    const offline = !online;
    return (
      <View style={screen}>
        <Animated.View style={{ transform: [{ scale: markScale }] }}>
          <Text style={[styles.title, { color: palette.text }]}>
            {offline ? t('off.nocache') : t('tb.loading')}
          </Text>
        </Animated.View>
        {slateQuery.isError ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => slateQuery.refetch()}
            style={[styles.cta, { backgroundColor: palette.text }]}
          >
            <Text style={[styles.ctaText, { color: palette.textInverse }]}>{t('cta.retry')}</Text>
          </Pressable>
        ) : null}
        {slateQuery.error instanceof ContractValidationError ? (
          <Text style={[styles.body, { color: palette.text }]}>{t('week.contract.body')}</Text>
        ) : null}
      </View>
    );
  }

  const slate = slateQuery.data;
  const saved = slate.generated_at
    ? t('week.saved', { dt: formatLocalWhen(slate.generated_at, locale) })
    : '';
  const weekNumber = slate.week == null ? '' : String(slate.week);
  const currentWeek = slate.week;
  const nearby =
    currentWeek == null
      ? []
      : slate.weeks_available.filter((week) => Math.abs(week - currentWeek) <= 1);
  const groups = groupByLocalDay(slate.games, now);
  const nextGame = [...slate.games]
    .filter((game) => game.status !== 'final')
    .sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff))
    .find((game) => Date.parse(game.kickoff) >= now);
  const nextAt = nextGame ? Date.parse(nextGame.kickoff) : NaN;
  const collapse = scrollY.interpolate({
    inputRange: [motion.heroCollapseScroll.compactFrom, motion.heroCollapseScroll.compactVisible],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const mastheadStyle = reducedMotion
    ? undefined
    : {
        transform: [
          {
            translateY: collapse.interpolate({ inputRange: [0, 1], outputRange: [0, -36] }),
          },
          { scale: collapse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.94] }) },
        ],
      };

  return (
    <View style={screen}>
      <Animated.View
        pointerEvents={reducedMotion ? (compactSnap ? 'auto' : 'none') : 'none'}
        style={[
          styles.compactBar,
          {
            paddingTop: insets.top,
            height: nav.height + insets.top,
            backgroundColor: palette.bg,
            borderBottomColor: palette.border,
            opacity: reducedMotion ? (compactSnap ? 1 : 0) : collapse,
          },
        ]}
      >
        <View style={styles.compactRow}>
          <Text style={[styles.kicker, { color: palette.text }]}>{t('week.kicker')}</Text>
          <Text style={[styles.compactNumber, { color: palette.text }]}>{weekNumber}</Text>
          <View style={[styles.chip, { borderColor: palette.text, alignSelf: 'center' }]}>
            <Text style={[styles.chipText, { color: palette.text }]}>{t('alpha')}</Text>
          </View>
          <Text numberOfLines={1} style={[styles.saved, { color: palette.textMuted }]}>
            {saved}
          </Text>
        </View>
      </Animated.View>
      <Animated.ScrollView
        style={styles.list}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
          listener: (event) => {
            const y = (event as { nativeEvent: { contentOffset: { y: number } } }).nativeEvent
              .contentOffset.y;
            if (reducedMotion) {
              setCompactSnap(y >= motion.heroCollapseScroll.compactFrom);
            }
          },
        })}
        contentContainerStyle={{
          paddingTop: insets.top + rhythm.week.mastheadPadTop,
          paddingBottom: nav.listPaddingBottom(insets.bottom),
          paddingHorizontal: rhythm.week.padX,
        }}
      >
        <Animated.View style={mastheadStyle}>
          <Text style={[styles.kicker, { color: palette.text }]}>{t('week.kicker')}</Text>
          <View style={styles.mastheadRow}>
            <Text allowFontScaling={false} style={[styles.display, { color: palette.text }]}>
              {weekNumber}
            </Text>
            <View style={styles.mastheadMeta}>
              <Text style={[styles.meta, { color: palette.text }]}>
                {t('week.count', { n: slate.games.length })}
              </Text>
              {saved ? (
                <Text style={[styles.meta, { color: palette.textMuted }]}>{saved}</Text>
              ) : null}
              <View style={[styles.chip, { borderColor: palette.text, marginTop: 8 }]}>
                <Text style={[styles.chipText, { color: palette.text }]}>{t('alpha')}</Text>
              </View>
            </View>
          </View>
          {nearby.length > 0 ? (
            <View style={styles.orbs}>
              {nearby.map((week) => {
                const current = week === currentWeek;
                const light = palette.bg === lightPalette.bg;
                return (
                  <Pressable
                    key={`week-${week}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: current }}
                    onPress={() => {
                      if (!slate.season || current) {
                        return;
                      }
                      hapticSelect().catch(() => undefined);
                      router.setParams({ season: String(slate.season), week: String(week) });
                    }}
                    style={({ pressed }) => [
                      styles.orb,
                      {
                        backgroundColor: current ? palette.accentNav : 'transparent',
                        borderColor: current
                          ? light
                            ? palette.accentNavInk
                            : 'transparent'
                          : palette.textMuted,
                        borderWidth: current ? (light ? 1.5 : 0) : 1.5,
                        opacity: pressed ? opacity.pressed : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.orbText,
                        { color: current ? palette.accentNavInk : palette.text },
                      ]}
                    >
                      {week}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
          <View style={{ marginTop: 12 }}>
            <ModelStrip
              games={slate.games.map((game) => ({
                id: game.game_id,
                pHome: game.model_home_wp,
                kickoff: game.kickoff,
              }))}
            />
          </View>
        </Animated.View>
        {!online ? (
          <Text style={[styles.banner, { color: palette.text }]}>
            {t('ban.offline', { dt: saved || t('week.kicker') })}
          </Text>
        ) : null}
        {slateQuery.isError ? (
          <Text style={[styles.banner, { color: palette.text }]}>{t('ban.error')}</Text>
        ) : null}
        {slate.games.length === 0 ? (
          <Text style={[styles.body, { color: palette.text }]}>{t('week.empty')}</Text>
        ) : null}
        {groups.map((group) => {
          const hot =
            (group.bucket === 'today' || group.bucket === 'tomorrow') &&
            Number.isFinite(nextAt) &&
            dayBucket(nextAt, now) === group.bucket &&
            new Date(group.at).toDateString() === new Date(nextAt).toDateString();
          const light = palette.bg === lightPalette.bg;
          const label = dayLabel(group.bucket, group.at, locale, t);
          return (
            <View key={group.games[0]?.game_id ?? `${group.bucket}-${group.at}`}>
              {hot && light ? (
                <View
                  style={[
                    styles.hotDay,
                    {
                      backgroundColor: palette.accentNav,
                      marginTop: 16,
                      marginBottom: rhythm.week.dayHeaderGapBelow,
                    },
                  ]}
                >
                  <Text style={[styles.day, { color: palette.accentNavInk }]}>{label}</Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.day,
                    {
                      color: hot ? palette.accentNav : palette.text,
                      marginTop: 16,
                      marginBottom: rhythm.week.dayHeaderGapBelow,
                    },
                  ]}
                >
                  {label}
                </Text>
              )}
              {group.games.map((game) => (
                <WeekRow
                  key={game.game_id}
                  game={game}
                  index={slate.games.indexOf(game)}
                  teams={teamsQuery.data ?? null}
                  now={now}
                  locale={locale}
                  selection={selection}
                  reducedMotion={reducedMotion}
                />
              ))}
            </View>
          );
        })}
        <View style={{ marginTop: rhythm.week.fieldToNext }}>
          <ExperimentFooter onHow={() => router.push('/how')} />
        </View>
      </Animated.ScrollView>
      <BottomNav />
    </View>
  );
}

function nameLook(strong: boolean, palette: { text: string; textMuted: string }) {
  return {
    color: strong ? palette.text : palette.textMuted,
    fontFamily: strong ? font.sansBold : font.sans,
  };
}

function dayLabel(
  bucket: DayBucket,
  at: number,
  locale: string,
  t: (key: string, vars?: Record<string, string | number>) => string,
): string {
  if (bucket === 'today') {
    return t('week.day.today');
  }
  if (bucket === 'tomorrow') {
    return t('week.day.tomorrow');
  }
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date(at));
  return t('week.day', { weekday });
}

function WeekRow({
  game,
  index,
  teams,
  now,
  locale,
  selection,
  reducedMotion,
}: {
  game: Game;
  index: number;
  teams: TeamsDocument | null;
  now: number;
  locale: string;
  selection: SlateSelection;
  reducedMotion: boolean;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const { palette } = useH2Theme();
  const phase = gamePhase(game, now);
  const cover = coverFromHomeProb(game.model_home_wp);
  const fav = favoriteName(game, teams);
  const away = teams?.teams[game.away];
  const home = teams?.teams[game.home];
  const awayName = away?.name ?? game.away;
  const homeName = home?.name ?? game.home;
  const awayShort = shortName(awayName);
  const homeShort = shortName(homeName);
  const favShort = shortName(fav);
  const rowFigure = weekRowFigure({
    phrase: cover.phrase,
    n: cover.n,
    favorite: favShort,
    in10Short: t('cover.in10.short'),
    tossup: t('cover.tossup'),
    more9: t('cover.more9'),
  });
  const named = cover.phrase !== 'Toss-up';
  const [rise] = useState(() => new Animated.Value(reducedMotion || index >= 6 ? 0 : 8));
  const [fade] = useState(() => new Animated.Value(reducedMotion || index >= 6 ? 1 : 0));

  useEffect(() => {
    if (reducedMotion || index >= 6) {
      return;
    }
    Animated.timing(fade, {
      toValue: 1,
      duration: motion.duration.md,
      delay: index * motion.stagger,
      easing: EASE,
      useNativeDriver: true,
    }).start();
    Animated.timing(rise, {
      toValue: 0,
      duration: motion.duration.md,
      delay: index * motion.stagger,
      easing: EASE,
      useNativeDriver: true,
    }).start();
  }, [fade, index, reducedMotion, rise]);

  const kicker =
    phase === 'live'
      ? t('chip.live')
      : phase === 'final'
        ? t('chip.final')
        : phase === 'tie'
          ? t('chip.tie')
          : formatLocalWhen(game.kickoff, locale);
  const awayWins = game.status === 'final' && game.result === 'away';
  const homeWins = game.status === 'final' && game.result === 'home';

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }] }}>
      <Pressable
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
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            marginBottom: weekCard.gap,
            opacity: pressed ? opacity.pressed : 1,
          },
        ]}
      >
        <Text style={[styles.kicker, { color: palette.textMuted, marginBottom: 8 }]}>{kicker}</Text>
        <View style={styles.rowTop}>
          <View style={styles.names}>
            <View style={styles.nameLine}>
              <TeamSlot
                name={awayName}
                abbr={game.away}
                color={away?.team_color ?? null}
                logoUrl={away?.logo ?? null}
                size={teamLogos.sizeRow}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.team,
                  nameLook(
                    phase === 'final' || phase === 'tie'
                      ? awayWins
                      : named && awayShort === favShort,
                    palette,
                  ),
                ]}
              >
                {awayShort}
              </Text>
            </View>
            <View style={styles.nameLine}>
              <TeamSlot
                name={homeName}
                abbr={game.home}
                color={home?.team_color ?? null}
                logoUrl={home?.logo ?? null}
                size={teamLogos.sizeRow}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.team,
                  nameLook(
                    phase === 'final' || phase === 'tie'
                      ? homeWins
                      : named && homeShort === favShort,
                    palette,
                  ),
                ]}
              >
                {homeShort}
              </Text>
            </View>
          </View>
          {phase === 'final' || phase === 'tie' ? (
            <View style={styles.figure}>
              <Text
                style={[
                  styles.score,
                  { color: awayWins ? palette.text : palette.textMuted },
                  awayWins ? styles.teamFav : null,
                ]}
              >
                {game.status === 'final' ? game.away_score : ''}
              </Text>
              <Text
                style={[
                  styles.score,
                  { color: homeWins ? palette.text : palette.textMuted },
                  homeWins ? styles.teamFav : null,
                ]}
              >
                {game.status === 'final' ? game.home_score : ''}
              </Text>
            </View>
          ) : (
            <View style={styles.figure}>
              {rowFigure.digit ? (
                <Text
                  maxFontSizeMultiplier={1.15}
                  style={[styles.rowFigure, { color: palette.text }]}
                >
                  {rowFigure.digit}
                </Text>
              ) : null}
              <Text
                maxFontSizeMultiplier={1.3}
                numberOfLines={2}
                style={[styles.figurePhrase, { color: palette.text }]}
              >
                {rowFigure.phrase}
              </Text>
            </View>
          )}
        </View>
        <View style={{ marginTop: 8 }}>
          <FieldStrip
            pHome={game.model_home_wp}
            height={24}
            variant="mini"
            ringLabel={
              cover.phrase === 'Toss-up'
                ? t('cover.tossup')
                : `${favShort} ${favoritePercentLabel(game.model_home_wp)}`
            }
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { flex: 1 },
  first: { paddingHorizontal: 24 },
  lockup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mark: { width: 72, height: 72 },
  wordmark: { flex: 1, fontFamily: font.sansBold, fontSize: 28, lineHeight: 34 },
  lead: { fontFamily: font.sans, fontSize: 16, lineHeight: 24, marginTop: 16 },
  title: { fontFamily: font.sansBold, fontSize: 24, lineHeight: 30, margin: 16 },
  body: { fontFamily: font.sans, fontSize: 16, lineHeight: 24, marginHorizontal: 16 },
  kicker: {
    fontFamily: font.monoMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  display: {
    fontFamily: font.sansBold,
    fontSize: 96,
    lineHeight: 96,
    letterSpacing: -4,
    marginTop: 8,
  },
  meta: { fontFamily: font.sans, fontSize: 14, lineHeight: 20, marginTop: 8 },
  saved: { flex: 1, fontFamily: font.sans, fontSize: 12, lineHeight: 16 },
  chip: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipGap: { marginTop: 8 },
  chipText: {
    fontFamily: font.monoSemi,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  orbs: { flexDirection: 'row', gap: 4, marginTop: 12 },
  orb: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  orbText: { fontFamily: font.sansMedium, fontSize: 14 },
  compactBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    borderBottomWidth: 1,
  },
  compactRow: {
    height: nav.height,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  mastheadRow: { flexDirection: 'row', alignItems: 'flex-start' },
  mastheadMeta: { flex: 1, alignItems: 'flex-end' },
  compactNumber: { fontFamily: font.sansBold, fontSize: 22, lineHeight: 28 },
  banner: { fontFamily: font.sans, fontSize: 14, marginTop: 8 },
  day: {
    fontFamily: font.monoMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  card: {
    borderWidth: weekCard.border,
    borderRadius: weekCard.radius,
    padding: weekCard.padding,
  },
  rowTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  names: { flex: 1, gap: 0 },
  nameLine: { height: 24, flexDirection: 'row', alignItems: 'center', gap: weekCard.logoToName },
  hotDay: {
    alignSelf: 'flex-start',
    height: 20,
    borderRadius: 4,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  team: { fontFamily: font.sansMedium, fontSize: 16, lineHeight: 22 },
  teamFav: { fontFamily: font.sansBold },
  figure: { alignItems: 'flex-end', maxWidth: 128 },
  figurePhrase: {
    fontFamily: font.sansMedium,
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'right',
  },
  rowFigure: { fontFamily: font.sansBold, fontSize: 48, lineHeight: 48 },
  score: { fontFamily: font.monoSemi, fontSize: 22, lineHeight: 24 },
  cta: {
    minHeight: 48,
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  ctaText: { fontFamily: font.sansMedium, fontSize: 16 },
});
