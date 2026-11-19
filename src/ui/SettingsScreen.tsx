import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useQueryClient } from '@tanstack/react-query';

import { clearSavedData, readCacheSavedAt } from '@/data/QueryProvider';
import {
  disableTuesdayAlert,
  enableTuesdayAlert,
  readTuesdayAlertEnabled,
} from '@/features/notifications/tuesday';
import { useI18n } from '@/i18n/LocaleProvider';
import type { LocalePreference } from '@/i18n';
import { font, langOption, nav, opacity } from '@/theme/h2';
import { useH2Theme, useTheme } from '@/theme/ThemeProvider';
import type { ThemePreference } from '@/theme/resolveTheme';

import { BottomNav } from './Chrome';
import { hapticSwitch } from './haptics';
import { formatLocalWhen } from './weekModel';

export function SettingsScreen() {
  const { t, preference, setPreference, locale } = useI18n();
  const theme = useTheme();
  const { palette, preference: themePreference, setPreference: setThemePreference } = useH2Theme();
  const insets = useSafeAreaInsets();
  const client = useQueryClient();
  const [alertOn, setAlertOn] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [cacheNote, setCacheNote] = useState<string | null>(null);

  useEffect(() => {
    readTuesdayAlertEnabled()
      .then(setAlertOn)
      .catch(() => undefined);
    readCacheSavedAt()
      .then(setSavedAt)
      .catch(() => undefined);
  }, []);

  const options: { id: LocalePreference; label: string }[] = [
    { id: 'system', label: t('set.lang.system') },
    { id: 'en', label: t('set.lang.en') },
    { id: 'es', label: t('set.lang.es') },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: palette.bg }]}>
      <ScrollView
        style={styles.list}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: nav.listPaddingBottom(insets.bottom),
          gap: 0,
        }}
      >
        <Text style={[styles.title, { color: palette.text }]}>{t('set.title')}</Text>
        <Text style={[styles.kicker, { color: palette.textMuted, marginTop: 16, marginBottom: 8 }]}>
          {t('set.lang')}
        </Text>
        {options.map((option) => {
          const selected = preference === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setPreference(option.id)}
              style={styles.option}
            >
              <View
                style={[
                  styles.radio,
                  { borderColor: palette.textMuted },
                  selected ? { backgroundColor: palette.text, borderColor: palette.text } : null,
                ]}
              />
              <Text style={[styles.body, { color: palette.text }]}>{option.label}</Text>
            </Pressable>
          );
        })}
        <Text style={[styles.muted, { color: palette.textMuted }]}>
          {t('set.lang.system.help')}
        </Text>
        <Text style={[styles.kicker, { color: palette.textMuted, marginTop: 16, marginBottom: 8 }]}>
          {t('set.theme')}
        </Text>
        {(
          [
            ['system', t('set.theme.auto')],
            ['dark', t('set.theme.dark')],
            ['light', t('set.theme.light')],
          ] as const
        ).map(([id, label]) => {
          const selected = themePreference === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setThemePreference(id as ThemePreference)}
              style={({ pressed }) => [
                styles.option,
                pressed ? { opacity: opacity.pressed } : null,
              ]}
            >
              <View
                style={[
                  styles.radio,
                  { borderColor: palette.textMuted },
                  selected ? { backgroundColor: palette.text, borderColor: palette.text } : null,
                ]}
              />
              <Text style={[styles.body, { color: palette.text }]}>{label}</Text>
            </Pressable>
          );
        })}
        <Text style={[styles.kicker, { color: palette.textMuted, marginTop: 16, marginBottom: 8 }]}>
          {t('set.cache')}
        </Text>
        <View style={styles.row}>
          <Text style={[styles.kicker, { color: palette.textMuted, flex: 1 }]}>
            {cacheNote ??
              (savedAt
                ? t('set.cache.when', {
                    dt: formatLocalWhen(new Date(savedAt).toISOString(), locale),
                  })
                : t('set.cache.empty'))}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: savedAt == null }}
            disabled={savedAt == null}
            onPress={() => {
              client.clear();
              clearSavedData()
                .then(() => {
                  setSavedAt(null);
                  setCacheNote(t('set.cache.cleared'));
                })
                .catch(() => undefined);
            }}
            style={styles.clear}
          >
            <Text
              style={[
                styles.body,
                { color: palette.text, opacity: savedAt == null ? opacity.disabled : 1 },
              ]}
            >
              {t('set.clear')}
            </Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Text style={[styles.body, { color: palette.text }]}>{t('set.alert')}</Text>
          <Switch
            accessibilityLabel={t('set.alert')}
            value={alertOn}
            onValueChange={(next) => {
              if (!next) {
                disableTuesdayAlert()
                  .then(() => {
                    hapticSwitch(false).catch(() => undefined);
                    setAlertOn(false);
                    setNote(null);
                  })
                  .catch(() => undefined);
                return;
              }
              enableTuesdayAlert()
                .then((result) => {
                  if (result === 'enabled') {
                    hapticSwitch(true).catch(() => undefined);
                  }
                  setAlertOn(result === 'enabled');
                  setNote(result === 'denied' ? t('off.nocache') : null);
                })
                .catch(() => undefined);
            }}
            trackColor={{ true: theme.color.brand, false: palette.border }}
          />
        </View>
        <Text style={[styles.muted, { color: palette.textMuted }]}>
          {alertOn ? t('set.on') : t('set.off')}
        </Text>
        {note ? <Text style={[styles.muted, { color: palette.textMuted }]}>{note}</Text> : null}
        <Text style={[styles.kicker, { color: palette.textMuted, marginTop: 16 }]}>
          {t('set.version')}
        </Text>
        <Text style={[styles.body, { color: palette.text }]}>
          {Constants.expoConfig?.version ?? '0.3.0'}
        </Text>
        <Text style={[styles.body, { color: palette.text }]}>{t('set.about.body')}</Text>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { flex: 1 },
  title: { fontFamily: font.sansBold, fontSize: 32, lineHeight: 36 },
  kicker: {
    fontFamily: font.monoMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: { fontFamily: font.sans, fontSize: 16, lineHeight: 24, flex: 1 },
  muted: { fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  clear: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 8 },
  option: { minHeight: langOption.minHeight, flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: {
    width: langOption.radio,
    height: langOption.radio,
    borderRadius: langOption.radio / 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radioOn: {},
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
