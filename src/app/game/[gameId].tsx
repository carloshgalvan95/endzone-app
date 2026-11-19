import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { selectionFromParams } from '@/contract/urls';
import { useSlate, useTeams } from '@/data/queries';
import { translate } from '@/i18n';
import { darkPalette, font } from '@/theme/h2';
import { DetailScreen } from '@/ui/DetailScreen';

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function GameRoute() {
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
  const slateQuery = useSlate(selection === 'invalid' ? { kind: 'latest' } : selection);
  const teamsQuery = useTeams();
  const game = slateQuery.data?.games.find((item) => item.game_id === gameId);

  if (!game) {
    return (
      <View style={{ flex: 1, backgroundColor: darkPalette.bg, padding: 16 }}>
        <Text style={{ color: darkPalette.text, fontFamily: font.sans, fontSize: 16 }}>
          {slateQuery.isPending ? translate('en', 'tb.loading') : translate('en', 'week.empty')}
        </Text>
      </View>
    );
  }
  return <DetailScreen game={game} teams={teamsQuery.data ?? null} />;
}
