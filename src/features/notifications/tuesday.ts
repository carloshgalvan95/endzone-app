import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AndroidImportance,
  cancelScheduledNotificationAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  SchedulableTriggerInputTypes,
  setNotificationChannelAsync,
  type WeeklyTriggerInput,
} from 'expo-notifications';
import { Platform } from 'react-native';

export const TUESDAY_STORAGE_KEY = 'endzone-tuesday-alert';
export const TUESDAY_NOTIFICATION_ID = 'endzone-tuesday-week';
export const TUESDAY_CHANNEL_ID = 'endzone-week';
/** Expo counts Sunday as 1. */
export const TUESDAY_WEEKDAY = 3;
export const TUESDAY_HOUR = 10;
export const TUESDAY_MINUTE = 0;

export const TUESDAY_ALERT_TITLE = 'The new week is likely up';
export const TUESDAY_ALERT_BODY =
  'Open endzone to read this week. This is an open experiment, not a recommendation.';

export function tuesdayTrigger(): WeeklyTriggerInput {
  return {
    type: SchedulableTriggerInputTypes.WEEKLY,
    channelId: TUESDAY_CHANNEL_ID,
    weekday: TUESDAY_WEEKDAY,
    hour: TUESDAY_HOUR,
    minute: TUESDAY_MINUTE,
  };
}

export async function readTuesdayAlertEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(TUESDAY_STORAGE_KEY);
    return value === '1';
  } catch {
    return false;
  }
}

async function remember(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(TUESDAY_STORAGE_KEY, enabled ? '1' : '0');
}

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await setNotificationChannelAsync(TUESDAY_CHANNEL_ID, {
    name: 'Weekly slate',
    importance: AndroidImportance.DEFAULT,
  });
}

async function scheduleTuesdayAlert(): Promise<void> {
  await ensureChannel();
  await scheduleNotificationAsync({
    identifier: TUESDAY_NOTIFICATION_ID,
    content: {
      title: TUESDAY_ALERT_TITLE,
      body: TUESDAY_ALERT_BODY,
    },
    trigger: tuesdayTrigger(),
  });
}

export async function enableTuesdayAlert(): Promise<'enabled' | 'denied'> {
  const current = await getPermissionsAsync();
  let status = current.status;
  if (status !== 'granted') {
    const requested = await requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== 'granted') {
    await remember(false);
    return 'denied';
  }
  await scheduleTuesdayAlert();
  await remember(true);
  return 'enabled';
}

export async function disableTuesdayAlert(): Promise<void> {
  try {
    await cancelScheduledNotificationAsync(TUESDAY_NOTIFICATION_ID);
  } catch {
    // Nothing was scheduled. The preference still turns off.
  }
  await remember(false);
}

/** Reschedule only when the user already opted in and the system still allows it. */
export async function restoreTuesdayAlert(): Promise<void> {
  const enabled = await readTuesdayAlertEnabled();
  if (!enabled) {
    return;
  }
  const permission = await getPermissionsAsync();
  if (permission.status !== 'granted') {
    return;
  }
  try {
    await scheduleTuesdayAlert();
  } catch {
    // A failed restore leaves the saved preference. The settings screen can try again.
  }
}
