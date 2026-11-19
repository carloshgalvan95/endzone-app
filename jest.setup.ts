/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('expo-image', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Image: (props: Record<string, unknown>) => React.createElement(View, props),
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-notifications', () => ({
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { WEEKLY: 'weekly' },
  getPermissionsAsync: jest.fn(async () => ({ status: 'undetermined' })),
  requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(async () => 'endzone-tuesday-week'),
  cancelScheduledNotificationAsync: jest.fn(async () => undefined),
  setNotificationChannelAsync: jest.fn(async () => undefined),
}));

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(() => jest.fn()),
    fetch: jest.fn(async () => ({ isConnected: true, isInternetReachable: true })),
  },
}));
