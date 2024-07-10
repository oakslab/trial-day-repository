import * as TraceAgent from '@google-cloud/trace-agent';
import * as Sentry from '@sentry/node';
import { SpanAttributeValue } from '@sentry/types';
import { apiEnv } from './env';

if (apiEnv.ENABLE_TRACING === 'true') {
  TraceAgent.start({
    projectId: apiEnv.GOOGLE_CLOUD_PROJECT,
  });
}

const tracer = TraceAgent.get();
const GCP_OPERATION_LABEL = 'operation';

export type SpanOptions = {
  name: string;
  operation?: string;
};

export type SpanWrapper = {
  addAttribute: (name: string, value: SpanAttributeValue) => void;
};

/**
 * Run traced operation inside GCP & Sentry root span
 * @param opt
 * @param callback
 * @returns
 */
export const runInRootSpan = <T>(
  opt: SpanOptions,
  callback: (span: SpanWrapper) => Promise<T>,
): Promise<T> => {
  // Sentry does not make difference in root and child span
  return Sentry.startSpan(
    {
      name: opt.name,
      op: opt.operation,
    },
    (sentrySpan) => {
      return tracer.runInRootSpan({ name: opt.name }, async (gcpSpan) => {
        const span: SpanWrapper = {
          addAttribute: (name, value) => {
            gcpSpan.addLabel(name, value);
            sentrySpan?.setAttribute(name, value);
          },
        };

        // GCP does not have default attribute for operation as Sentry -> set it as label
        if (opt.operation) {
          gcpSpan.addLabel(GCP_OPERATION_LABEL, opt.operation);
        }

        return callback(span).finally(() => {
          gcpSpan.endSpan();
        });
      });
    },
  );
};

/**
 * Run traced operation inside GCP & Sentry child span
 * @param opt
 * @param callback
 * @returns
 */
export const runInChildSpan = <T>(
  opt: SpanOptions,
  callback: (span: SpanWrapper) => Promise<T>,
): Promise<T> => {
  return Sentry.startSpan(
    {
      name: opt.name,
      op: opt.operation,
    },
    (sentrySpan) => {
      const gcpSpan = tracer.createChildSpan({ name: opt.name });

      const span: SpanWrapper = {
        addAttribute: (name, value) => {
          gcpSpan.addLabel(name, value);
          sentrySpan?.setAttribute(name, value);
        },
      };

      return callback(span).finally(() => gcpSpan.endSpan());
    },
  );
};
