import * as Sentry from '@sentry/nextjs';

export const trackExceptionInSentry = (e: Error | unknown) => {
  if (e instanceof Error) {
    Sentry.captureException(e);
  } else {
    Sentry.captureMessage(`Unknown error: ${String(e)}`);
  }
};
