import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { teamLogos } from '@/config/features';
import { useI18n } from '@/i18n/LocaleProvider';
import { monogramLetters, resolveLogoStep } from '@/logos/resolve';
import { darkPalette, font } from '@/theme/h2';

type TeamSlotProps = {
  name: string;
  abbr: string;
  color: string | null;
  logoUrl: string | null;
  size: number;
};

type CacheEntry = { url: string; savedAt: number };

function cacheKey(abbr: string): string {
  return `endzone-logo-${abbr}`;
}

export function TeamSlot({ name, abbr, color, logoUrl, size }: TeamSlotProps) {
  const { t } = useI18n();
  const [networkFailed, setNetworkFailed] = useState(false);
  const [cached, setCached] = useState<CacheEntry | null>(null);
  const [now] = useState(() => Date.now());
  const letters = monogramLetters(abbr, name);
  const step = resolveLogoStep({
    enabled: teamLogos.enabled && Boolean(logoUrl),
    cacheSavedAt: cached?.savedAt ?? null,
    now,
    networkFailed,
  });
  const showImage = step !== 'monogram' && Boolean(logoUrl);
  const label = showImage ? t('logo.cd', { team: name }) : t('logo.cd.mono', { team: name });

  useEffect(() => {
    if (!teamLogos.enabled || !abbr) {
      return;
    }
    let active = true;
    AsyncStorage.getItem(cacheKey(abbr))
      .then((raw) => {
        if (!active || !raw) {
          return;
        }
        const parsed = JSON.parse(raw) as CacheEntry;
        if (parsed.url && typeof parsed.savedAt === 'number') {
          setCached(parsed);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [abbr]);

  return (
    <View
      accessibilityLabel={label}
      style={[
        styles.slot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: darkPalette.surface,
          borderColor: color ?? darkPalette.border,
          borderWidth: 1.5,
        },
      ]}
    >
      {showImage && logoUrl ? (
        <Image
          source={{ uri: logoUrl }}
          style={{ width: size - 4, height: size - 4 }}
          contentFit="contain"
          onLoad={() => {
            const entry = { url: logoUrl, savedAt: Date.now() };
            setCached(entry);
            AsyncStorage.setItem(cacheKey(abbr), JSON.stringify(entry)).catch(() => undefined);
          }}
          onError={() => setNetworkFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text
          maxFontSizeMultiplier={1}
          style={{
            color: darkPalette.text,
            fontFamily: font.sansBold,
            fontSize: size >= 32 ? 11 : 8,
          }}
        >
          {letters}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
