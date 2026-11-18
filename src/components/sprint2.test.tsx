import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import type { ReactElement } from 'react';

import type { Slate, TeamsDocument, TrackRecordDocument } from '@/contract/types';
import { presentGameDetail } from '@/features/game-detail/present';
import { presentTrackRecord } from '@/features/track-record/present';
import { AppThemeProvider } from '@/theme/ThemeProvider';

import finalSlateJson from '../contract/fixtures/slate-final.json';
import recordJson from '../contract/fixtures/track-record.json';
import teamsJson from '../contract/fixtures/teams.json';
import { GameDetailView } from './GameDetail';
import { SettingsCard } from './SettingsCard';
import { TrackRecordView } from './TrackRecord';
import { WeeklySlate } from './WeeklySlate';

const finalSlate = finalSlateJson as Slate;
const teams = teamsJson as TeamsDocument;
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

  test('shows a game detail from the slate', async () => {
    const game = finalSlate.games[0];
    if (!game) {
      throw new Error('missing game');
    }
    const view = await renderWithTheme(
      <GameDetailView model={presentGameDetail(game, teams, 'America/Chicago')} />,
    );
    expect(view.getByText('Commanders at Giants')).toBeTruthy();
    expect(view.getByText('71.9%')).toBeTruthy();
    expect(view.getByText('54.3%')).toBeTruthy();
    expect(view.getByText(/Away 24, home 21/)).toBeTruthy();
    expect(view.getByText(/7:15/)).toBeTruthy();
  });

  test('opens a game from the slate when a card is tapped', async () => {
    const onOpenGame = jest.fn();
    const view = await renderWithTheme(
      <WeeklySlate
        status="ready"
        slate={finalSlate}
        teams={teams}
        notice={null}
        refreshing={false}
        onRefresh={() => undefined}
        onOpenWeeks={() => undefined}
        onOpenGame={onOpenGame}
      />,
    );
    await fireEvent.press(view.getByTestId('game-2026_10_WAS_NYG'));
    expect(onOpenGame).toHaveBeenCalledWith('2026_10_WAS_NYG');
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
