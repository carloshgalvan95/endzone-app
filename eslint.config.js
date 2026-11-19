const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = defineConfig([
  {
    ignores: [
      'node_modules/**',
      'android/**',
      'ios/**',
      'dist/**',
      '.expo/**',
      'coverage/**',
      'contracts/v1/*.schema.json',
      'docs/**',
    ],
  },
  expoConfig,
  prettier,
  {
    files: ['scripts/**/*.{js,cjs,mjs}', 'plugins/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{test,spec}.{js,ts,tsx}', 'jest.setup.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]);
