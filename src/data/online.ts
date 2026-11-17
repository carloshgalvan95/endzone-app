import { onlineManager } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

function subscribe(onStoreChange: () => void): () => void {
  return onlineManager.subscribe(onStoreChange);
}

function getOnline(): boolean {
  return onlineManager.isOnline();
}

export function useIsOnline(): boolean {
  return useSyncExternalStore(subscribe, getOnline, getOnline);
}
