/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '/dist/'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'plugins/**/*.js', 'scripts/**/*.cjs'],
};
