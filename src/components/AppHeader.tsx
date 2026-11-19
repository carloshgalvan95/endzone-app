import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { brandImages, wordmarkAspect } from '@/theme/brand';
import { useTheme } from '@/theme/ThemeProvider';

import { AppText } from './AppText';

const WORDMARK_HEIGHT = 28;

export function AppHeader() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const onAbout = pathname === '/about';
  const onRecord = pathname === '/record';
  const onSettings = pathname === '/settings';
  const wordmark = theme.mode === 'light' ? brandImages.wordmarkLight : brandImages.wordmarkDark;

  return (
    <View
      style={[
        styles.bar,
        {
          paddingTop: insets.top + 8,
          backgroundColor: theme.color.bg,
          borderBottomColor: theme.color.border,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Home"
        onPress={() => router.push('/')}
      >
        <Image
          source={wordmark}
          style={{ height: WORDMARK_HEIGHT, width: WORDMARK_HEIGHT * wordmarkAspect }}
          contentFit="contain"
          accessibilityLabel="endzone-mlops"
        />
      </Pressable>
      <View style={styles.nav}>
        {pathname !== '/' ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
          >
            <AppText variant="button">Back</AppText>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: onRecord }}
          onPress={() => router.push('/record')}
        >
          <AppText
            variant="button"
            style={{ color: onRecord ? theme.color.text : theme.color.textMuted }}
          >
            Record
          </AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: onSettings }}
          onPress={() => router.push('/settings')}
        >
          <AppText
            variant="button"
            style={{ color: onSettings ? theme.color.text : theme.color.textMuted }}
          >
            Alerts
          </AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: onAbout }}
          onPress={() => router.push('/about')}
        >
          <AppText
            variant="button"
            style={{ color: onAbout ? theme.color.text : theme.color.textMuted }}
          >
            About
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
