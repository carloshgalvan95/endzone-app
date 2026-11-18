import { useRouter, useLocalSearchParams } from 'expo-router';

import { WeeklySlate } from '@/components/WeeklySlate';
import { useIsOnline } from '@/data/online';
import { useSlate, useTeams } from '@/data/queries';
import { slateView } from '@/slate/viewState';
import { selectionFromParams, type SlateSelection } from '@/contract/urls';
import { useTheme } from '@/theme/ThemeProvider';
import { View } from 'react-native';

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function HomeScreen() {
  const params = useLocalSearchParams<{ season?: string | string[]; week?: string | string[] }>();
  const selection = selectionFromParams({
    season: first(params.season),
    week: first(params.week),
  });
  const router = useRouter();
  const theme = useTheme();

  if (selection === 'invalid') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.color.bg }}>
        <WeeklySlate
          status="error"
          message="That season and week are not a valid selection."
          onRetry={() => router.replace('/')}
        />
      </View>
    );
  }

  return <LoadedHome selection={selection} />;
}

function LoadedHome({ selection }: { selection: SlateSelection }) {
  const slateQuery = useSlate(selection);
  const teamsQuery = useTeams();
  const online = useIsOnline();
  const router = useRouter();
  const view = slateView({
    isPending: slateQuery.isPending,
    isError: slateQuery.isError,
    isRefetching: slateQuery.isRefetching,
    error: slateQuery.error,
    data: slateQuery.data,
    online,
  });

  const openWeeks = () => {
    const data = slateQuery.data;
    if (data && data.season != null && data.week != null) {
      router.push({
        pathname: '/week',
        params: { season: String(data.season), week: String(data.week) },
      });
      return;
    }
    router.push('/week');
  };

  if (view.status === 'loading') {
    return <WeeklySlate status="loading" />;
  }
  if (view.status === 'update') {
    return <WeeklySlate status="update" onRetry={() => slateQuery.refetch()} />;
  }
  if (view.status === 'error') {
    return (
      <WeeklySlate status="error" message={view.message} onRetry={() => slateQuery.refetch()} />
    );
  }
  if (view.status === 'empty') {
    if (!slateQuery.data) {
      return <WeeklySlate status="loading" />;
    }
    return (
      <WeeklySlate
        status="empty"
        slate={slateQuery.data}
        notice={view.notice}
        refreshing={slateQuery.isRefetching}
        onRefresh={() => slateQuery.refetch()}
        onOpenWeeks={openWeeks}
      />
    );
  }
  if (!slateQuery.data) {
    return <WeeklySlate status="loading" />;
  }
  return (
    <WeeklySlate
      status="ready"
      slate={slateQuery.data}
      teams={teamsQuery.data ?? null}
      notice={view.notice}
      refreshing={view.refreshing}
      onRefresh={() => {
        slateQuery.refetch().catch(() => undefined);
        teamsQuery.refetch().catch(() => undefined);
      }}
      onOpenWeeks={openWeeks}
      onOpenGame={(gameId) => {
        router.push({
          pathname: '/game/[gameId]',
          params:
            selection.kind === 'week'
              ? { gameId, season: String(selection.season), week: String(selection.week) }
              : { gameId },
        });
      }}
    />
  );
}
