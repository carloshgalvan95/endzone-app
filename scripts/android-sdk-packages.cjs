/**
 * Pick Android SDK package ids from `sdkmanager --list`.
 *
 * React Native's version catalog says compileSdk = "37". Current SDK indexes
 * do not publish `platforms;android-37`. They publish `platforms;android-37.0`
 * (and newer cmdline-tools print that id with a slash).
 */

const PREVIEW = '(?:alpha|beta|rc|preview|canary|dev)';

function readCatalogVersions(text) {
  function read(key) {
    const match = new RegExp(`^${key}\\s*=\\s*"([^"]+)"`, 'm').exec(text);
    return match ? match[1] : null;
  }
  return {
    compileSdk: read('compileSdk'),
    buildTools: read('buildTools'),
    ndkVersion: read('ndkVersion'),
  };
}

function parseSdkManagerList(text) {
  const ids = new Set();
  let slashes = 0;
  let semicolons = 0;
  const pattern =
    /(?:^|\s)((?:platforms|build-tools|ndk|cmake|cmdline-tools)([;/])[A-Za-z0-9][A-Za-z0-9._+-]*)(?=\s|$)/gm;
  let match = pattern.exec(text);
  while (match) {
    if (match[2] === '/') {
      slashes += 1;
    } else {
      semicolons += 1;
    }
    ids.add(match[1].replaceAll('/', ';'));
    match = pattern.exec(text);
  }
  return {
    ids: [...ids],
    separator: slashes > semicolons ? '/' : ';',
  };
}

function parsePlatform(id) {
  const match = new RegExp(
    `^platforms;android-(\\d+)(?:\\.(\\d+))?(?:-ext(\\d+))?(?:-${PREVIEW}\\d*)?$`,
    'i',
  ).exec(id);
  if (!match) {
    return null;
  }
  return {
    id,
    major: Number(match[1]),
    minor: match[2] == null ? null : Number(match[2]),
    ext: match[3] == null ? null : Number(match[3]),
    preview: new RegExp(`-${PREVIEW}\\d*$`, 'i').test(id),
  };
}

function parseRequestedApi(value) {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(String(value).trim());
  if (!match) {
    return null;
  }
  return {
    major: Number(match[1]),
    minor: match[2] == null ? null : Number(match[2]),
  };
}

function highestExt(packages) {
  return [...packages].sort((left, right) => right.ext - left.ext)[0] ?? null;
}

function resolvePlatform(ids, compileSdk) {
  const requested = parseRequestedApi(compileSdk);
  if (!requested) {
    return null;
  }
  const stable = ids
    .map(parsePlatform)
    .filter((item) => item && !item.preview && item.major === requested.major);
  if (requested.minor == null) {
    const exact = stable.find((item) => item.minor == null && item.ext == null);
    if (exact) {
      return exact.id;
    }
    const base = stable.find((item) => item.minor === 0 && item.ext == null);
    if (base) {
      return base.id;
    }
    const minors = stable
      .filter((item) => item.minor != null && item.ext == null)
      .sort((left, right) => left.minor - right.minor);
    if (minors.length > 0) {
      return minors[0].id;
    }
    const extension = highestExt(stable.filter((item) => item.ext != null));
    return extension ? extension.id : null;
  }
  const exactMinor = stable.find((item) => item.minor === requested.minor && item.ext == null);
  if (exactMinor) {
    return exactMinor.id;
  }
  const extension = highestExt(
    stable.filter((item) => item.minor === requested.minor && item.ext != null),
  );
  if (extension) {
    return extension.id;
  }
  if (requested.minor === 0) {
    const legacy = stable.find((item) => item.minor == null && item.ext == null);
    if (legacy) {
      return legacy.id;
    }
  }
  return null;
}

function parseBuildTools(id) {
  const match = /^build-tools;(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z]+)(\d+)?)?$/.exec(id);
  if (!match) {
    return null;
  }
  return {
    id,
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    preview: match[4] ? match[4].toLowerCase() : null,
  };
}

function resolveBuildTools(ids, version) {
  const requested = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(version).trim());
  if (!requested) {
    return null;
  }
  const major = Number(requested[1]);
  const minor = Number(requested[2]);
  const parsed = ids.map(parseBuildTools).filter(Boolean);
  const exact = parsed.find((item) => item.id === `build-tools;${version}` && !item.preview);
  if (exact) {
    return exact.id;
  }
  const sameMinor = parsed
    .filter((item) => !item.preview && item.major === major && item.minor === minor)
    .sort((left, right) => right.patch - left.patch);
  if (sameMinor.length > 0) {
    return sameMinor[0].id;
  }
  const sameMajor = parsed
    .filter((item) => !item.preview && item.major === major)
    .sort((left, right) => right.minor - left.minor || right.patch - left.patch);
  return sameMajor.length > 0 ? sameMajor[0].id : null;
}

function resolveNdk(ids, version) {
  const exact = `ndk;${version}`;
  return ids.includes(exact) ? exact : null;
}

function resolveCmake(ids, preferred = '3.30.5') {
  const exact = `cmake;${preferred}`;
  if (ids.includes(exact)) {
    return exact;
  }
  const parsed = ids
    .map((id) => {
      const match = /^cmake;(\d+)\.(\d+)\.(\d+)(?:\.\d+)?$/.exec(id);
      if (!match) {
        return null;
      }
      return {
        id,
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3]),
      };
    })
    .filter((item) => item && item.major === 3);
  parsed.sort((left, right) => right.minor - left.minor || right.patch - left.patch);
  return parsed.length > 0 ? parsed[0].id : null;
}

function toInstallId(canonical, separator) {
  if (separator === '/') {
    return canonical.replaceAll(';', '/');
  }
  return canonical;
}

function resolveAndroidPackages(options) {
  const ids = options.ids;
  const separator = options.separator === '/' ? '/' : ';';
  const install = [];
  const unresolved = [];

  const platform = resolvePlatform(ids, options.compileSdk);
  if (platform) {
    install.push(platform);
  } else {
    unresolved.push(`platform:${options.compileSdk}`);
  }

  const buildTools = resolveBuildTools(ids, options.buildTools);
  if (buildTools) {
    install.push(buildTools);
  } else {
    unresolved.push(`build-tools:${options.buildTools}`);
  }

  const ndk = resolveNdk(ids, options.ndkVersion);
  if (ndk) {
    install.push(ndk);
  } else {
    unresolved.push(`ndk:${options.ndkVersion}`);
  }

  const cmake = resolveCmake(ids);
  if (cmake) {
    install.push(cmake);
  }

  return {
    install: install.map((id) => toInstallId(id, separator)),
    unresolved,
    separator,
    cmdlineToolsPackage: toInstallId('cmdline-tools;latest', separator),
    cmdlineToolsListed: ids.includes('cmdline-tools;latest'),
  };
}

function resolveFromList(catalogText, listText) {
  const versions = readCatalogVersions(catalogText);
  if (!versions.compileSdk || !versions.buildTools || !versions.ndkVersion) {
    throw new Error(
      'The React Native version catalog is missing compileSdk, buildTools, or ndkVersion.',
    );
  }
  const parsed = parseSdkManagerList(listText);
  return resolveAndroidPackages({
    compileSdk: versions.compileSdk,
    buildTools: versions.buildTools,
    ndkVersion: versions.ndkVersion,
    ids: parsed.ids,
    separator: parsed.separator,
  });
}

module.exports = {
  parseSdkManagerList,
  readCatalogVersions,
  resolveAndroidPackages,
  resolveBuildTools,
  resolveCmake,
  resolveFromList,
  resolveNdk,
  resolvePlatform,
};

if (require.main === module) {
  const fs = require('node:fs');
  const catalogFlag = process.argv.indexOf('--catalog');
  const listFlag = process.argv.indexOf('--list');
  if (catalogFlag === -1 || listFlag === -1) {
    console.error('Usage: node scripts/android-sdk-packages.cjs --catalog <file> --list <file>');
    process.exit(1);
  }
  const catalogPath = process.argv[catalogFlag + 1];
  const listPath = process.argv[listFlag + 1];
  const result = resolveFromList(
    fs.readFileSync(catalogPath, 'utf8'),
    fs.readFileSync(listPath, 'utf8'),
  );
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
