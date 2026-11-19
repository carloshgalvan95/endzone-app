import { useLocalSearchParams } from 'expo-router';

import { selectionFromParams, type SlateSelection } from '@/contract/urls';
import { WeekScreen } from '@/ui/WeekScreen';

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function HomeScreen() {
  const params = useLocalSearchParams<{ season?: string | string[]; week?: string | string[] }>();
  const selection = selectionFromParams({
    season: first(params.season),
    week: first(params.week),
  });
  const safe: SlateSelection = selection === 'invalid' ? { kind: 'latest' } : selection;
  return <WeekScreen selection={safe} />;
}
