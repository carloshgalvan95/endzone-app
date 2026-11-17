import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import { AppText } from './AppText';

type BlockProps = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  testID: string;
};

function StateBlock({ title, body, actionLabel, onAction, testID }: BlockProps) {
  const theme = useTheme();
  return (
    <View style={styles.block} testID={testID}>
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="muted">{body}</AppText>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={[
            styles.button,
            { borderColor: theme.color.border, backgroundColor: theme.color.surfaceRaised },
          ]}
        >
          <AppText variant="button">{actionLabel}</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

export function LoadingState() {
  return (
    <StateBlock testID="slate-loading" title="Loading the week" body="Fetching the public slate." />
  );
}

export function EmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <StateBlock
      testID="slate-empty"
      title="No games"
      body="This slate does not list any games."
      actionLabel="Refresh"
      onAction={onRetry}
    />
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <StateBlock
      testID="slate-error"
      title="Slate unavailable"
      body={message}
      actionLabel="Try again"
      onAction={onRetry}
    />
  );
}

export function UpdateRequiredState({ onRetry }: { onRetry: () => void }) {
  return (
    <StateBlock
      testID="slate-update"
      title="Update the app"
      body="This data uses a newer contract than this app. Update the app to keep reading the weekly slate."
      actionLabel="Check again"
      onAction={onRetry}
    />
  );
}

export function NoticeBanner({ text, testID }: { text: string; testID: string }) {
  const theme = useTheme();
  return (
    <View
      testID={testID}
      style={[
        styles.banner,
        {
          backgroundColor: theme.color.bannerBg,
          borderColor: theme.color.border,
          borderLeftColor: theme.color.bannerBorder,
        },
      ]}
    >
      <AppText variant="body">{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 12,
  },
  title: {
    fontSize: 28,
  },
  button: {
    alignSelf: 'flex-start',
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
  },
  banner: {
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
