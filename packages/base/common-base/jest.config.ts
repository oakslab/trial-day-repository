import type { Config } from 'jest';

const esmModules: string[] = [];

const config: Config = {
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
  testEnvironment: 'node',
  transformIgnorePatterns: [
    `node_modules/(?!(?:.pnpm/)?(${esmModules.join('|')}))`,
  ],
};

export default config;
