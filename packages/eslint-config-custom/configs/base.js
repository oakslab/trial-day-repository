const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');
/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-turbo',
    'plugin:sonarjs/recommended',
    'prettier',
  ],
  parserOptions: {
    project,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  plugins: ['only-warn', 'unused-imports', 'sonarjs', 'import'],
  rules: {
    // Example of custom rules - uncomment to enable, hook is located in packages/eslint-rules-custom/rules
    // 'custom-rules/no-direct-useMutation': [
    // 'error',
    // { allowedPaths: ['<PATH_TO_WHERE_THE_RULE_SHOULD_BE_APPLIED>'] },
    // ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true },
    ],
    'sonarjs/cognitive-complexity': ['error', 32],
    'unused-imports/no-unused-imports': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/packages/**', '**/base/**', '**/apps/**'],
            message:
              'Do not import the packages with their relative path. Use "import X from package/subfolder" instead.',
          },
        ],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
  },
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
  },
};
