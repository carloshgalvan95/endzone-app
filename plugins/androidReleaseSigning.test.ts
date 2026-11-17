import { applyReleaseSigning } from './androidReleaseSigning';

const SAMPLE = `android {
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug
            minifyEnabled true
        }
    }
}
`;

describe('applyReleaseSigning', () => {
  test('signs release from keystore.properties and leaves debug alone', () => {
    const result = applyReleaseSigning(SAMPLE);
    expect(result).toContain('endzone-release-signing');
    expect(result).toContain('endzoneKeystorePropertiesFile');
    expect(result).toContain('signingConfig signingConfigs.release');
    expect(result).toContain("storeFile file(endzoneKeystoreProperties['storeFile'])");
    expect(result.match(/signingConfig signingConfigs\.debug/g)).toHaveLength(1);
    const debugSigning = result.indexOf('signingConfig signingConfigs.debug');
    const releaseSigning = result.indexOf('signingConfig signingConfigs.release');
    expect(debugSigning).toBeGreaterThan(result.indexOf('buildTypes'));
    expect(releaseSigning).toBeGreaterThan(debugSigning);
    expect(applyReleaseSigning(result)).toBe(result);
  });
});
