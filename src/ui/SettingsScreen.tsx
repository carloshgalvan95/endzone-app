import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import {
  disableTuesdayAlert,
  enableTuesdayAlert,
  readTuesdayAlertEnabled,
} from '@/features/notifications/tuesday';
import { useI18n } from '@/i18n/LocaleProvider';
import type { LocalePreference } from '@/i18n';
import { darkPalette, font, langOption, nav } from '@/theme/h2';
import { useTheme } from '@/theme/ThemeProvider';

import { BottomNav } from './Chrome';

export function SettingsScreen() {
  const { t, preference, setPreference } = useI18n();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [alertOn, setAlertOn] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    readTuesdayAlertEnabled()
      .then(setAlertOn)
      .catch(() => undefined);
  }, []);

  const options: { id: LocalePreference; label: string }[] = [
    { id: 'system', label: t('set.lang.system') },
    { id: 'en', label: t('set.lang.en') },
    { id: 'es', label: t('set.lang.es') },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.list}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: nav.listPaddingBottom(insets.bottom),
          gap: 16,
        }}
      >
        <Text style={styles.title}>{t('set.title')}</Text>
        <Text style={styles.kicker}>{t('set.lang')}</Text>
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
              <View style={[styles.radio, selected ? styles.radioOn : null]} />
              <Text style={styles.body}>{option.label}</Text>
            </Pressable>
          );
        })}
        <Text style={styles.muted}>{t('set.lang.system.help')}</Text>
        <View style={styles.row}>
          <Text style={styles.body}>{t('set.alert')}</Text>
          <Switch
            accessibilityLabel={t('set.alert')}
            value={alertOn}
            onValueChange={(next) => {
              if (!next) {
                disableTuesdayAlert()
                  .then(() => {
                    setAlertOn(false);
                    setNote(null);
                  })
                  .catch(() => undefined);
                return;
              }
              enableTuesdayAlert()
                .then((result) => {
                  setAlertOn(result === 'enabled');
                  setNote(result === 'denied' ? t('off.nocache') : null);
                })
                .catch(() => undefined);
            }}
            trackColor={{ true: theme.color.brand, false: darkPalette.border }}
          />
        </View>
        <Text style={styles.muted}>{alertOn ? t('set.on') : t('set.off')}</Text>
        {note ? <Text style={styles.muted}>{note}</Text> : null}
        <Text style={styles.kicker}>{t('set.version')}</Text>
        <Text style={styles.body}>{Constants.expoConfig?.version ?? '0.3.0'}</Text>
        <Text style={styles.body}>{t('set.about.body')}</Text>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkPalette.bg },
  list: { flex: 1 },
  title: { color: darkPalette.text, fontFamily: font.sansBold, fontSize: 32, lineHeight: 36 },
  kicker: {
    color: darkPalette.textMuted,
    fontFamily: font.monoMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: { color: darkPalette.text, fontFamily: font.sans, fontSize: 16, lineHeight: 24, flex: 1 },
  muted: { color: darkPalette.textMuted, fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  option: { minHeight: langOption.minHeight, flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: {
    width: langOption.radio,
    height: langOption.radio,
    borderRadius: langOption.radio / 2,
    borderWidth: 2,
    borderColor: darkPalette.textMuted,
  },
  radioOn: { backgroundColor: darkPalette.text, borderColor: darkPalette.text },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
