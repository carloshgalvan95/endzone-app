import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import type { ReactElement } from 'react';

import type { TrackRecordDocument } from '@/contract/types';
import { presentTrackRecord } from '@/features/track-record/present';
import { AppThemeProvider } from '@/theme/ThemeProvider';

import recordJson from '../contract/fixtures/track-record.json';
import { SettingsCard } from './SettingsCard';
import { TrackRecordView } from './TrackRecord';

const record = recordJson as TrackRecordDocument;

async function renderWithTheme(ui: ReactElement) {
  return render(<AppThemeProvider mode="dark">{ui}</AppThemeProvider>);
}

describe('sprint 2 screens', () => {
  test('shows season and week rows with the market log loss', async () => {
    const view = await renderWithTheme(<TrackRecordView model={presentTrackRecord(record)} />);
    expect(view.getAllByText(/The market has the lower log loss/).length).toBeGreaterThan(0);
    expect(view.getAllByText('Correct picks 12 of 14').length).toBeGreaterThan(0);
    expect(view.getByText('2026 week 10')).toBeTruthy();
    expect(view.getByTestId('record-caveat')).toBeTruthy();
    expect(view.getByText(/not a recommendation/i)).toBeTruthy();
  });

  test('keeps the Tuesday alert off until the switch is turned on', async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    const view = await renderWithTheme(<SettingsCard />);
    const toggle = await waitFor(() => view.getByTestId('tuesday-alert-switch'));
    expect(toggle.props.value).toBe(false);
    await fireEvent(toggle, 'valueChange', true);
    await waitFor(() => {
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
    });
  });
});
