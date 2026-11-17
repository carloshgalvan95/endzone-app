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
  throw new Error('Unbalanced braces in app/build.gradle while adding release signing.');
}

function blockAfterKeyword(source, keyword, from = 0) {
  const re = new RegExp(`\\b${keyword}\\s*\\{`, 'g');
  re.lastIndex = from;
  const match = re.exec(source);
  if (!match) {
    return null;
  }
  const open = match.index + match[0].length - 1;
  const close = findMatchingBrace(source, open);
  return { open, close };
}

const LOADER = `// endzone-release-signing
def endzoneKeystorePropertiesFile = rootProject.file("keystore.properties")
def endzoneKeystoreProperties = new Properties()
if (endzoneKeystorePropertiesFile.exists()) {
    endzoneKeystoreProperties.load(new InputStreamReader(new FileInputStream(endzoneKeystorePropertiesFile), "UTF-8"))
}

`;

/**
 * Point the release build type at a keystore.properties file.
 * Debug builds stay on the debug keystore. Missing properties do not
 * fail configuration, so assembleDebug still runs. The release workflow
 * refuses to start when the signing secrets are absent.
 */
function applyReleaseSigning(contents) {
  if (contents.includes('endzone-release-signing')) {
    return contents;
  }

  const buildTypes = blockAfterKeyword(contents, 'buildTypes');
  if (!buildTypes) {
    throw new Error('app/build.gradle has no buildTypes block.');
  }
  const release = blockAfterKeyword(contents, 'release', buildTypes.open);
  if (!release || release.open > buildTypes.close) {
    throw new Error('app/build.gradle has no release build type.');
  }

  const inner = contents.slice(release.open + 1, release.close);
  const cleaned = inner.replace(/^[ \t]*signingConfig\s+signingConfigs\.debug\s*$/gm, '');
  const releaseSigning = `
            if (endzoneKeystorePropertiesFile.exists()) {
                signingConfig signingConfigs.release
            }
`;
  let next =
    contents.slice(0, release.open + 1) + releaseSigning + cleaned + contents.slice(release.close);

  const signing = blockAfterKeyword(next, 'signingConfigs');
  if (!signing) {
    throw new Error('app/build.gradle has no signingConfigs block.');
  }
  const signingBlock = `
        release {
            if (endzoneKeystorePropertiesFile.exists()) {
                storeFile file(endzoneKeystoreProperties['storeFile'])
                storePassword endzoneKeystoreProperties['storePassword']
                keyAlias endzoneKeystoreProperties['keyAlias']
                keyPassword endzoneKeystoreProperties['keyPassword']
            }
        }
`;
  next = next.slice(0, signing.open + 1) + signingBlock + next.slice(signing.open + 1);
  return LOADER + next;
}

module.exports = { applyReleaseSigning };
