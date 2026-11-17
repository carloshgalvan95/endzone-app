const fs = require('node:fs');
const path = require('node:path');

const {
  parseSdkManagerList,
  resolveAndroidPackages,
  resolveFromList,
} = require('./android-sdk-packages.cjs');

const CATALOG = [
  '[versions]',
  'compileSdk = "37"',
  'buildTools = "37.0.0"',
  'ndkVersion = "27.1.12297006"',
  '',
].join('\n');

function listed(ids, separator = ';') {
  return ids.map((id) => id.replaceAll(';', separator)).join('\n');
}

describe('android sdk package resolution', () => {
  test('uses platforms;android-37.0 when the unversioned id is absent', () => {
    const list = listed([
      'platforms;android-36',
      'platforms;android-36-ext19',
      'platforms;android-36.1',
      'platforms;android-37.0',
      'platforms;android-37.1',
      'platforms;android-37.2',
      'platforms;android-37.2-beta3',
      'build-tools;37.0.0',
      'build-tools;37.0.0-rc2',
      'ndk;27.1.12297006',
      'cmake;3.30.5',
      'cmdline-tools;latest',
    ]);
    const parsed = parseSdkManagerList(list);
    const result = resolveAndroidPackages({
      compileSdk: '37',
      buildTools: '37.0.0',
      ndkVersion: '27.1.12297006',
      ids: parsed.ids,
      separator: parsed.separator,
    });
    expect(result.install).toEqual([
      'platforms;android-37.0',
      'build-tools;37.0.0',
      'ndk;27.1.12297006',
      'cmake;3.30.5',
    ]);
    expect(result.unresolved).toEqual([]);
  });

  test('keeps the slash ids that current sdkmanager --list prints', () => {
    const list = listed(['platforms;android-37.0', 'build-tools;37.0.0', 'ndk;27.1.12297006'], '/');
    const result = resolveFromList(CATALOG, list);
    expect(result.separator).toBe('/');
    expect(result.install).toEqual([
      'platforms/android-37.0',
      'build-tools/37.0.0',
      'ndk/27.1.12297006',
    ]);
  });

  test('prefers the legacy platform id, then an extension package', () => {
    const legacy = resolveAndroidPackages({
      compileSdk: '37',
      buildTools: '37.0.0',
      ndkVersion: '27.1.12297006',
      ids: ['platforms;android-37', 'build-tools;37.0.0', 'ndk;27.1.12297006'],
      separator: ';',
    });
    expect(legacy.install[0]).toBe('platforms;android-37');

    const extension = resolveAndroidPackages({
      compileSdk: '35',
      buildTools: '35.0.0',
      ndkVersion: '27.1.12297006',
      ids: ['platforms;android-35-ext14', 'platforms;android-35-ext15', 'build-tools;35.0.0'],
      separator: ';',
    });
    expect(extension.install[0]).toBe('platforms;android-35-ext15');
    expect(extension.unresolved).toEqual(['ndk:27.1.12297006']);
  });

  test('does not install a preview platform or a different NDK', () => {
    const result = resolveAndroidPackages({
      compileSdk: '37',
      buildTools: '37.0.0',
      ndkVersion: '27.1.12297006',
      ids: ['platforms;android-37.2-beta1', 'build-tools;37.0.0-rc1', 'ndk;27.0.12077973'],
      separator: ';',
    });
    expect(result.install).toEqual([]);
    expect(result.unresolved).toEqual(['platform:37', 'build-tools:37.0.0', 'ndk:27.1.12297006']);
  });

  test('reads a real sdkmanager --list excerpt', () => {
    const excerpt = fs.readFileSync(
      path.join(__dirname, 'fixtures', 'sdkmanager-list-excerpt.txt'),
      'utf8',
    );
    const result = resolveFromList(CATALOG, excerpt);
    expect(result.install).toEqual([
      'platforms/android-37.0',
      'build-tools/37.0.0',
      'ndk/27.1.12297006',
      'cmake/3.30.5',
    ]);
  });
});
