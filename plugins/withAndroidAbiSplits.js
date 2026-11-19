const { withAppBuildGradle } = require('@expo/config-plugins');

const { applyAbiSplits } = require('./androidAbiSplits');

function withAndroidAbiSplits(config) {
  return withAppBuildGradle(config, (mod) => {
    if (mod.modResults.language !== 'groovy') {
      throw new Error('ABI splits expect the Groovy app/build.gradle.');
    }
    mod.modResults.contents = applyAbiSplits(mod.modResults.contents);
    return mod;
  });
}

module.exports = withAndroidAbiSplits;
