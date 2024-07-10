import { frontendEnv } from '@base/frontend-utils-base';
import * as Sentry from '@sentry/nextjs';

if (frontendEnv.NEXT_PUBLIC_ENVIRONMENT !== 'local') {
  Sentry.init({
    environment: frontendEnv.NEXT_PUBLIC_ENVIRONMENT,
    dsn: frontendEnv.NEXT_PUBLIC_SENTRY_DSN,
    enabled: frontendEnv.NEXT_PUBLIC_ENVIRONMENT !== 'local',
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: frontendEnv.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE, // keep it 1.0 for development, in production keep in mind you might want to decrease this number depending on you traffic
    beforeSend: (event) => {
      event.tags = { ...event.tags, app: frontendEnv.NEXT_PUBLIC_SENTRY_APP };
      return event;
    },
  });
}
