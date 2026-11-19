import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/i18n/LocaleProvider';
import { darkPalette, font, nav } from '@/theme/h2';

export function ExperimentFooter({ onHow }: { onHow: () => void }) {
  const { t } = useI18n();
  return (
    <Pressable accessibilityRole="link" onPress={onHow} style={styles.footer}>
      <Text maxFontSizeMultiplier={1.5} style={styles.footerText}>
        {t('detail.footer')}
      </Text>
      <Text maxFontSizeMultiplier={1.5} style={styles.link}>
        {t('detail.how')}
      </Text>
    </Pressable>
  );
}

export function BottomNav() {
  const { t } = useI18n();
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const items = [
    { href: '/' as const, label: t('nav.week'), match: path === '/' },
    { href: '/record' as const, label: t('nav.history'), match: path === '/record' },
    { href: '/settings' as const, label: t('nav.settings'), match: path === '/settings' },
  ];
  return (
    <View
      style={[styles.nav, { paddingBottom: insets.bottom, height: nav.height + insets.bottom }]}
    >
      {items.map((item) => (
        <Pressable
          key={item.href}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          onPress={() => router.push(item.href)}
          style={styles.item}
        >
          <View style={[styles.indicator, item.match ? styles.indicatorOn : null]}>
            <View
              style={[
                styles.icon,
                { backgroundColor: item.match ? darkPalette.text : darkPalette.textMuted },
              ]}
            />
          </View>
          <Text
            maxFontSizeMultiplier={1.3}
            style={{
              color: item.match ? darkPalette.text : darkPalette.textMuted,
              fontFamily: font.sansMedium,
              fontSize: 12,
            }}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 2,
  },
  footerText: {
    color: darkPalette.textMuted,
    fontFamily: font.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: darkPalette.text,
    fontFamily: font.sansMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  nav: {
    flexDirection: 'row',
    backgroundColor: darkPalette.bg,
    borderTopWidth: 1,
    borderTopColor: darkPalette.border,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    gap: 2,
  },
  indicator: {
    width: 56,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorOn: {
    backgroundColor: darkPalette.surface,
  },
  icon: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
});
