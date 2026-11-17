import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { WeekPicker } from '@/components/WeekPicker';
import { WeeklySlate } from '@/components/WeeklySlate';
import { useIsOnline } from '@/data/online';
import { useSlate } from '@/data/queries';
import { slateView } from '@/slate/viewState';
import { selectionFromParams, type SlateSelection } from '@/contract/urls';
import { useTheme } from '@/theme/ThemeProvider';

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function WeekScreen() {
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
          onRetry={() => router.replace('/week')}
        />
      </View>
    );
  }

  return <LoadedWeeks selection={selection} />;
}

function LoadedWeeks({ selection }: { selection: SlateSelection }) {
  const slateQuery = useSlate(selection);
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

  if (view.status === 'update') {
    return <WeeklySlate status="update" onRetry={() => slateQuery.refetch()} />;
  }
  if (view.status === 'error' || !slateQuery.data) {
    if (view.status === 'error') {
      return (
        <WeeklySlate status="error" message={view.message} onRetry={() => slateQuery.refetch()} />
      );
    }
    return <WeeklySlate status="loading" />;
  }

  const slate = slateQuery.data;
  return (
    <WeekPicker
      season={slate.season}
      weeks={slate.weeks_available}
      selectedWeek={slate.week}
      example={slate.sample || slate.season == null}
      onSelect={(week) => {
        if (slate.season == null) {
          return;
        }
        router.replace({
          pathname: '/',
          params: { season: String(slate.season), week: String(week) },
        });
      }}
    />
  );
}
