import { useQuery } from '@tanstack/react-query';

import type { SlateSelection } from '@/contract/urls';

import { fetchSlate, fetchTeams, fetchTrackRecord } from './client';

export function slateQueryKey(
  selection: SlateSelection,
): readonly [string, string | number, number?] {
  if (selection.kind === 'latest') {
    return ['slate', 'latest'];
  }
  return ['slate', selection.season, selection.week];
}

export function useSlate(selection: SlateSelection) {
  return useQuery({
    queryKey: slateQueryKey(selection),
    queryFn: () => fetchSlate(selection),
  });
}

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useTrackRecord() {
  return useQuery({
    queryKey: ['track-record'],
    queryFn: fetchTrackRecord,
    staleTime: 5 * 60 * 1000,
  });
}
