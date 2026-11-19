import IBMPlexMono_400Regular from '@expo-google-fonts/ibm-plex-mono/400Regular/IBMPlexMono_400Regular.ttf';
import IBMPlexMono_500Medium from '@expo-google-fonts/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf';
import IBMPlexMono_600SemiBold from '@expo-google-fonts/ibm-plex-mono/600SemiBold/IBMPlexMono_600SemiBold.ttf';
import Jost_400Regular from '@expo-google-fonts/jost/400Regular/Jost_400Regular.ttf';
import Jost_500Medium from '@expo-google-fonts/jost/500Medium/Jost_500Medium.ttf';
import Jost_700Bold from '@expo-google-fonts/jost/700Bold/Jost_700Bold.ttf';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppQueryProvider } from '@/data/QueryProvider';
import { restoreTuesdayAlert } from '@/features/notifications/tuesday';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { AppThemeProvider, useTheme } from '@/theme/ThemeProvider';

if (Platform.OS === 'android') {
  // Home screen widgets are Android-only and are not loaded in Expo Go or on web.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@/widget/register');
}

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function RootStack() {
  const theme = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.color.bg).catch(() => undefined);
  }, [theme.color.bg]);

  return (
    <>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.color.bg },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="record" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="how" />
        <Stack.Screen name="game/[gameId]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Jost_400Regular,
    Jost_500Medium,
    Jost_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loaded, error]);

  useEffect(() => {
    restoreTuesdayAlert().catch(() => undefined);
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <LocaleProvider>
            <AppQueryProvider>
              <RootStack />
            </AppQueryProvider>
          </LocaleProvider>
        </AppThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
