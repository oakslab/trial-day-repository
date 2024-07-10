import { IncomingHttpHeaders } from 'http';
import * as Sentry from '@sentry/nextjs';
import { LoggerService } from '../../services';
import { middleware } from '../index';

const serializeError = (error: unknown) =>
  JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));

const removeSensitiveData = (headers: IncomingHttpHeaders) => {
  const sensitiveHeaders = ['authorization'];

  return Object.fromEntries(
    Object.entries(headers).map(([headerName, value]) => [
      headerName,
      sensitiveHeaders.includes(headerName) && value ? '[REDACTED]' : value,
    ]),
  );
};

export const requestLoggerMiddleware = middleware(async (opts) => {
  const start = Date.now();
  const logger = opts.ctx.container.get(LoggerService);

  return Sentry.withScope(async (scope) => {
    const result = await opts.next();
    const durationMs = Date.now() - start;

    const logContent = {
      path: opts.path,
      type: opts.type,
      durationMs,
      ok: result.ok,
      request: opts.rawInput ?? null,
      requestHeaders: removeSensitiveData(opts.ctx.req.headers),
      error: (!result.ok && serializeError(result.error)) ?? null,
    };

    (result.ok ? logger.info : logger.error).bind(logger)(
      `[user-api] Request log [${opts.type}] - [${opts.path}]`,
      logContent,
    );

    if (!result.ok) {
      scope.captureException(result.error.cause ?? result.error);
    }

    return result;
  });
});
