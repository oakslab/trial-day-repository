import { TRPCError } from '@trpc/server';
import { Attachment, Client, Message, TemplatedMessage } from 'postmark';
import { apiEnv } from '../../../lib/env';
import {
  getEmailFromEmailRecipient,
  getEmailWithNameFromEmailRecipient,
} from '../utils';
import {
  EmailAttachment,
  EmailMessage,
  EmailProviderBase,
  EmailProviderConfig,
  EmailRecipient,
  EmailResult,
} from './email.provider';

type MessageSendingResponse = Awaited<ReturnType<Client['sendEmail']>>;

export class PostmarkProvider implements EmailProviderBase {
  private client: Client;

  constructor(config?: EmailProviderConfig) {
    const apiKey = apiEnv.POSTMARK_API_KEY ?? config?.apiKey;

    if (!apiKey) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Postmark API key is missing.',
      });
    }

    this.client = new Client(apiKey);
  }

  getName() {
    return 'postmark';
  }

  async sendEmail(message: EmailMessage) {
    const sendFunction = this.getPostmarkMethod([message]);
    return sendFunction([message]);
  }

  async sendManyEmails(messages: EmailMessage[]) {
    const sendFunction = this.getPostmarkMethod(messages);
    return sendFunction(messages);
  }

  private getPostmarkMethod(messages: EmailMessage[]) {
    const withTemplate = messages.filter((message) => 'template' in message);
    if (withTemplate.length !== 0 && withTemplate.length !== messages.length) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          'Postmark does not support sending emails with mixed templates and non-templates.',
      });
    }

    return withTemplate.length
      ? this.sendEmailsWithTemplate.bind(this)
      : this.sendEmailsWithoutTemplate.bind(this);
  }

  private async sendEmailsWithTemplate(messages: EmailMessage[]) {
    // Get list of the recipients (only from `To` attribute) for error handling purposes.
    const recipientEmailAddresses = messages
      .map((message) => message.to)
      .flat()
      .map(getEmailFromEmailRecipient);

    const result = await this.client.sendEmailBatchWithTemplates(
      messages.map((message) =>
        mapEmailMessageToPostmarkMessageWithTemplate(message),
      ),
    );

    return mapPostmarkResultToEmailResult(recipientEmailAddresses, result);
  }

  private async sendEmailsWithoutTemplate(messages: EmailMessage[]) {
    // Get list of the recipients (only from `To` attribute) for error handling purposes.
    const recipientEmailAddresses = messages
      .map((message) => message.to)
      .flat()
      .map(getEmailFromEmailRecipient);

    const result = await this.client.sendEmailBatch(
      messages.map((message) => mapEmailMessageToPostmarkMessage(message)),
    );

    return mapPostmarkResultToEmailResult(recipientEmailAddresses, result);
  }
}

function mapPostmarkResultToEmailResult(
  listOfRecipients: string[],
  result: MessageSendingResponse[],
): EmailResult {
  // According to the documentation, the `To` attribute is optional. We cannot rely on it. Instead, we try to
  // get `To` from success responses and compare it with the list of all recipients.
  // We still cannot pair recipient email address to a specific error message, but we can at least tell which
  // recipients failed.
  const successMessages = result.filter((r) => r.ErrorCode === 0);
  const failedRecipients = listOfRecipients.filter(
    (recipient) =>
      !successMessages.some((successfulRecipient) =>
        successfulRecipient.To?.includes(recipient),
      ),
  );
  const failedMessages = result.filter((r) => r.ErrorCode !== 0);

  return {
    success: failedRecipients.length === 0 && failedMessages.length === 0,
    failed: failedRecipients,
    meta: result,
  };
}

function mapRecipientToPostmark(recipients: EmailRecipient[] | undefined) {
  if (!recipients) {
    return undefined;
  }

  // Postmark expect a single string as a recipient. But we can pass multiple recipients separated by comma.
  return recipients.map(getEmailWithNameFromEmailRecipient).join(', ');
}

function mapAttachmentsToPostmark(attachments: EmailAttachment[] | undefined) {
  if (!attachments) {
    return undefined;
  }

  return attachments.map((attachment) => {
    return {
      Name: attachment.fileName,
      Content: attachment.data,
      ContentType: attachment.type,
      ContentID: attachment.contentId ?? null,
    } satisfies Attachment;
  });
}

function mapEmailMessageToPostmarkMessageBase(message: EmailMessage) {
  return {
    From: message.from,

    To: mapRecipientToPostmark(message.to),
    Cc: mapRecipientToPostmark(message.cc),
    Bcc: mapRecipientToPostmark(message.bcc),

    Attachment: mapAttachmentsToPostmark(message.attachments),
  };
}

// Note: Postmark expects, that `To`,`Bcc` and `Cc`  attributes are simple email address strings or objects
// with email and name. It does not support multiple recipients (there is a sendEmailBatch method for that).
// When calling this method, make sure that `To`,`Bcc` and `Cc` do contain only a single record.
function mapEmailMessageToPostmarkMessage(message: EmailMessage) {
  if (!('content' in message)) {
    throw new Error('Email message content is missing for postmark.');
  }

  let type: 'TextBody' | 'HtmlBody';
  if (message.content.type === 'text') {
    type = 'TextBody';
  } else if (message.content.type === 'html') {
    type = 'HtmlBody';
  } else {
    throw new Error(
      'Email message content type is not supported for postmark.',
    );
  }

  return {
    ...mapEmailMessageToPostmarkMessageBase(message),
    Subject: message.subject,
    [type]: message.content.value,
  } satisfies Message;
}

function mapEmailMessageToPostmarkMessageWithTemplate(message: EmailMessage) {
  if (!('template' in message)) {
    throw new Error('Email message template is missing for postmark.');
  }

  return {
    ...mapEmailMessageToPostmarkMessageBase(message),
    TemplateId:
      typeof message.template!.id === 'number'
        ? message.template?.id
        : undefined,
    TemplateAlias:
      typeof message.template!.id === 'string'
        ? message.template?.id
        : undefined,
    TemplateModel: message.template!.data as object,
  } satisfies TemplatedMessage;
}
