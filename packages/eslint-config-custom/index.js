const baseConfig = require('./configs/base');
const libraryConfig = require('./configs/library');
const mobileConfig = require('./configs/mobile');
const nextConfig = require('./configs/next');
const reactInternalConfig = require('./configs/react-internal');
const e2eConfig = require('./configs/e2e');

module.exports = {
  overrides: [
    {
      files: [
        'apps/admin/**/*.ts?(x)',
        'apps/api/**/*.ts?(x)',
        'apps/examples/**/*.ts?(x)',
        'apps/web/**/*.ts?(x)',
        'packages/auth-backend/**/*.ts?(x)',
        'packages/auth-frontend/**/*.ts?(x)',
        'packages/frontend-features/**/*.ts?(x)',
        'packages/frontend-features-base/**/*.ts?(x)',
        'packages/frontend-utils/**/*.ts?(x)',
      ],
      ...nextConfig,
    },
    {
      files: ['apps/mobile/**/*.ts?(x)'],
      ...mobileConfig,
    },
    {
      files: [
        'packages/base/auth-backend-base/**/*.ts?(x)',
        'packages/base/auth-frontend-base/**/*.ts?(x)',
        'packages/base/common-base/**/*.ts?(x)',
        'packages/base/frontend-features-base/**/*.ts?(x)',
        'packages/base/frontend-utils-base/**/*.ts?(x)',
        'packages/base/ui-base/**/*.ts?(x)',
      ],
      ...libraryConfig,
    },
    {
      files: [
        'packages/common/**/*.ts?(x)',
        'packages/database/**/*.ts?(x)',
        'packages/theme/**/*.ts?(x)',
        'packages/ui/**/*.ts?(x)',
      ],
      ...reactInternalConfig,
    },
    {
      files: ['apps/admin-e2e/**/*.ts'],
      ...e2eConfig,
    },
  ],
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
    project: ['./tsconfig.json'],
  },
  ignorePatterns: [
    '**/dist/*',
    '**/node_modules/*',
    '**/out/*',
    '**/.eslintrc.js',
    '**/vitest.config.ts',
    '*.js',
  ],
};
