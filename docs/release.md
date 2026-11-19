# Android release

The app version is semantic. `0.3.0` is the current release: the hybrid redesign, English and Spanish, the home screen widget, and runtime team logos. A release tag is `v` plus the version in `package.json` and `app.json`, for example `v0.3.0`.

`.github/workflows/release-android.yml` runs when a tag matching `v*` is pushed. It builds a signed release APK with `npx expo prebuild --platform android` and Gradle `assembleRelease`. It does not use an EAS account. It attaches the APK to the GitHub Release for that tag.

The workflow fails before Gradle if any signing secret is missing, and it says which names are missing. It does not generate a keystore.

## Create the keystore

I create the keystore on my own machine. I keep the file outside this repo.

```bash
keytool -genkeypair -v \
  -keystore endzone-release.keystore \
  -alias endzone \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

keytool asks for the store password, the key password, and a distinguished name. I pick both passwords and I store them in a password manager. I do not put them in the repo, in a shell history I later commit, or in a workflow log.

## GitHub Actions secrets

Repository secrets, Settings, Secrets and variables, Actions:

| Secret                      | Value                                 |
| --------------------------- | ------------------------------------- |
| `ANDROID_KEYSTORE_BASE64`   | Base64 of the keystore file, one line |
| `ANDROID_KEYSTORE_PASSWORD` | Store password                        |
| `ANDROID_KEY_ALIAS`         | Alias, for example `endzone`          |
| `ANDROID_KEY_PASSWORD`      | Key password                          |

Encode the file without a trailing description. On Linux:

```bash
base64 -w 0 endzone-release.keystore
```

On macOS:

```bash
base64 -i endzone-release.keystore | tr -d '\n'
```

I paste that output into `ANDROID_KEYSTORE_BASE64`. I do not commit the keystore, the base64 text, or the passwords.

## Ship a version

1. Set `version` in `package.json` and `app.json` to the same `X.Y.Z`.
2. Increase `android.versionCode` by 1. A repeated versionCode will not install over the previous APK.
3. Commit those edits.
4. Tag that commit and push the tag.

```bash
git tag v0.3.0
git push origin v0.3.0
```

The workflow checks that the tag, `package.json`, and `app.json` name the same version.

The release build splits the APK by CPU:

| File                            | Who should install it                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `endzone-X.Y.Z-arm64-v8a.apk`   | Most phones from the last several years. This is the small download.                             |
| `endzone-X.Y.Z-armeabi-v7a.apk` | Older 32-bit phones.                                                                             |
| `endzone-X.Y.Z-universal.apk`   | Use this only if you do not know the CPU. It is larger because it contains both of those builds. |

`android.versionCode` in `app.json` is the universal APK version. The arm64 file uses `versionCode * 1000 + 2`, and the 32-bit file uses `versionCode * 1000 + 1`, so either split installs over an older universal APK. Do not install the universal file over a phone that already has a split APK. That would be a lower version.

The job uses JDK 17. Android Gradle plugin 9.2, which React Native 0.88 brings in, requires JDK 17. It does not require JDK 21.

SDK packages come from `node_modules/react-native/gradle/libs.versions.toml`. The catalog's `compileSdk = "37"` is not the package id `platforms;android-37`. Current `sdkmanager --list` output names that platform `platforms/android-37.0` (older tools use a semicolon, and some builds add an `-ext` suffix). `scripts/install-android-sdk.sh` updates cmdline-tools when the index does not contain a matching platform, then installs the platform, build-tools, and NDK ids it resolved. It also installs CMake 3.30.5 when that package is listed, because the native build needs CMake and React Native 0.88 names that version. If a package still cannot be resolved, or sdkmanager cannot install it, the step continues. Licenses are accepted so Gradle can download the missing pieces. `assembleRelease` still fails the job when the build fails. The keystore is written only after prebuild, and only from the secrets.

## Re-run v0.1.0

The first `v0.1.0` run failed while choosing SDK packages, before GitHub created a release. After this fix is on `main`, delete that tag and push it again at the fixed commit:

```bash
git push origin :refs/tags/v0.1.0
git tag -d v0.1.0
git checkout main
git pull origin main
git tag v0.1.0
git push origin v0.1.0
```

## What I do not do

- I do not run keytool in CI, and I do not commit a generated debug key as the release key.
- I do not commit `*.keystore`, `*.jks`, or `keystore.properties`. Those paths are gitignored. `android/` is generated by prebuild and is gitignored too.
- I do not print the passwords or the keystore bytes. `scripts/write-android-signing.mjs` writes the files and logs only that it wrote them.
