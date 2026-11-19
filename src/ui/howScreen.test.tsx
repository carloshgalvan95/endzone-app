import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, waitFor } from '@testing-library/react-native';

import { LocaleProvider } from '@/i18n/LocaleProvider';
import { AppThemeProvider } from '@/theme/ThemeProvider';

import { HowScreen } from './HowScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: () => undefined, push: () => undefined }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/data/queries', () => ({
  useTrackRecord: () => ({
    data: {
      available: true,
      seasons: [
        {
          summary: {
            pick_hits: 11,
            pick_misses: 5,
            model_log_loss: 0.612,
            market_log_loss: 0.588,
            sample_label: 'small',
          },
        },
      ],
    },
  }),
}));

describe('how screen bindings', () => {
  test('renders a track record fixture other than 23 of 29 and 0.559 vs 0.506', async () => {
    await AsyncStorage.setItem('endzone-locale', 'en');
    const view = await render(
      <AppThemeProvider mode="light">
        <LocaleProvider>
          <HowScreen />
        </LocaleProvider>
      </AppThemeProvider>,
    );
    await waitFor(() => {
      expect(view.getByText('Correct calls 11 of 16')).toBeTruthy();
    });
    expect(view.getByText('0.612 vs 0.588')).toBeTruthy();
    expect(view.queryByText(/23 of 29/)).toBeNull();
    expect(view.queryByText(/0\.559/)).toBeNull();
    expect(view.queryByText(/0\.506/)).toBeNull();
    expect(view.queryByText(/0\.003/)).toBeNull();
  });
});
