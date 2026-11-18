import { applyAbiSplits } from './androidAbiSplits';

const SAMPLE = `android {
    defaultConfig {
        versionCode 2
    }
    buildTypes {
        release {
            minifyEnabled true
        }
    }
}
`;

describe('applyAbiSplits', () => {
  test('splits the release APK by arm ABI and keeps one universal file', () => {
    const result = applyAbiSplits(SAMPLE);
    expect(result).toContain('endzone-abi-splits');
    expect(result).toContain("include 'armeabi-v7a', 'arm64-v8a'");
    expect(result).toContain('universalApk true');
    expect(result).toContain("abiOffset = ['armeabi-v7a': 1, 'arm64-v8a': 2]");
    expect(result).toContain('enable endzoneReleaseBuild');
    expect(applyAbiSplits(result)).toBe(result);
  });
});
