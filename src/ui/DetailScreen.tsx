import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Game, TeamsDocument } from '@/contract/types';
import { useI18n } from '@/i18n/LocaleProvider';
import { coverFromHomeProb, dots, field, font, rhythm, teamLogos } from '@/theme/h2';
import { useH2Theme } from '@/theme/ThemeProvider';

import { ExperimentFooter, TopBar } from './Chrome';
import { CoverFigure } from './CoverFigure';
import { FieldStrip } from './FieldStrip';
import { TeamSlot } from './TeamSlot';
import { countdownCopy } from './schedule';
import { favoritePercentLabel } from './weekFigure';
import { favoriteName, formatLocalWhen, gamePhase, shortName } from './weekModel';

export function DetailScreen({ game, teams }: { game: Game; teams: TeamsDocument | null }) {
  const { t, locale } = useI18n();
  const { palette, reducedMotion } = useH2Theme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontScale = useWindowDimensions().fontScale || 1;
  const [now, setNow] = useState(() => Date.now());
  const phase = gamePhase(game, now);
  const cover = coverFromHomeProb(game.model_home_wp);
  const fav = favoriteName(game, teams);
  const away = teams?.teams[game.away];
  const home = teams?.teams[game.home];
  const awayName = away?.name ?? game.away;
  const homeName = home?.name ?? game.home;
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const pm = Math.round(cover.pFav * 100);
  const count = phase === 'preview' ? countdownCopy(Date.parse(game.kickoff) - now) : null;
  const stacked = fontScale >= 1.3;
  const [compact, setCompact] = useState(false);
  const windowWidth = useWindowDimensions().width;
  const bleed = Math.max(0, (field.width - (windowWidth - 32)) / 2);

  return (
    <View style={[styles.screen, { backgroundColor: palette.bg }]}>
      <TopBar
        onBack={() => router.back()}
        title={t('detail.compact', { away: shortName(awayName), home: shortName(homeName) })}
        showTitle={compact}
        accessory={
          compact ? (
            <View style={styles.barLogos}>
              <TeamSlot
                name={awayName}
                abbr={game.away}
                color={away?.team_color ?? null}
                logoUrl={away?.logo ?? null}
                size={teamLogos.sizeBar}
              />
              <TeamSlot
                name={homeName}
                abbr={game.home}
                color={home?.team_color ?? null}
                logoUrl={home?.logo ?? null}
                size={teamLogos.sizeBar}
              />
            </View>
          ) : null
        }
      />
      <ScrollView
        style={styles.list}
        scrollEventThrottle={16}
        onScroll={(event) => setCompact(event.nativeEvent.contentOffset.y >= 80)}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + rhythm.detail.afterLink,
          paddingHorizontal: rhythm.detail.padX,
        }}
      >
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.kicker, { color: palette.text, marginTop: rhythm.detail.afterBar }]}
        >
          {phase === 'final'
            ? t('chip.final')
            : phase === 'tie'
              ? t('chip.tie')
              : t('detail.localtime')}
        </Text>
        <Text
          maxFontSizeMultiplier={1.5}
          style={[styles.when, { color: palette.text, marginTop: rhythm.detail.kickerToDate }]}
        >
          {formatLocalWhen(game.kickoff, locale)}
        </Text>
        {count ? (
          <Text
            maxFontSizeMultiplier={1.5}
            style={[
              styles.when,
              { color: palette.text, marginTop: 8, opacity: reducedMotion ? 1 : 1 },
            ]}
          >
            {t(count.key, count.vars)}
          </Text>
        ) : null}
        {phase === 'live' ? (
          <Text style={[styles.kicker, { color: palette.text, marginTop: 8 }]}>
            {t('chip.live')} {t('detail.livekicker')}
          </Text>
        ) : null}
        <View
          style={[
            styles.teams,
            stacked ? styles.stack : null,
            { marginTop: rhythm.detail.dateToTitle },
          ]}
        >
          <TeamSlot
            name={awayName}
            abbr={game.away}
            color={away?.team_color ?? null}
            logoUrl={away?.logo ?? null}
            size={teamLogos.sizeHeader}
          />
          <TeamSlot
            name={homeName}
            abbr={game.home}
            color={home?.team_color ?? null}
            logoUrl={home?.logo ?? null}
            size={teamLogos.sizeHeader}
          />
          <Text maxFontSizeMultiplier={1.5} style={[styles.match, { color: palette.text }]}>
            {t('detail.at', { away: awayName, home: homeName })}
          </Text>
        </View>
        {phase === 'final' && game.status === 'final' ? (
          <View style={{ marginTop: rhythm.detail.titleToCover, gap: 4 }}>
            {(
              [
                { name: shortName(awayName), score: game.away_score, win: game.result === 'away' },
                { name: shortName(homeName), score: game.home_score, win: game.result === 'home' },
              ] as const
            ).map((side) => (
              <View key={side.name} style={styles.scoreRow}>
                <Text
                  style={{
                    fontFamily: side.win ? font.sansBold : font.sans,
                    fontSize: 18,
                    lineHeight: 24,
                    color: side.win ? palette.text : palette.textMuted,
                  }}
                >
                  {side.name}
                </Text>
                <Text
                  style={{
                    fontFamily: font.monoSemi,
                    fontSize: 32,
                    lineHeight: 36,
                    fontVariant: ['tabular-nums'],
                    color: side.win ? palette.text : palette.textMuted,
                  }}
                >
                  {side.score}
                </Text>
              </View>
            ))}
            <Text
              style={{
                marginTop: 16,
                color: palette.text,
                fontFamily: font.sansMedium,
                fontSize: 18,
                lineHeight: 24,
              }}
            >
              {t('cover.old', { n: cover.n, team: shortName(fav) })}
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: rhythm.detail.titleToCover }}>
            <CoverFigure pHome={game.model_home_wp} favorite={shortName(fav)} />
          </View>
        )}
        {phase === 'tie' ? <Text style={styles.body}>{t('detail.tie.note')}</Text> : null}
        <View
          style={[
            styles.fieldBlock,
            {
              width: field.width,
              marginHorizontal: -bleed,
              marginTop: rhythm.detail.winsToFieldLabels,
            },
          ]}
        >
          <View style={styles.sides}>
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={[styles.side, { color: palette.textMuted }]}
              accessibilityLabel={`${t('field.visitor')}, ${shortName(awayName)}`}
            >
              {shortName(awayName)}
            </Text>
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={[styles.side, { color: palette.textMuted }]}
              accessibilityLabel={`${t('field.home')}, ${shortName(homeName)}`}
            >
              {shortName(homeName)}
            </Text>
          </View>
          <View style={{ marginTop: rhythm.detail.labelsToField }}>
            <FieldStrip
              pHome={game.model_home_wp}
              height={field.detailHeight}
              width={field.width}
              variant="detail"
              ringLabel={favoritePercentLabel(game.model_home_wp)}
            />
          </View>
        </View>
        <Text
          maxFontSizeMultiplier={1.3}
          style={[styles.vals, { color: palette.modelLabel, marginTop: rhythm.detail.fieldToVals }]}
        >
          {cover.phrase === 'Toss-up'
            ? t('detail.near50')
            : t('detail.vals', { team: shortName(fav), pm: `${pm}%` })}
        </Text>
        <View
          style={[styles.dots, { marginTop: rhythm.detail.valsToDots }]}
          accessibilityElementsHidden
        >
          {Array.from({ length: dots.count }, (_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index < cover.n ? palette.text : palette.border },
              ]}
            />
          ))}
        </View>
        {phase === 'final' ? null : (
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.body, { color: palette.text, marginTop: rhythm.detail.dotsToPhrase }]}
          >
            {cover.phrase === 'Toss-up'
              ? t('detail.dots.tossup')
              : cover.phrase === 'More than 9 in 10'
                ? t('tb.cover.more9', { team: fav })
                : t('detail.dots', { team: fav, n: cover.n })}
          </Text>
        )}
        <View style={{ flexGrow: 1, minHeight: rhythm.detail.phraseToFooter }} />
        <ExperimentFooter onHow={() => router.push('/how')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { flex: 1 },
  barLogos: { flexDirection: 'row', gap: 4 },
  kicker: {
    fontFamily: font.monoMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  when: { fontFamily: font.sansMedium, fontSize: 18 },
  teams: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  stack: { flexDirection: 'column', alignItems: 'flex-start' },
  match: { fontFamily: font.sansBold, fontSize: 22, flexShrink: 1 },
  scores: { gap: 4 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  score: { fontFamily: font.monoSemi, fontSize: 32, lineHeight: 36 },
  win: { fontFamily: font.sansBold },
  lose: {},
  fieldBlock: { alignSelf: 'center' },
  sides: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  side: {
    fontFamily: font.sansMedium,
    fontSize: 13,
    lineHeight: 16,
    maxWidth: 140,
  },
  vals: {
    fontFamily: font.monoSemi,
    fontSize: 14,
    lineHeight: 16,
  },
  dots: { flexDirection: 'row', gap: dots.gap, flexWrap: 'wrap' },
  dot: { width: dots.size, height: dots.size, borderRadius: dots.size / 2 },
  body: { fontFamily: font.sans, fontSize: 16, lineHeight: 24 },
});
