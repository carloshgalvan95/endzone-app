import { QueryClient } from '@tanstack/react-query';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: WEEK_MS,
        staleTime: 5 * 60 * 1000,
        retry: 2,
        networkMode: 'offlineFirst',
      },
    },
  });
}
