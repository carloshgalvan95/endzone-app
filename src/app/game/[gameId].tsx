import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { GameDetailView } from '@/components/GameDetail';
import { ErrorState, LoadingState } from '@/components/ScreenState';
import { useSlate, useTeams } from '@/data/queries';
import { presentGameDetail } from '@/features/game-detail/present';
import { selectionFromParams } from '@/contract/urls';
import { useTheme } from '@/theme/ThemeProvider';

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function GameDetailScreen() {
  const params = useLocalSearchParams<{
    gameId?: string | string[];
    season?: string | string[];
    week?: string | string[];
  }>();
  const gameId = first(params.gameId) ?? '';
  const selection = selectionFromParams({
    season: first(params.season),
    week: first(params.week),
  });
  const theme = useTheme();
  const shell = { flex: 1, backgroundColor: theme.color.bg } as const;
  const slateQuery = useSlate(selection === 'invalid' ? { kind: 'latest' } : selection);
  const teamsQuery = useTeams();

  if (slateQuery.isPending && !slateQuery.data) {
    return (
      <View style={shell}>
        <LoadingState />
      </View>
    );
  }
  const game = slateQuery.data?.games.find((item) => item.game_id === gameId);
  if (!game) {
    return (
      <View style={shell}>
        <ErrorState
          message="This game is not on the open slate."
          onRetry={() => slateQuery.refetch()}
        />
      </View>
    );
  }
  return <GameDetailView model={presentGameDetail(game, teamsQuery.data ?? null)} />;
}
