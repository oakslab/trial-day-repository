import { apiEnv } from '../../../lib/env';
import { EmailMessage, EmailProviderBase, EmailResult } from './email.provider';

export class ConsoleEmailProvider implements EmailProviderBase {
  constructor() {
    if (
      apiEnv.ENVIRONMENT &&
      !['local', 'development', 'demo'].includes(apiEnv.ENVIRONMENT)
    ) {
      throw new Error(
        'ConsoleEmailProvider should only be used in local, development or demo environments.',
      );
    }
  }

  getName() {
    return 'console';
  }

  async sendEmail(message: EmailMessage): Promise<EmailResult> {
    console.log('[ConsoleEmailProvider]: ', JSON.stringify(message, null, 2));
    return Promise.resolve({ success: true });
  }

  async sendManyEmails(messages: EmailMessage[]): Promise<EmailResult> {
    messages.forEach((message) => this.sendEmail(message));
    return Promise.resolve({ success: true });
  }
}
