import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/i18n/LocaleProvider';
import { font, nav, opacity } from '@/theme/h2';
import { useH2Theme } from '@/theme/ThemeProvider';

import { hapticSelect } from './haptics';

import { BackIcon, HistoryIcon, SettingsIcon, WeekIcon } from './NavIcons';

export function ExperimentFooter({ onHow }: { onHow: () => void }) {
  const { t } = useI18n();
  const { palette } = useH2Theme();
  return (
    <Pressable accessibilityRole="link" onPress={onHow} style={styles.footer}>
      <Text maxFontSizeMultiplier={1.5} style={[styles.footerText, { color: palette.textMuted }]}>
        {t('detail.footer')}
      </Text>
      <Text maxFontSizeMultiplier={1.5} style={[styles.link, { color: palette.text }]}>
        {t('detail.how')}
      </Text>
    </Pressable>
  );
}

export function TopBar({
  onBack,
  title,
  showTitle,
  accessory,
}: {
  onBack: () => void;
  title: string;
  showTitle: boolean;
  accessory?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { palette } = useH2Theme();
  return (
    <View
      style={[
        styles.top,
        {
          paddingTop: insets.top,
          height: nav.height + insets.top,
          backgroundColor: palette.bg,
          borderBottomColor: palette.border,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('nav.week')}
        onPress={onBack}
        style={({ pressed }) => [styles.back, pressed ? { opacity: opacity.pressed } : null]}
      >
        <BackIcon color={palette.text} />
      </Pressable>
      {showTitle ? (
        <View style={styles.compact}>
          {accessory}
          <Text
            maxFontSizeMultiplier={1.3}
            numberOfLines={1}
            style={[styles.compactTitle, { color: palette.text }]}
          >
            {title}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export function BottomNav() {
  const { t } = useI18n();
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const { palette } = useH2Theme();
  const items = [
    { href: '/' as const, label: t('nav.week'), match: path === '/', icon: 'week' as const },
    {
      href: '/record' as const,
      label: t('nav.history'),
      match: path === '/record',
      icon: 'history' as const,
    },
    {
      href: '/settings' as const,
      label: t('nav.settings'),
      match: path === '/settings',
      icon: 'settings' as const,
    },
  ];
  return (
    <View
      style={[
        styles.nav,
        {
          paddingBottom: insets.bottom,
          height: nav.height + insets.bottom,
          backgroundColor: palette.bg,
          borderTopColor: palette.border,
        },
      ]}
    >
      {items.map((item) => {
        const color = item.match ? palette.textInverse : palette.textMuted;
        return (
          <Pressable
            key={item.href}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: item.match }}
            onPress={() => {
              hapticSelect().catch(() => undefined);
              router.push(item.href);
            }}
            style={styles.item}
          >
            <View style={[styles.indicator, item.match ? { backgroundColor: palette.text } : null]}>
              {item.icon === 'week' ? <WeekIcon color={color} /> : null}
              {item.icon === 'history' ? <HistoryIcon color={color} /> : null}
              {item.icon === 'settings' ? <SettingsIcon color={color} active={item.match} /> : null}
            </View>
            <Text
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              style={{
                color: item.match ? palette.text : palette.textMuted,
                fontFamily: font.sansMedium,
                fontSize: 12,
                lineHeight: 16,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    minHeight: 48,
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  footerText: {
    fontFamily: font.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    fontFamily: font.sansMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  back: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  compactTitle: {
    flex: 1,
    fontFamily: font.sansBold,
    fontSize: 22,
    lineHeight: 28,
  },
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    gap: 2,
  },
  indicator: {
    width: nav.indicator.width,
    height: nav.indicator.height,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
