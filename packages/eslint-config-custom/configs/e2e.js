const config = require('./base');
/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['plugin:playwright/recommended', ...config.extends],
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
