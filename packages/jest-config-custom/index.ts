import path from 'path';
import type { Config } from '@jest/types';

const esmModules: string[] = [];

// Only for frontend apps or packages
export const jestConfig: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/out/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/*.config.js',
    '!<rootDir>/coverage/**',
    '!jest.config.ts',
    '!sentry.client.config.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['json-summary'],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': path.join(
      __dirname,
      './__mocks__/fileMock.js',
    ),

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': path.join(__dirname, './__mocks__/styleMock.js'),
    // Handle @next/font
    '@next/font/(.*)': path.join(__dirname, './__mocks__/nextFontMock.js'),
    // Handle next/font
    'next/font/(.*)': path.join(__dirname, './__mocks__/nextFontMock.js'),
    // Disable server-only
    'server-only': path.join(__dirname, './__mocks__/empty.js'),
    '^superjson$': path.join(__dirname, './__mocks__/superjsonMock.js'),

    // Monorepo dependencies
    '^@base/frontend-features-base/(.*)$': path.join(
      __dirname,
      '../base/frontend-features-base/src/$1/index.ts',
    ),
  },
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: ['next/babel'],
        plugins: ['@babel/plugin-transform-private-methods'],
      },
    ],
  },
  transformIgnorePatterns:
    esmModules.length > 0
      ? [`node_modules/(?!(?:.pnpm/)?(${esmModules.join('|')}))`]
      : [],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
