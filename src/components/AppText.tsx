import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { AppTheme } from '@/theme/tokens';

type Role = 'body' | 'title' | 'kicker' | 'mono' | 'muted' | 'button';

type AppTextProps = TextProps & {
  variant?: Role;
  style?: StyleProp<TextStyle>;
};

function roleStyle(theme: AppTheme, role: Role): TextStyle {
  switch (role) {
    case 'title':
      return {
        fontFamily: theme.font.sansBold,
        fontSize: theme.text['3xl'],
        lineHeight: 36,
        color: theme.color.text,
        letterSpacing: -0.5,
      };
    case 'kicker':
      return {
        fontFamily: theme.font.monoMedium,
        fontSize: theme.text.xs,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        color: theme.color.textMuted,
      };
    case 'mono':
      return {
        fontFamily: theme.font.monoMedium,
        fontSize: theme.text.base,
        color: theme.color.text,
      };
    case 'muted':
      return {
        fontFamily: theme.font.sans,
        fontSize: theme.text.sm,
        lineHeight: 20,
        color: theme.color.textMuted,
      };
    case 'button':
      return {
        fontFamily: theme.font.sansMedium,
        fontSize: theme.text.sm,
        color: theme.color.text,
      };
    case 'body':
    default:
      return {
        fontFamily: theme.font.sans,
        fontSize: theme.text.base,
        lineHeight: 24,
        color: theme.color.text,
      };
  }
}

export function AppText({ variant = 'body', style, ...rest }: AppTextProps) {
  const theme = useTheme();
  return <Text style={[roleStyle(theme, variant), style]} {...rest} />;
}
