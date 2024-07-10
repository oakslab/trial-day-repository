import { Service } from 'typedi';
import { loggerInit, LoggerType } from '../../lib/logger/logger';
import { type UserFromContext } from '../../trpc/types';

@Service()
export class LoggerService {
  readonly logger: LoggerType;

  constructor(requestId: string | null, user: UserFromContext | null) {
    this.logger = loggerInit().child({
      requestId,
      user: user
        ? {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            ...('originalUserId' in user && {
              originalUserId: user.originalUserId,
            }),
          }
        : null,
    });
  }

  log<T extends Record<string | symbol | number, unknown>>(
    message: string,
    meta?: T,
  ) {
    this.logger.log({
      message,
      level: 'log',
      ...meta,
    });
  }

  info<T extends Record<string | symbol | number, unknown>>(
    message: string,
    meta?: T,
  ) {
    this.logger.info({
      message,
      level: 'info',
      ...meta,
    });
  }

  debug<T extends Record<string | symbol | number, unknown>>(
    message: string,
    meta?: T,
  ) {
    this.logger.debug({
      message,
      level: 'debug',
      ...meta,
    });
  }

  error<T extends Record<string | symbol | number, unknown>>(
    message: string,
    meta?: T,
  ) {
    this.logger.error({
      message,
      level: 'error',
      ...meta,
    });
  }

  warn<T extends Record<string | symbol | number, unknown>>(
    message: string,
    meta?: T,
  ) {
    this.logger.warn({
      message,
      level: 'warn',
      ...meta,
    });
  }
}

export const logger = new LoggerService('global', null);
