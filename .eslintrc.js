module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ['@package/eslint-config-custom'],
  // The package has to be named 'eslint-plugin-custom-rules' (with the prefix 'eslint-plugin-')!
  plugins: ['custom-rules'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
};
