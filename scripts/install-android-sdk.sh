#!/usr/bin/env bash
# Install the SDK packages named by the React Native version catalog.
# Current indexes call API 37 "platforms/android-37.0", not "platforms;android-37".
# When an id cannot be resolved, Gradle downloads it. assembleRelease still
# fails the job if the build itself fails.

set -eu

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
catalog="${1:-node_modules/react-native/gradle/libs.versions.toml}"
resolver="${root}/scripts/android-sdk-packages.cjs"
if [ ! -f "$catalog" ]; then
  echo "::error::Could not find ${catalog}. Expo prebuild reads compileSdk, buildTools, and ndkVersion from that catalog."
  exit 1
fi

write_local_properties() {
  if [ -z "${ANDROID_HOME:-}" ] || [ ! -d "${root}/android" ]; then
    return 0
  fi
  local properties="${root}/android/local.properties"
  if [ -f "$properties" ] && grep -q '^sdk.dir=' "$properties"; then
    return 0
  fi
  printf 'sdk.dir=%s\n' "$ANDROID_HOME" >>"$properties"
}

accept_licenses() {
  if [ -z "${SDKMANAGER:-}" ]; then
    return 0
  fi
  yes | "$SDKMANAGER" --licenses >/dev/null 2>&1 || true
}

capture_list() {
  local output="$1"
  "$SDKMANAGER" --list >"$output" 2>"${output}.err" || true
}

resolve() {
  node "$resolver" --catalog "$catalog" --list "$1"
}

install_packages() {
  local result="$1"
  local packages=()
  while IFS= read -r package; do
    if [ -n "$package" ]; then
      packages+=("$package")
    fi
  done <<EOF
$(node -e 'const result = JSON.parse(process.argv[1]); for (const id of result.install) console.log(id);' "$result")
EOF
  if [ "${#packages[@]}" -eq 0 ]; then
    return 0
  fi
  echo "Installing ${packages[*]}"
  if ! yes | "$SDKMANAGER" --install "${packages[@]}"; then
    echo "sdkmanager could not install every resolved package. Gradle will download what is still missing."
  fi
}

report_unresolved() {
  local result="$1"
  node -e '
    const result = JSON.parse(process.argv[1]);
    if (result.unresolved.length === 0) process.exit(0);
    console.log(
      "Could not resolve " +
        result.unresolved.join(", ") +
        ". Gradle will download the missing SDK components. Licenses are accepted.",
    );
  ' "$result"
}

platform_unresolved() {
  node -e 'const result = JSON.parse(process.argv[1]); process.exit(result.unresolved.some((item) => item.startsWith("platform:")) ? 0 : 1);' "$1"
}

if ! command -v sdkmanager >/dev/null 2>&1 && [ ! -x "${ANDROID_HOME:-}/cmdline-tools/latest/bin/sdkmanager" ]; then
  echo "sdkmanager is not on PATH. Gradle will download missing SDK components."
  write_local_properties
  exit 0
fi

if [ -x "${ANDROID_HOME:-}/cmdline-tools/latest/bin/sdkmanager" ]; then
  SDKMANAGER="${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager"
else
  SDKMANAGER="$(command -v sdkmanager)"
fi

list_file="$(mktemp)"
trap 'rm -f "$list_file" "${list_file}.err"' EXIT

accept_licenses
capture_list "$list_file"
result="$(resolve "$list_file")"

if platform_unresolved "$result"; then
  if grep -Eq 'cmdline-tools[/;]latest' "$list_file"; then
    update_id="$(node -e 'const result = JSON.parse(process.argv[1]); console.log(result.cmdlineToolsPackage);' "$result")"
    echo "The platform id is missing from this sdkmanager index. Updating ${update_id}."
    yes | "$SDKMANAGER" --install "$update_id" >/dev/null 2>&1 || true
    if [ -n "${ANDROID_HOME:-}" ] && [ -x "${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager" ]; then
      SDKMANAGER="${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager"
    fi
    accept_licenses
    capture_list "$list_file"
    result="$(resolve "$list_file")"
  fi
fi

install_packages "$result"
report_unresolved "$result"
write_local_properties
