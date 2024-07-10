import { isNodeEnvProduction } from '@base/common-base';
import { LoggingWinston } from '@google-cloud/logging-winston';
import type { Logger } from 'winston';
import { format, createLogger, transports } from 'winston';
import { sentryTransport } from './sentry-transport';

export type LoggerType = Logger;

const { combine, timestamp, json, prettyPrint } = format;

// https://github.com/googleapis/nodejs-logging-winston/issues/190
// avoiding error: Error: 3 INVALID_ARGUMENT: Log entry with size 596.2K exceeds maximum size of 256.0K
const GCLOUD_MAX_ENTRY_SIZE = 256 * 1024;

export const loggerInit = (): LoggerType => {
  const isDeployed = isNodeEnvProduction();
  const customTransports = [
    isDeployed
      ? new LoggingWinston({
          maxEntrySize: GCLOUD_MAX_ENTRY_SIZE,
        })
      : new transports.Console(),
    sentryTransport,
  ];
  const customFormat = isDeployed
    ? combine(timestamp(), json())
    : combine(timestamp(), prettyPrint());

  return createLogger({
    transports: customTransports,
    level: isDeployed ? 'info' : 'debug',
    format: customFormat,
  });
};
