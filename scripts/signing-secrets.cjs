const REQUIRED_ANDROID_SECRETS = [
  'ANDROID_KEYSTORE_BASE64',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
];

function missingAndroidSecrets(env) {
  return REQUIRED_ANDROID_SECRETS.filter((name) => {
    const value = env[name];
    return typeof value !== 'string' || value.trim() === '';
  });
}

function escapePropertiesValue(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function buildKeystoreProperties(fields) {
  return [
    `storeFile=${escapePropertiesValue(fields.storeFile)}`,
    `storePassword=${escapePropertiesValue(fields.storePassword)}`,
    `keyAlias=${escapePropertiesValue(fields.keyAlias)}`,
    `keyPassword=${escapePropertiesValue(fields.keyPassword)}`,
    '',
  ].join('\n');
}

function decodeKeystoreBase64(value) {
  const compact = value.replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(compact) || compact.length < 16) {
    return null;
  }
  const bytes = Buffer.from(compact, 'base64');
  if (bytes.length < 16) {
    return null;
  }
  return bytes;
}

module.exports = {
  REQUIRED_ANDROID_SECRETS,
  missingAndroidSecrets,
  escapePropertiesValue,
  buildKeystoreProperties,
  decodeKeystoreBase64,
};
