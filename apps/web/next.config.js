/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require('@sentry/nextjs');
const withFHR = require('../../tools/firebase-hosting-rewrites');

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  transpilePackages: [
    'ui-base',
    'frontend-features-base',
    'auth-frontend-base',
    'frontend-utils-base',
    'auth-frontend',
    'theme',
    'ui',
    'common-base',
    'mui-one-time-password-input',
  ],
  modularizeImports: {
    '@base/ui-base/icons': {
      transform: '@mui/icons-material/{{member}}',
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const sentryConfig = {
  silent: true,
  org: process.env.NEXT_PUBLIC_SENTRY_ORG,
  project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
  authToken: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,
};

/** @type {import('next').NextConfig} */
module.exports = withFHR(
  ['web'],
  '../../firebase.json',
)(
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'local'
    ? nextConfig
    : withSentryConfig(nextConfig, sentryConfig, {
        widenClientFileUpload: true,
        transpileClientSDK: false,
        hideSourceMaps: true,
        disableLogger: true,
      }),
);
