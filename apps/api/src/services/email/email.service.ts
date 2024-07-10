import { Service } from 'typedi';
import { LoggerService } from '..';
import { getEmailProviderFromEnv } from './providers';
import { EmailMessage, EmailResult } from './providers/email.provider';

@Service()
export class EmailService extends getEmailProviderFromEnv() {
  constructor(private logger: LoggerService) {
    super();
  }

  getProviderName(): string {
    return this.getName();
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    const result = await super.sendEmail(message);
    if (!result.success) {
      this.logger.error('Failed to send email', result);
    }

    this.logger.info('Email sent successfully', {
      provider: this.getProviderName(),
      message,
    });

    return result;
  }

  async sendManyEmails(messages: EmailMessage[]): Promise<EmailResult> {
    const result = await super.sendManyEmails(messages);
    if (!result.success) {
      this.logger.error('Failed to send emails', result);
    }

    this.logger.info('Emails sent successfully', {
      provider: this.getProviderName(),
      messages,
    });

    return result;
  }
}
