const config = require('./base');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    ...config.extends,
    require.resolve('@vercel/style-guide/eslint/next'),
    'plugin:react-hooks/recommended',
  ],
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
  },
};
