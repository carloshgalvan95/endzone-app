import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useState, type ReactNode } from 'react';

import { createAppQueryClient } from './queryClient';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'endzone-query-cache-v1',
});

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
