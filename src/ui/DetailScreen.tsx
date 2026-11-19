import { useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Game, TeamsDocument } from '@/contract/types';
import { useI18n } from '@/i18n/LocaleProvider';
import { coverFromHomeProb, darkPalette, dots, field, font, teamLogos } from '@/theme/h2';

import { ExperimentFooter, TopBar } from './Chrome';
import { CoverFigure } from './CoverFigure';
import { FieldStrip } from './FieldStrip';
import { TeamSlot } from './TeamSlot';
import { favoritePercentLabel } from './weekFigure';
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
  const [compact, setCompact] = useState(false);
  const windowWidth = useWindowDimensions().width;
  const bleed = Math.max(0, (field.width - (windowWidth - 32)) / 2);

  return (
    <View style={styles.screen}>
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
        onScroll={(event) => setCompact(event.nativeEvent.contentOffset.y > 48)}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
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
          <TeamSlot
            name={homeName}
            abbr={game.home}
            color={home?.team_color ?? null}
            logoUrl={home?.logo ?? null}
            size={teamLogos.sizeHeader}
          />
          <Text maxFontSizeMultiplier={1.5} style={styles.match}>
            {t('detail.at', { away: awayName, home: homeName })}
          </Text>
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
        <View style={[styles.fieldBlock, { width: field.width, marginHorizontal: -bleed }]}>
          <View style={styles.sides}>
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={styles.side}
              accessibilityLabel={`${t('field.visitor')}, ${shortName(awayName)}`}
            >
              {shortName(awayName)}
            </Text>
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={styles.side}
              accessibilityLabel={`${t('field.home')}, ${shortName(homeName)}`}
            >
              {shortName(homeName)}
            </Text>
          </View>
          <FieldStrip
            pHome={game.model_home_wp}
            height={field.detailHeight}
            width={field.width}
            variant="detail"
            ringLabel={favoritePercentLabel(game.model_home_wp)}
          />
        </View>
        <Text maxFontSizeMultiplier={1.3} style={styles.vals}>
          {cover.phrase === 'Toss-up'
            ? t('detail.near50')
            : t('detail.vals', { team: shortName(fav), pm: `${pm}%` })}
        </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  list: { flex: 1 },
  barLogos: { flexDirection: 'row', gap: 4 },
  kicker: {
    color: darkPalette.textMuted,
    fontFamily: font.monoMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  when: { color: darkPalette.text, fontFamily: font.sansMedium, fontSize: 18 },
  teams: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  stack: { flexDirection: 'column', alignItems: 'flex-start' },
  match: { color: darkPalette.text, fontFamily: font.sansBold, fontSize: 22, flexShrink: 1 },
  scores: { gap: 4 },
  score: { fontFamily: font.monoSemi, fontSize: 32, lineHeight: 36 },
  win: { color: darkPalette.text, fontFamily: font.sansBold },
  lose: { color: darkPalette.textMuted },
  fieldBlock: { alignSelf: 'center' },
  sides: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  side: {
    color: darkPalette.textMuted,
    fontFamily: font.sansMedium,
    fontSize: 13,
    lineHeight: 16,
    maxWidth: 140,
  },
  vals: {
    color: darkPalette.modelLabel,
    fontFamily: font.monoSemi,
    fontSize: 14,
    lineHeight: 16,
  },
  dots: { flexDirection: 'row', gap: dots.gap, flexWrap: 'wrap' },
  dot: { width: dots.size, height: dots.size, borderRadius: dots.size / 2 },
  body: { color: darkPalette.text, fontFamily: font.sans, fontSize: 16, lineHeight: 24 },
});
