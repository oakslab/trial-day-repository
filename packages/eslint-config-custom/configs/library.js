const config = require('./base');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [...config.extends],
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
