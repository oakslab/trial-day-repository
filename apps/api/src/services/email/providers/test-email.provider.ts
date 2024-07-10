import { apiEnv } from '../../../lib/env';
import { EmailMessage, EmailProviderBase, EmailResult } from './email.provider';

export class TestEmailProvider implements EmailProviderBase {
  public static emailLog: EmailMessage[] = [];
  public static mockResult: EmailResult = { success: true };

  public static clearEmailLog() {
    TestEmailProvider.emailLog = [];
  }

  public static resetMockResult() {
    TestEmailProvider.mockResult = { success: true };
  }

  constructor() {
    if (apiEnv.ENVIRONMENT !== 'test') {
      throw new Error(
        'TestEmailProvider should only be used in test environment.',
      );
    }
  }

  getName() {
    return 'test';
  }

  async sendEmail(message: EmailMessage): Promise<EmailResult> {
    TestEmailProvider.emailLog.push(message);
    return Promise.resolve(TestEmailProvider.mockResult);
  }

  async sendManyEmails(messages: EmailMessage[]): Promise<EmailResult> {
    messages.forEach((message) => this.sendEmail(message));
    return Promise.resolve(TestEmailProvider.mockResult);
  }
}
