import type { Config } from '@jest/types';

const esmModules = ['superjson', 'nanoid'];

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{(t|j)s,(t|j)sx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['json-summary'],
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',
  transformIgnorePatterns: [
    `node_modules/(?!(?:.pnpm/)?(${esmModules.join('|')}))`,
  ],
};

export default config;
