import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Game, TeamsDocument } from '@/contract/types';
import { useI18n } from '@/i18n/LocaleProvider';
import { coverFromHomeProb, darkPalette, dots, font, teamLogos } from '@/theme/h2';

import { ExperimentFooter } from './Chrome';
import { CoverFigure } from './CoverFigure';
import { FieldStrip } from './FieldStrip';
import { TeamSlot } from './TeamSlot';
import { favoriteName, formatLocalWhen, gamePhase, shortName } from './weekModel';

export function DetailScreen({ game, teams }: { game: Game; teams: TeamsDocument | null }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fontScale = useWindowDimensions().fontScale || 1;
  const [now] = useState(() => Date.now());
  const phase = gamePhase(game, now);
  const cover = coverFromHomeProb(game.model_home_wp);
  const fav = favoriteName(game, teams);
  const away = teams?.teams[game.away];
  const home = teams?.teams[game.home];
  const awayName = away?.name ?? game.away;
  const homeName = home?.name ?? game.home;
  const pm = Math.round(cover.pFav * 100);
  const stacked = fontScale >= 1.3;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 16,
        gap: 12,
      }}
    >
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
        <Text style={styles.link}>{t('nav.week')}</Text>
      </Pressable>
      <Text maxFontSizeMultiplier={1.5} style={styles.kicker}>
        {t('detail.localtime')}
      </Text>
      <Text maxFontSizeMultiplier={1.5} style={styles.when}>
        {formatLocalWhen(game.kickoff, locale)}
      </Text>
      {phase === 'live' ? <Text style={styles.kicker}>{t('detail.livekicker')}</Text> : null}
      {phase === 'final' || phase === 'tie' ? (
        <Text style={styles.kicker}>{phase === 'tie' ? t('chip.tie') : t('chip.final')}</Text>
      ) : null}
      <View style={[styles.teams, stacked ? styles.stack : null]}>
        <TeamSlot
          name={awayName}
          abbr={game.away}
          color={away?.team_color ?? null}
          logoUrl={away?.logo ?? null}
          size={teamLogos.sizeHeader}
        />
        <Text maxFontSizeMultiplier={1.5} style={styles.match}>
          {t('detail.at', { away: awayName, home: homeName })}
        </Text>
        <TeamSlot
          name={homeName}
          abbr={game.home}
          color={home?.team_color ?? null}
          logoUrl={home?.logo ?? null}
          size={teamLogos.sizeHeader}
        />
      </View>
      {phase === 'final' && game.status === 'final' ? (
        <View style={styles.scores}>
          <Text style={[styles.score, game.result === 'away' ? styles.win : styles.lose]}>
            {shortName(awayName)} {game.away_score}
          </Text>
          <Text style={[styles.score, game.result === 'home' ? styles.win : styles.lose]}>
            {shortName(homeName)} {game.home_score}
          </Text>
        </View>
      ) : (
        <CoverFigure pHome={game.model_home_wp} favorite={fav} />
      )}
      {phase === 'tie' ? <Text style={styles.body}>{t('detail.tie.note')}</Text> : null}
      <View style={styles.fieldRow}>
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.3}
          style={styles.side}
          accessibilityLabel={`${t('field.visitor')}, ${shortName(awayName)}`}
        >
          {shortName(awayName)}
        </Text>
        <View style={styles.fieldGrow}>
          <FieldStrip
            pHome={game.model_home_wp}
            height={112}
            endZones
            label={
              cover.phrase === 'Toss-up'
                ? t('detail.near50')
                : t('detail.vals', { team: shortName(fav), pm })
            }
          />
        </View>
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.3}
          style={styles.side}
          accessibilityLabel={`${t('field.home')}, ${shortName(homeName)}`}
        >
          {shortName(homeName)}
        </Text>
      </View>
      <View style={styles.dots} accessibilityElementsHidden>
        {Array.from({ length: dots.count }, (_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index < cover.n ? darkPalette.text : darkPalette.border },
            ]}
          />
        ))}
      </View>
      <Text maxFontSizeMultiplier={1.5} style={styles.body}>
        {cover.phrase === 'Toss-up'
          ? t('detail.dots.tossup')
          : cover.phrase === 'More than 9 in 10'
            ? t('tb.cover.more9', { team: fav })
            : t('detail.dots', { team: fav, n: cover.n })}
      </Text>
      <ExperimentFooter onHow={() => router.push('/how')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  back: { minHeight: 48, justifyContent: 'center' },
  link: { color: darkPalette.text, fontFamily: font.sansMedium, fontSize: 16 },
  kicker: {
    color: darkPalette.textMuted,
    fontFamily: font.monoMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  when: { color: darkPalette.text, fontFamily: font.sansMedium, fontSize: 18 },
  teams: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stack: { flexDirection: 'column', alignItems: 'flex-start' },
  match: { color: darkPalette.text, fontFamily: font.sansBold, fontSize: 22, flex: 1 },
  scores: { gap: 4 },
  score: { fontFamily: font.monoSemi, fontSize: 32, lineHeight: 36 },
  win: { color: darkPalette.text, fontFamily: font.sansBold },
  lose: { color: darkPalette.textMuted },
  fieldRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  fieldGrow: { flex: 1 },
  side: {
    width: 72,
    marginTop: 48,
    color: darkPalette.textMuted,
    fontFamily: font.sansMedium,
    fontSize: 13,
    lineHeight: 16,
  },
  dots: { flexDirection: 'row', gap: dots.gap, flexWrap: 'wrap' },
  dot: { width: dots.size, height: dots.size, borderRadius: dots.size / 2 },
  body: { color: darkPalette.text, fontFamily: font.sans, fontSize: 16, lineHeight: 24 },
});
