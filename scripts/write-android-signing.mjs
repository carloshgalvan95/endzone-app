import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  missingAndroidSecrets,
  buildKeystoreProperties,
  decodeKeystoreBase64,
} = require('./signing-secrets.cjs');

const checkOnly = process.argv.includes('--check');
const missing = missingAndroidSecrets(process.env);
if (missing.length > 0) {
  console.error(
    `Android release signing needs these GitHub Actions secrets: ${missing.join(', ')}. They are not set. See docs/release.md. This workflow does not generate a keystore.`,
  );
  process.exit(1);
}

const encoded = process.env.ANDROID_KEYSTORE_BASE64 ?? '';
const keystore = decodeKeystoreBase64(encoded);
if (!keystore) {
  console.error('ANDROID_KEYSTORE_BASE64 is not valid base64. The keystore was not written.');
  process.exit(1);
}

if (checkOnly) {
  console.log('Android signing secrets are present. No keystore file was written.');
  process.exit(0);
}

const appDir = path.join(process.cwd(), 'android', 'app');
if (!fs.existsSync(appDir)) {
  console.error('android/app is missing. Run expo prebuild before writing the keystore.');
  process.exit(1);
}

fs.writeFileSync(path.join(appDir, 'release.keystore'), keystore, { mode: 0o600 });
fs.writeFileSync(
  path.join(process.cwd(), 'android', 'keystore.properties'),
  buildKeystoreProperties({
    storeFile: 'release.keystore',
    storePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
    keyAlias: process.env.ANDROID_KEY_ALIAS,
    keyPassword: process.env.ANDROID_KEY_PASSWORD,
  }),
  { mode: 0o600 },
);
console.log('Wrote the release keystore and keystore.properties. Passwords were not printed.');
