const { withAppBuildGradle } = require('@expo/config-plugins');

const { applyReleaseSigning } = require('./androidReleaseSigning');

function withAndroidReleaseSigning(config) {
  return withAppBuildGradle(config, (mod) => {
    if (mod.modResults.language !== 'groovy') {
      throw new Error('Android release signing expects the Groovy app/build.gradle.');
    }
    mod.modResults.contents = applyReleaseSigning(mod.modResults.contents);
    return mod;
  });
}

module.exports = withAndroidReleaseSigning;
