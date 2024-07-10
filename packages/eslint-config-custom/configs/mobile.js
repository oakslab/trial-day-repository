const config = require('./base');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  //TODO: help needed, this package require.resolve('@react-native/eslint-config') breaks due typescript version conflict but we could use this config
  extends: [...config.extends, 'plugin:react-hooks/recommended'],
  globals: {
    ...config.globals,
  },
  env: {
    ...config.env,
  },
  plugins: config.plugins,
  settings: config.settings,
  overrides: config.overrides,
  rules: {
    ...config.rules,
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '**frontend-features-base**',
              '**frontend-utils-base**',
              'next**',
              '**ui-base**',
            ],
            message:
              "Do not import the packages because you'll break the mobile app.",
          },
        ],
      },
    ],
  },
};
