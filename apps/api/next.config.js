// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require('@sentry/nextjs');
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '*': [
        '../../node_modules/@google-cloud/tasks/build/esm/src/**/cloud_tasks_client_config.json',
      ],
    },
  },
  transpilePackages: ['common-base', 'authentication'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const sentryConfig = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

module.exports =
  process.env.ENVIRONMENT === 'local'
    ? nextConfig
    : withSentryConfig(nextConfig, sentryConfig, {
        widenClientFileUpload: true,
        transpileClientSDK: false,
        hideSourceMaps: true,
        disableLogger: true,
      });
