import { fireEvent, render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import type { Slate, TeamsDocument } from '@/contract/types';
import { AppThemeProvider } from '@/theme/ThemeProvider';

import finalSlateJson from '../contract/fixtures/slate-final.json';
import sampleSlateJson from '../contract/fixtures/slate-sample.json';
import teamsJson from '../contract/fixtures/teams.json';
import { AboutCard } from './AboutCard';
import { WeekPicker } from './WeekPicker';
import { WeeklySlate } from './WeeklySlate';

const finalSlate = finalSlateJson as Slate;
const sampleSlate = sampleSlateJson as Slate;
const teams = teamsJson as TeamsDocument;

async function renderWithTheme(ui: ReactElement) {
  return render(<AppThemeProvider mode="dark">{ui}</AppThemeProvider>);
}

describe('weekly slate screen', () => {
  test('shows loading, error, empty, and the update state', async () => {
    expect(
      (await renderWithTheme(<WeeklySlate status="loading" />)).getByTestId('slate-loading'),
    ).toBeTruthy();
    expect(
      (
        await renderWithTheme(
          <WeeklySlate
            status="error"
            message="The slate could not be loaded."
            onRetry={() => undefined}
          />,
        )
      ).getByText('The slate could not be loaded.'),
    ).toBeTruthy();
    expect(
      (await renderWithTheme(<WeeklySlate status="update" onRetry={() => undefined} />)).getByText(
        'Update the app',
      ),
    ).toBeTruthy();
    expect(
      (
        await renderWithTheme(
          <WeeklySlate
            status="empty"
            slate={{ ...finalSlate, games: [] }}
            notice={null}
            refreshing={false}
            onRefresh={() => undefined}
            onOpenWeeks={() => undefined}
          />,
        )
      ).getByText('No games'),
    ).toBeTruthy();
  });

  test('renders final scores, the market gap, and the example banner', async () => {
    const ready = await renderWithTheme(
      <WeeklySlate
        status="ready"
        slate={finalSlate}
        teams={teams}
        notice="Offline. Showing the last saved slate."
        refreshing={false}
        onRefresh={() => undefined}
        onOpenWeeks={() => undefined}
      />,
    );
    expect(ready.getByText('2026 week 10')).toBeTruthy();
    expect(ready.getByText('2@prod')).toBeTruthy();
    expect(ready.getByText('Commanders')).toBeTruthy();
    expect(ready.getByText('Giants')).toBeTruthy();
    expect(ready.getByText('71.9%')).toBeTruthy();
    expect(ready.getByText('54.3%')).toBeTruthy();
    expect(ready.getByText('+17.6 pp')).toBeTruthy();
    expect(ready.getByText('Disagrees')).toBeTruthy();
    expect(ready.getByText('Final. Commanders won')).toBeTruthy();
    expect(ready.getByTestId('offline-banner')).toBeTruthy();
    expect(ready.getByText('Not betting advice.')).toBeTruthy();

    const example = await renderWithTheme(
      <WeeklySlate
        status="ready"
        slate={sampleSlate}
        teams={teams}
        notice={null}
        refreshing={false}
        onRefresh={() => undefined}
        onOpenWeeks={() => undefined}
      />,
    );
    expect(example.getByTestId('example-banner')).toHaveTextContent(
      'Example slate. These are not real predictions.',
    );
    expect(example.getByText(/pre-registered/)).toBeTruthy();
  });
});

describe('week picker', () => {
  test('lists weeks_available with the open week marked', async () => {
    const onSelect = jest.fn();
    const view = await renderWithTheme(
      <WeekPicker
        season={2026}
        weeks={[9, 10]}
        selectedWeek={10}
        example={false}
        onSelect={onSelect}
      />,
    );
    expect(view.getByText('Week 10')).toBeTruthy();
    expect(view.getByText('Week 9')).toBeTruthy();
    expect(view.getByText('Showing')).toBeTruthy();
    await fireEvent.press(view.getByTestId('week-9'));
    expect(onSelect).toHaveBeenCalledWith(9);
  });

  test('explains example data', async () => {
    const view = await renderWithTheme(
      <WeekPicker
        season={null}
        weeks={[]}
        selectedWeek={null}
        example
        onSelect={() => undefined}
      />,
    );
    expect(view.getByText(/no season to browse/)).toBeTruthy();
  });
});

describe('about screen', () => {
  test('states the market log loss and that this is not betting advice', async () => {
    const view = await renderWithTheme(
      <AboutCard
        modelVersion="2@prod"
        modelName="workspace.nfl_dev.endzone_winprob"
        featureSet="h2_full"
      />,
    );
    expect(view.getByText(/lower log loss/)).toBeTruthy();
    expect(view.getByText(/not betting advice/)).toBeTruthy();
    expect(view.getByText('2@prod')).toBeTruthy();
    expect(view.getByRole('link', { name: 'Repository' })).toBeTruthy();
    expect(view.getByRole('link', { name: 'Site' })).toBeTruthy();
    expect(view.getByRole('link', { name: 'Model card' })).toBeTruthy();
  });
});
