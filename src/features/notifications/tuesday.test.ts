import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import {
  disableTuesdayAlert,
  enableTuesdayAlert,
  readTuesdayAlertEnabled,
  restoreTuesdayAlert,
  TUESDAY_ALERT_BODY,
  TUESDAY_NOTIFICATION_ID,
  TUESDAY_WEEKDAY,
  tuesdayTrigger,
} from './tuesday';

describe('Tuesday alert', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test('is off until the user opts in', async () => {
    expect(await readTuesdayAlertEnabled()).toBe(false);
    await restoreTuesdayAlert();
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  test('schedules a local Tuesday notification and does not ask again after a grant', async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    expect(tuesdayTrigger().weekday).toBe(TUESDAY_WEEKDAY);
    expect(await enableTuesdayAlert()).toBe('enabled');
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: TUESDAY_NOTIFICATION_ID,
        content: expect.objectContaining({ body: TUESDAY_ALERT_BODY }),
        trigger: expect.objectContaining({ weekday: 3, hour: 10, minute: 0 }),
      }),
    );
    expect(await readTuesdayAlertEnabled()).toBe(true);
    expect(TUESDAY_ALERT_BODY.toLowerCase()).not.toContain('bet');
  });

  test('stays off when permission is denied', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
    expect(await enableTuesdayAlert()).toBe('denied');
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    expect(await readTuesdayAlertEnabled()).toBe(false);
  });

  test('cancels the notification when turned off', async () => {
    await AsyncStorage.setItem('endzone-tuesday-alert', '1');
    await disableTuesdayAlert();
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      TUESDAY_NOTIFICATION_ID,
    );
    expect(await readTuesdayAlertEnabled()).toBe(false);
  });
});
