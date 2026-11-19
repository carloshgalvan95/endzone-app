import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useState, type ReactNode } from 'react';

import { createAppQueryClient } from './queryClient';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const QUERY_CACHE_KEY = 'endzone-query-cache-v1';

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: QUERY_CACHE_KEY,
});

export async function readCacheSavedAt(): Promise<number | null> {
  const raw = await AsyncStorage.getItem(QUERY_CACHE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as { timestamp?: number };
    return typeof parsed.timestamp === 'number' ? parsed.timestamp : null;
  } catch {
    return null;
  }
}

export async function clearSavedData(): Promise<void> {
  await persister.removeClient();
  const keys = await AsyncStorage.getAllKeys();
  const drop = keys.filter(
    (key) => key.startsWith('endzone-logo-') || key === 'endzone-widget-slate',
  );
  if (drop.length > 0) {
    await AsyncStorage.multiRemove(drop);
  }
}

let onlineBound = false;

export function bindOnlineManager(): void {
  if (onlineBound) {
    return;
  }
  onlineBound = true;
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(state.isConnected !== false);
    });
  });
}

type AppQueryProviderProps = {
  children: ReactNode;
};

export function AppQueryProvider({ children }: AppQueryProviderProps) {
  const [queryClient] = useState(() => {
    bindOnlineManager();
    return createAppQueryClient();
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: WEEK_MS,
        buster: 'site-data-v1',
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.state.status === 'success',
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
