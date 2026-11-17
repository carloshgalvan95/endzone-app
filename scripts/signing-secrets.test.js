const {
  missingAndroidSecrets,
  escapePropertiesValue,
  buildKeystoreProperties,
  decodeKeystoreBase64,
} = require('./signing-secrets.cjs');

describe('android signing secrets', () => {
  test('lists every missing name and treats a blank value as missing', () => {
    expect(missingAndroidSecrets({})).toEqual([
      'ANDROID_KEYSTORE_BASE64',
      'ANDROID_KEYSTORE_PASSWORD',
      'ANDROID_KEY_ALIAS',
      'ANDROID_KEY_PASSWORD',
    ]);
    expect(
      missingAndroidSecrets({
        ANDROID_KEYSTORE_BASE64: 'abcd',
        ANDROID_KEYSTORE_PASSWORD: '   ',
        ANDROID_KEY_ALIAS: 'endzone',
        ANDROID_KEY_PASSWORD: 'secret',
      }),
    ).toEqual(['ANDROID_KEYSTORE_PASSWORD']);
  });

  test('escapes properties values without printing them', () => {
    expect(escapePropertiesValue('a\\b\n')).toBe('a\\\\b\\n');
    const properties = buildKeystoreProperties({
      storeFile: 'release.keystore',
      storePassword: 'store-secret',
      keyAlias: 'endzone',
      keyPassword: 'key-secret',
    });
    expect(properties).toContain('storeFile=release.keystore');
    expect(properties).toContain('keyAlias=endzone');
    expect(properties).not.toContain('ANDROID_');
  });

  test('rejects a short or non-base64 keystore payload', () => {
    expect(decodeKeystoreBase64('not base64!!!')).toBeNull();
    expect(decodeKeystoreBase64('YQ==')).toBeNull();
    const payload = Buffer.from('this is a long enough stand-in').toString('base64');
    const decoded = decodeKeystoreBase64(payload);
    expect(decoded).not.toBeNull();
    expect(decoded.length).toBeGreaterThan(16);
  });
});
