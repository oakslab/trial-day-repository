import * as Sentry from '@sentry/nextjs';
import { apiEnv } from './src/lib/env';

if (apiEnv.ENVIRONMENT !== 'local') {
  Sentry.init({
    environment: apiEnv.ENVIRONMENT,
    dsn: apiEnv.SENTRY_DSN,
    enabled: apiEnv.ENVIRONMENT !== 'local',
    tracesSampleRate: apiEnv.SENTRY_TRACES_SAMPLE_RATE, // keep it 1.0 for development, in production keep in mind you might want to decrease this number depending on you traffic
    beforeBreadcrumb: (breadcrumb: Sentry.Breadcrumb) => {
      // filter out auto console logs
      return breadcrumb.category === 'console' && breadcrumb.level === 'log'
        ? null
        : breadcrumb;
    },
    beforeSend: (event) => {
      event.tags = { ...event.tags, app: apiEnv.SENTRY_APP };
      return event;
    },
  });
}
