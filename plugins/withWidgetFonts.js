const fs = require('fs');
const path = require('path');

const { withDangerousMod } = require('@expo/config-plugins');

const FONTS = [
  'jost/400Regular/Jost_400Regular.ttf',
  'jost/500Medium/Jost_500Medium.ttf',
  'jost/700Bold/Jost_700Bold.ttf',
];

/**
 * react-native-android-widget loads typefaces from android assets/fonts.
 * Copy the Jost files the app already depends on so the widget can use them.
 * If a file is missing at prebuild, the library falls back to the system face.
 */
function withWidgetFonts(config) {
  return withDangerousMod(config, [
    'android',
    (mod) => {
      const dest = path.join(mod.modRequest.platformProjectRoot, 'app/src/main/assets/fonts');
      fs.mkdirSync(dest, { recursive: true });
      for (const rel of FONTS) {
        const src = path.join(mod.modRequest.projectRoot, 'node_modules/@expo-google-fonts', rel);
        const name = path.basename(rel);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(dest, name));
        }
      }
      return mod;
    },
  ]);
}

module.exports = withWidgetFonts;
