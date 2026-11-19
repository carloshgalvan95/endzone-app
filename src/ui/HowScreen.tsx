import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/i18n/LocaleProvider';
import { darkPalette, font } from '@/theme/h2';

export function HowScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingHorizontal: 16,
        paddingBottom: 32,
        gap: 16,
      }}
    >
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
        <Text style={styles.link}>{t('nav.week')}</Text>
      </Pressable>
      <Text style={styles.title}>{t('detail.how')}</Text>
      <Text style={styles.body}>{t('how.cover')}</Text>
      <Text style={styles.body}>{t('how.field')}</Text>
      <Text style={styles.body}>{t('how.honest')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  back: { minHeight: 48, justifyContent: 'center' },
  link: { color: darkPalette.text, fontFamily: font.sansMedium, fontSize: 16 },
  title: { color: darkPalette.text, fontFamily: font.sansBold, fontSize: 32, lineHeight: 36 },
  body: { color: darkPalette.text, fontFamily: font.sans, fontSize: 16, lineHeight: 24 },
});
