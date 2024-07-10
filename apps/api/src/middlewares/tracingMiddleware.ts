import * as Sentry from '@sentry/nextjs';
import { ProcedureType } from '@trpc/server';
import { runInRootSpan } from '../lib/tracer';
import { middleware } from '../trpc';

// http headers needed for distributed tracing
// https://docs.sentry.io/platforms/node/usage/distributed-tracing/custom-instrumentation/
type SentryTraceHeader = 'sentry-trace' | 'baggage';

export const tracingMiddleware = middleware((opts) => {
  const traceName = `trpc.${opts.path}`;
  const sentryTracingHeaders = getSentryTracingHeaders(opts.ctx.req.rawHeaders);

  const doRunTracedProcedure = () =>
    runInRootSpan(
      { name: traceName, operation: getOperation(opts.type) },
      () => {
        // if you want to add additional info about user, do it here
        // span.addAttribute('yourKey, opts.ctx.user?.email);
        return opts.next();
      },
    );

  if (sentryTracingHeaders !== null) {
    return Sentry.continueTrace(sentryTracingHeaders, doRunTracedProcedure);
  }
  return doRunTracedProcedure();
});

const getSentryTracingHeaders = (
  headers: string[],
): Parameters<typeof Sentry.continueTrace>[0] | null => {
  const sentryTrace = getSentryTracingHeader(headers, 'sentry-trace');
  const baggage = getSentryTracingHeader(headers, 'baggage');

  if (sentryTrace && baggage) {
    return {
      sentryTrace,
      baggage,
    };
  }

  return null;
};

const getSentryTracingHeader = (
  headers: string[],
  header: SentryTraceHeader,
) => {
  const index = headers.indexOf(header);

  // tRPC request headers are in format:
  // ['<header1 name>', '<header1 value'>, '<header2 name>', '<header2 value'>]
  if (index > -1 && headers.length > index + 1) {
    return headers[index + 1];
  }

  return null;
};

const getOperation = (operationType: ProcedureType) => `trpc.${operationType}`;
