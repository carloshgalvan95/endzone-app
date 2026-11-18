import { useEffect, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import {
  disableTuesdayAlert,
  enableTuesdayAlert,
  readTuesdayAlertEnabled,
} from '@/features/notifications/tuesday';
import { useTheme } from '@/theme/ThemeProvider';

import { AppText } from './AppText';

export function SettingsCard() {
  const theme = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    readTuesdayAlertEnabled()
      .then((value) => {
        if (active) {
          setEnabled(value);
          setReady(true);
        }
      })
      .catch(() => {
        if (active) {
          setReady(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function onToggle(next: boolean): Promise<void> {
    if (!next) {
      await disableTuesdayAlert();
      setEnabled(false);
      setNote(null);
      return;
    }
    const result = await enableTuesdayAlert();
    if (result === 'denied') {
      setEnabled(false);
      setNote('Notifications are blocked, so the Tuesday alert stays off.');
      return;
    }
    setEnabled(true);
    setNote(null);
  }

  return (
    <View testID="settings-card" style={[styles.screen, { backgroundColor: theme.color.bg }]}>
      <AppText variant="kicker">Settings</AppText>
      <AppText variant="title">Tuesday alert</AppText>
      <AppText variant="body">
        Off by default. Turn it on to schedule a local notification each Tuesday at 10:00 in the
        local time of this phone, saying the new week is likely up. Nothing is sent to a server.
      </AppText>
      <View
        style={[
          styles.row,
          { borderColor: theme.color.border, backgroundColor: theme.color.surface },
        ]}
      >
        <AppText variant="body">Tuesday alert</AppText>
        <Switch
          accessibilityLabel="Tuesday alert"
          testID="tuesday-alert-switch"
          disabled={!ready}
          value={enabled}
          onValueChange={(value) => {
            onToggle(value).catch(() => {
              setNote('The alert could not be changed.');
            });
          }}
          trackColor={{ true: theme.color.brand, false: theme.color.border }}
        />
      </View>
      {note ? <AppText variant="muted">{note}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  row: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});
