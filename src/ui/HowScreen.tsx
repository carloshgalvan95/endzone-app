import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/i18n/LocaleProvider';
import { font } from '@/theme/h2';
import { useH2Theme } from '@/theme/ThemeProvider';

import { TopBar } from './Chrome';

export function HowScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [compact, setCompact] = useState(false);
  const { palette } = useH2Theme();
  return (
    <View style={[styles.screen, { backgroundColor: palette.bg }]}>
      <TopBar onBack={() => router.back()} title={t('detail.how')} showTitle={compact} />
      <ScrollView
        style={styles.list}
        scrollEventThrottle={16}
        onScroll={(event) => setCompact(event.nativeEvent.contentOffset.y > 48)}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
          gap: 16,
        }}
      >
        <Text style={[styles.title, { color: palette.text }]}>{t('detail.how')}</Text>
        <Text style={[styles.body, { color: palette.text }]}>{t('how.cover')}</Text>
        <Text style={[styles.body, { color: palette.text }]}>{t('how.field')}</Text>
        <Text style={[styles.body, { color: palette.text }]}>{t('how.honest')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { flex: 1 },
  title: { fontFamily: font.sansBold, fontSize: 32, lineHeight: 36 },
  body: { fontFamily: font.sans, fontSize: 16, lineHeight: 24 },
});
