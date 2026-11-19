function findMatchingBrace(source, openIndex) {
  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }
  throw new Error('Unbalanced braces in app/build.gradle while adding ABI splits.');
}

function blockAfterKeyword(source, keyword, from = 0) {
  const pattern = new RegExp(`\\b${keyword}\\s*\\{`, 'g');
  pattern.lastIndex = from;
  const match = pattern.exec(source);
  if (!match) {
    return null;
  }
  const open = match.index + match[0].length - 1;
  const close = findMatchingBrace(source, open);
  return { open, close };
}

const MARKER = 'endzone-abi-splits';

const INJECTION = `
    // ${MARKER}
    splits {
        abi {
            def endzoneReleaseBuild = gradle.startParameter.taskNames.any { it.toLowerCase().contains('release') }
            enable endzoneReleaseBuild
            reset()
            include 'armeabi-v7a', 'arm64-v8a'
            universalApk true
        }
    }
    applicationVariants.configureEach { variant ->
        variant.outputs.configureEach { output ->
            def abi = output.getFilter(com.android.build.OutputFile.ABI)
            def abiOffset = ['armeabi-v7a': 1, 'arm64-v8a': 2]
            if (abi != null && abiOffset.containsKey(abi)) {
                output.versionCodeOverride = defaultConfig.versionCode * 1000 + abiOffset.get(abi)
            }
        }
    }
`;

function applyAbiSplits(contents) {
  if (contents.includes(MARKER)) {
    return contents;
  }
  const android = blockAfterKeyword(contents, 'android');
  if (!android) {
    throw new Error('app/build.gradle has no android block.');
  }
  return contents.slice(0, android.open + 1) + INJECTION + contents.slice(android.open + 1);
}

module.exports = { applyAbiSplits };
