import fs from 'node:fs';
import path from 'node:path';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, waitFor } from '@testing-library/react-native';

import { LocaleProvider } from '@/i18n/LocaleProvider';
import { howCalibration } from '@/theme/h2';
import { AppThemeProvider } from '@/theme/ThemeProvider';

import { HowScreen } from './HowScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: () => undefined, push: () => undefined }),
  useLocalSearchParams: () => ({}),
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
    expect(view.queryByText(/23 of 29/)).toBeNull();
    expect(view.queryByText(/0\.559/)).toBeNull();
    expect(view.queryByText(/0\.506/)).toBeNull();
    expect(view.queryByText(/0\.003/)).toBeNull();
    const source = fs.readFileSync(path.join(process.cwd(), 'src/ui/HowScreen.tsx'), 'utf8');
    expect(source).not.toMatch(/0\.559|0\.506|23 of 29|7,000|0,621|0\.621|0\.598/);
  });

  test('calibration points come from the bundled file, not a market pair', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'src/ui/HowScreen.tsx'), 'utf8');
    expect(source).not.toMatch(/0\.621|0\.598/);
    expect(howCalibration.pred[0]).toBe(0.277);
    expect(howCalibration.nHoldout).toBe(570);
    expect(howCalibration).not.toHaveProperty('holdoutModel');
    expect(howCalibration).not.toHaveProperty('holdoutMarket');
  });
});
