import {
  EmailMessage,
  EmailMessageWithTemplate,
  EmailMessageWithBody,
  EmailRecipientObject,
} from './email.provider';

// must come before the import of the provider
import { postmarkClientMock, clearAllMocks } from './mocks';
import { PostmarkProvider } from './postmark.provider';

const testingEmail = 'boilerplate@oaks.xyz';
describe('Postmark Email Provider', () => {
  const provider = new PostmarkProvider({
    apiKey: 'postmark-key',
  });

  beforeEach(() => {
    clearAllMocks();
  });

  it('should send single email as plaintext', async () => {
    const messageData: EmailMessage = {
      to: ['john+simple@doe.net'],
      from: testingEmail,
      subject: 'Hello, John!',
      content: {
        type: 'text',
        value: 'Hello, John! How are you?',
      },
    };

    const emailResult = await provider.sendEmail(messageData);

    expect(emailResult.success).toBe(true);

    expect(postmarkClientMock.sendEmailBatch).toHaveBeenLastCalledWith([
      expect.objectContaining({
        From: testingEmail,
        Subject: messageData.subject,
        TextBody: messageData.content.value,
        To: messageData.to[0],
      }),
    ]);
  });

  it('should send single email with template', async () => {
    const messageData = {
      to: ['john@doe.net'],
      from: testingEmail,
      subject: 'Hello, John!',
      template: {
        id: 'template-id',
        data: {
          name: 'John',
        },
      },
    } satisfies EmailMessage;

    const emailResult = await provider.sendEmail(messageData);

    expect(emailResult.success).toBe(true);

    expect(
      postmarkClientMock.sendEmailBatchWithTemplates,
    ).toHaveBeenLastCalledWith([
      expect.objectContaining({
        From: testingEmail,
        TemplateAlias: messageData.template.id,
        TemplateModel: messageData.template.data,
        To: messageData.to[0],
      }),
    ]);
  });

  it('should send multiple emails with templates', async () => {
    const messageData: EmailMessageWithTemplate[] = [
      {
        to: [
          {
            email: 'test@nonexisting.com',
            name: 'John Doe',
          },
          'another person',
        ],
        from: testingEmail,
        template: {
          id: 'template-id',
          data: {
            variable: 'We are using templates here!',
          },
        },
      },
      {
        to: ['another@test.com'],
        from: testingEmail,
        template: {
          id: 'another-template-id',
          data: {
            variable: 'We are using templates!',
          },
        },
      },
    ];

    const emailRecipientObject = messageData[0]?.to[0] as EmailRecipientObject;

    const emailResult = await provider.sendManyEmails(messageData);

    expect(emailResult.success).toBe(true);

    expect(postmarkClientMock.sendEmailBatchWithTemplates).toHaveBeenCalledWith(
      [
        {
          From: testingEmail,
          To: `${emailRecipientObject.name} <${emailRecipientObject.email}>, ${messageData[0]?.to[1]}`,
          TemplateAlias: messageData[0]?.template.id,
          TemplateModel: {
            variable: messageData[0]?.template.data.variable,
          },
        },
        {
          From: testingEmail,
          To: messageData[1]?.to[0],
          TemplateAlias: messageData[1]?.template.id,
          TemplateModel: {
            variable: messageData[1]?.template.data.variable,
          },
        },
      ],
    );
  });

  it('should send multiple emails as plaintext', async () => {
    const messageData: EmailMessageWithBody[] = [
      {
        to: ['test@here.com'],
        from: testingEmail,
        subject: 'Hello, people!',
        content: {
          type: 'text',
          value: 'Hello, people! How are you?',
        },
      },
      {
        to: ['test@there.com'],
        from: testingEmail,
        subject: 'Hello, another person!',
        content: {
          type: 'text',
          value: 'Hello, another person! How are you?',
        },
      },
    ];

    const emailResult = await provider.sendManyEmails(messageData);

    expect(emailResult.success).toBe(true);

    expect(postmarkClientMock.sendEmailBatch).toHaveBeenCalledWith([
      expect.objectContaining({
        From: testingEmail,
        Subject: messageData[0]?.subject,
        TextBody: messageData[0]?.content.value,
        To: messageData[0]?.to[0],
      }),
      expect.objectContaining({
        From: testingEmail,
        Subject: messageData[1]?.subject,
        TextBody: messageData[1]?.content?.value,
        To: messageData[1]?.to[0],
      }),
    ]);
  });

  it('should throw an error when mix of templates and plaintext is used', async () => {
    const messageData: EmailMessage[] = [
      {
        to: ['shouldfail@test.com'],
        from: testingEmail,
        subject: 'Hello, people!',
        content: {
          type: 'text',
          value: 'Hello, people! How are you?',
        },
      },
      {
        to: ['shouldreallyfail@test.com'],
        from: testingEmail,
        subject: 'Hello, another person!',
        template: {
          id: 'another-template-id',
          data: {
            variable: 'We are using templates!',
          },
        },
      },
    ];

    await expect(provider.sendManyEmails(messageData)).rejects.toThrow();
  });
});
