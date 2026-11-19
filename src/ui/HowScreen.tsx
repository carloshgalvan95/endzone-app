import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/i18n/LocaleProvider';
import { darkPalette, font } from '@/theme/h2';

import { TopBar } from './Chrome';

export function HowScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [compact, setCompact] = useState(false);
  return (
    <View style={styles.screen}>
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
        <Text style={styles.title}>{t('detail.how')}</Text>
        <Text style={styles.body}>{t('how.cover')}</Text>
        <Text style={styles.body}>{t('how.field')}</Text>
        <Text style={styles.body}>{t('how.honest')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  list: { flex: 1 },
  title: { color: darkPalette.text, fontFamily: font.sansBold, fontSize: 32, lineHeight: 36 },
  body: { color: darkPalette.text, fontFamily: font.sans, fontSize: 16, lineHeight: 24 },
});
