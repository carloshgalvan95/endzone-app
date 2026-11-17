import { gateContractVersion, SUPPORTED_CONTRACT_MAJOR } from './version';

describe('gateContractVersion', () => {
  test('treats a missing contract_version as major 1', () => {
    expect(SUPPORTED_CONTRACT_MAJOR).toBe(1);
    expect(gateContractVersion({ sample: false })).toEqual({
      status: 'ok',
      assumed: true,
      version: null,
    });
  });

  test('accepts 1.x.y', () => {
    expect(gateContractVersion({ contract_version: '1.2.3' })).toEqual({
      status: 'ok',
      assumed: false,
      version: '1.2.3',
    });
  });

  test('asks for an update on a different major', () => {
    expect(gateContractVersion({ contract_version: '2.0.0' })).toEqual({
      status: 'update',
      version: '2.0.0',
    });
    expect(gateContractVersion({ contract_version: '2' })).toEqual({
      status: 'update',
      version: '2',
    });
  });

  test('rejects a broken version string that is still major 1', () => {
    expect(gateContractVersion({ contract_version: '1.0' }).status).toBe('invalid');
    expect(gateContractVersion({ contract_version: 1 }).status).toBe('invalid');
    expect(gateContractVersion(null).status).toBe('invalid');
  });
});
