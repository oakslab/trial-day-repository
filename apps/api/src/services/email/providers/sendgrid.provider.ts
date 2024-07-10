import sendgrid from '@sendgrid/mail';

import { TRPCError } from '@trpc/server';
import { apiEnv } from '../../../lib/env';
import {
  EmailMessage,
  EmailProviderBase,
  EmailProviderConfig,
  EmailResult,
} from './email.provider';

export class SendgridProvider implements EmailProviderBase {
  constructor(config?: EmailProviderConfig) {
    const apiKey = apiEnv.SENDGRID_API_KEY ?? config?.apiKey;

    if (!apiKey) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Sendgrid API key is missing.',
      });
    }

    sendgrid.setApiKey(apiKey);
  }

  getName() {
    return 'sendgrid';
  }

  async sendEmail(message: EmailMessage): Promise<EmailResult> {
    const sendgridMessage = this.mapEmailMessageToSendgridMessage(message);

    try {
      const result = await sendgrid.send(sendgridMessage);
      return this.mapSendgridResponseToEmailResult(result[0]);
    } catch (error) {
      return {
        success: false,
        failed: [],
        meta: error,
      };
    }
  }

  async sendManyEmails(messages: EmailMessage[]): Promise<EmailResult> {
    const sendgridMessages = messages.map((message) =>
      this.mapEmailMessageToSendgridMessage(message),
    );

    try {
      const result = await sendgrid.send(sendgridMessages, true);
      return this.mapSendgridResponseToEmailResult(result[0]);
    } catch (error) {
      return {
        success: false,
        failed: [],
        meta: error,
      };
    }
  }

  private mapSendgridResponseToEmailResult(
    result: sendgrid.ClientResponse,
  ): EmailResult {
    return {
      success: `${result.statusCode}`.startsWith('2'),
      failed: [],
      meta: result,
    };
  }

  private mapEmailMessageToSendgridMessage(
    message: EmailMessage,
  ): sendgrid.MailDataRequired {
    const baseData = {
      to: message.to,
      ...(message.cc ? { cc: message.cc } : {}),
      ...(message.bcc ? { bcc: message.bcc } : {}),
      from: message.from,
    };

    if ('template' in message) {
      return {
        ...baseData,
        templateId: message.template.id,
        dynamicTemplateData: message.template.data,
      };
    }

    return {
      ...baseData,
      subject: message.subject,
      content: [message.content],
    };
  }
}
