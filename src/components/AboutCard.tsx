import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { MODEL_CARD_URL, REPOSITORY_URL, SITE_URL } from '@/contract/urls';
import { useTheme } from '@/theme/ThemeProvider';

import { AppText } from './AppText';

export type AboutCardProps = {
  modelName?: string;
  modelVersion?: string;
  modelAlias?: string | null;
  featureSet?: string;
  generatedAt?: string;
  teamsSource?: string;
  teamsSourceUrl?: string;
};

function LinkRow({ label, url }: { label: string; url: string }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={() => {
        Linking.openURL(url).catch(() => undefined);
      }}
      style={[styles.link, { borderColor: theme.color.border }]}
    >
      <AppText variant="button" style={{ color: theme.color.brand }}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function AboutCard({
  modelName,
  modelVersion,
  modelAlias,
  featureSet,
  generatedAt,
  teamsSource,
  teamsSourceUrl,
}: AboutCardProps) {
  const theme = useTheme();
  return (
    <ScrollView
      testID="about-card"
      style={{ backgroundColor: theme.color.bg }}
      contentContainerStyle={styles.content}
    >
      <AppText variant="kicker">Model card</AppText>
      <AppText variant="title">Open experiment</AppText>
      <AppText variant="body">
        endzone is an open experiment. It shows a model home win probability next to the market for
        each NFL game.
      </AppText>
      <AppText variant="body">
        On the record this project publishes, the market has the lower log loss. Lower log loss is
        closer to the results, so the market has been the better probability. This app does not
        claim otherwise.
      </AppText>
      <AppText variant="body">
        This is not betting advice. It is not a pick service. Nothing here is a recommendation to
        bet.
      </AppText>
      <View
        style={[
          styles.meta,
          { borderColor: theme.color.border, backgroundColor: theme.color.surface },
        ]}
      >
        <AppText variant="kicker">This build of the slate</AppText>
        <AppText variant="mono">{modelVersion ?? 'Not loaded yet'}</AppText>
        {modelAlias ? <AppText variant="muted">Alias {modelAlias}</AppText> : null}
        {modelName ? <AppText variant="muted">{modelName}</AppText> : null}
        {featureSet ? <AppText variant="muted">Features {featureSet}</AppText> : null}
        {generatedAt ? <AppText variant="muted">Generated {generatedAt}</AppText> : null}
      </View>
      <AppText variant="muted">
        The app reads the public JSON on GitHub Pages. It does not ship a model file.
      </AppText>
      <AppText variant="muted">
        {teamsSource
          ? `Team names and logos come from ${teamsSource}. They are trademarks of their owners. This app is not affiliated with the NFL.`
          : 'Team names and logos are trademarks of their owners. This app is not affiliated with the NFL.'}
      </AppText>
      <View style={styles.links}>
        <LinkRow label="Model card" url={MODEL_CARD_URL} />
        <LinkRow label="Repository" url={REPOSITORY_URL} />
        <LinkRow label="Site" url={SITE_URL} />
        {teamsSourceUrl ? <LinkRow label="Team catalog source" url={teamsSourceUrl} /> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  meta: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  links: {
    gap: 8,
  },
  link: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
});
