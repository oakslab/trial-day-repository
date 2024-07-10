import * as Sentry from '@sentry/nextjs';
import { User } from 'database';
import Transport from 'winston-transport';

type LogInfo = {
  requestId?: string;
  user: User | null;
  message: string;
  level: string;
  [key: string]: unknown;
};

class SentryTransport extends Transport {
  private levelsMap: { [key: string]: Sentry.SeverityLevel } = {
    error: 'error',
    warn: 'warning',
    info: 'info',
    debug: 'debug',
    log: 'debug',
  };

  private formatUser(user: User | null) {
    return user
      ? {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        }
      : null;
  }

  private extractData(info: LogInfo) {
    return {
      user: this.formatUser(info.user),
      requestId: info.requestId,
      type: info.type,
      timestamp: info.timestamp,
    };
  }

  log(info: LogInfo, callback: () => void) {
    const { message, level } = info;

    const breadcrumb: Sentry.Breadcrumb = {
      message,
      level: this.levelsMap[level],
      timestamp: Date.now() / 1000,
      data: this.extractData(info),
    };

    Sentry.getCurrentScope().addBreadcrumb(breadcrumb);

    callback();
  }
}

export const sentryTransport = new SentryTransport();
