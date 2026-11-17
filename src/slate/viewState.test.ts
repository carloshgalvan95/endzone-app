import { ContractUpdateRequiredError, ContractValidationError } from '@/contract/errors';
import type { Slate } from '@/contract/types';

import finalSlateJson from '../contract/fixtures/slate-final.json';
import { slateView } from './viewState';

const slate = finalSlateJson as Slate;

const base = {
  isPending: false,
  isError: false,
  isRefetching: false,
  error: null,
  data: undefined as Slate | undefined,
  online: true,
};

describe('slateView', () => {
  test('prefers the update state over cached data', () => {
    expect(
      slateView({
        ...base,
        isError: true,
        error: new ContractUpdateRequiredError('2.0.0'),
        data: slate,
      }).status,
    ).toBe('update');
  });

  test('shows loading, error, empty, and a stale saved slate', () => {
    expect(slateView({ ...base, isPending: true }).status).toBe('loading');
    const error = slateView({
      ...base,
      isError: true,
      error: new ContractValidationError('nope'),
    });
    expect(error).toEqual({
      status: 'error',
      message: 'This file does not match the data contract this app knows.',
    });
    const empty = { ...slate, games: [] };
    expect(slateView({ ...base, data: empty, online: false })).toEqual({
      status: 'empty',
      notice: 'Offline. Showing the last saved slate.',
    });
    expect(slateView({ ...base, data: slate, isError: true, online: true })).toMatchObject({
      status: 'ready',
      notice: 'Could not refresh. Showing the last saved slate.',
    });
  });
});
