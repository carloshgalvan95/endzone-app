import { fireEvent, render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { AppThemeProvider } from '@/theme/ThemeProvider';

import { WeekPicker } from './WeekPicker';

async function renderWithTheme(ui: ReactElement) {
  return render(<AppThemeProvider mode="dark">{ui}</AppThemeProvider>);
}

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
