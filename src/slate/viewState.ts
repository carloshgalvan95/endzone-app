import { ContractUpdateRequiredError, ContractValidationError } from '@/contract/errors';
import type { Slate } from '@/contract/types';

export type SlateView =
  | { status: 'loading' }
  | { status: 'update' }
  | { status: 'error'; message: string }
  | { status: 'empty'; notice: string | null }
  | { status: 'ready'; notice: string | null; refreshing: boolean };

export function refreshNotice(online: boolean, isError: boolean): string | null {
  if (!online) {
    return 'Offline. Showing the last saved slate.';
  }
  if (isError) {
    return 'Could not refresh. Showing the last saved slate.';
  }
  return null;
}

export function slateErrorMessage(error: unknown, online: boolean): string {
  if (!online) {
    return 'You are offline and there is no saved slate on this device yet.';
  }
  if (error instanceof ContractValidationError) {
    return 'This file does not match the data contract this app knows.';
  }
  return 'The slate could not be loaded. Check the connection and try again.';
}

export function slateView(input: {
  isPending: boolean;
  isError: boolean;
  isRefetching: boolean;
  error: unknown;
  data: Slate | undefined;
  online: boolean;
}): SlateView {
  if (input.error instanceof ContractUpdateRequiredError) {
    return { status: 'update' };
  }
  if (!input.data) {
    if (input.isPending) {
      return { status: 'loading' };
    }
    return { status: 'error', message: slateErrorMessage(input.error, input.online) };
  }
  const notice = refreshNotice(input.online, input.isError);
  if (input.data.games.length === 0) {
    return { status: 'empty', notice };
  }
  return {
    status: 'ready',
    notice,
    refreshing: input.isRefetching,
  };
}
