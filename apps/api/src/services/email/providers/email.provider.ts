export type EmailResult =
  | {
      success: true;
    }
  | {
      success: false;
      failed: string[];
      meta: unknown;
    };

export type EmailRecipientObject = {
  email: string;
  name: string;
};

export type EmailRecipient = EmailRecipientObject | string;

export type EmailBody = {
  type: 'html' | 'text';
  value: string;
};

export type EmailTemplate = {
  id: string;
  data: Record<string, string>;
};

export type EmailAttachment = {
  fileName: string;
  data: string;
  contentId?: string;
  type: string;
};

type EmailMessageBase = {
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];

  from: string;
  attachments?: EmailAttachment[];
};

export type EmailMessageWithTemplate = EmailMessageBase & {
  template: EmailTemplate;
};

export type EmailMessageWithBody = EmailMessageBase & {
  subject: string;
  content: EmailBody;
};

export type EmailMessage = EmailMessageWithTemplate | EmailMessageWithBody;

export type EmailProviderConfig = {
  apiKey: string;
};

export interface EmailProviderBase {
  getName(): string;
  sendEmail(message: EmailMessage): Promise<EmailResult>;
  sendManyEmails(messages: EmailMessage[]): Promise<EmailResult>;
}
