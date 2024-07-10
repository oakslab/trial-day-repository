import sendgrid from '@sendgrid/mail';
import {
  EmailMessage,
  EmailMessageWithBody,
  EmailMessageWithTemplate,
} from './email.provider';
import { clearAllMocks } from './mocks';
import { SendgridProvider } from './sendgrid.provider';

const testingEmail = 'boilerplate@oaks.xyz';
describe('Sendgrid Email Provider', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  const provider = new SendgridProvider({
    apiKey: 'sendgrid-key',
  });

  it('accepts simple email without template', () => {
    const messageData: EmailMessage = {
      to: ['john@doe.net'],
      from: testingEmail,
      subject: 'Hello, John!',
      content: {
        type: 'text',
        value: 'Hello, John! How are you?',
      },
    };

    provider.sendEmail(messageData);
    expect(sendgrid.send).toHaveBeenLastCalledWith({
      to: messageData.to,
      from: messageData.from,
      subject: messageData.subject,
      content: [
        {
          type: 'text',
          value: messageData.content.value,
        },
      ],
    });
  });

  it('accepts email with template', () => {
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

    provider.sendEmail(messageData);
    expect(sendgrid.send).toHaveBeenLastCalledWith({
      to: messageData.to,
      from: messageData.from,
      templateId: messageData.template.id,
      dynamicTemplateData: messageData.template.data,
    });
  });

  it('accepts multiple emails', () => {
    const messageData: EmailMessage[] = [
      {
        to: [
          {
            email: 'test@nonexisting.com',
            name: 'John Doe',
          },
          'another person',
        ],
        from: testingEmail,
        subject: 'Hello, people!',
        content: {
          type: 'text',
          value: 'Hello, people! How are you?',
        },
      },
      {
        to: ['another@test.com'],
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

    provider.sendManyEmails(messageData);
    const messageWithBody = messageData[0] as EmailMessageWithBody;
    const messageWithTemplate = messageData[1] as EmailMessageWithTemplate;
    expect(sendgrid.send).toHaveBeenLastCalledWith(
      [
        {
          to: messageWithBody.to,
          from: messageWithBody.from,
          subject: messageWithBody.subject,
          content: [messageWithBody.content],
        },
        {
          to: messageWithTemplate.to,
          from: messageWithTemplate.from,
          templateId: messageWithTemplate.template.id,
          dynamicTemplateData: messageWithTemplate.template.data,
        },
      ],
      true, // Signify that we are sending multiple emails
    );
  });
});
