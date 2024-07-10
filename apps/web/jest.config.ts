import type { Config } from '@jest/types';
import { jestConfig } from '@package/jest-config-custom';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js
  // and .env files in your test environment
  dir: './',
});

// createJestConfig is exported this way to ensure that next/jest
// can load the Next.js config which is async
export default createJestConfig(jestConfig as Config.InitialOptions);
