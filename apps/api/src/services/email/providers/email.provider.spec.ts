import { EmailMessageWithBody } from './email.provider';
import { mockEnv, sendgridMock } from './mocks';
import { EmailProviderEnum, getEmailProviderFromEnv } from './index';

describe('Email Provider Selection', () => {
  it('fails if no provider is selected', () => {
    mockEnv(undefined, undefined);
    expect(() => getEmailProviderFromEnv()).toThrow();
  });
});

describe('Email Provider Selection', () => {
  beforeAll(() => {
    mockEnv(EmailProviderEnum.Sendgrid, 'SG.sendgrid-key');
  });

  it('returns provider set up in environment variables', () => {
    const Provider = getEmailProviderFromEnv();
    expect(new Provider().getName()).toBe(EmailProviderEnum.Sendgrid);
  });

  it('calls correct send function', async () => {
    const Provider = getEmailProviderFromEnv();
    const provider = new Provider();
    const messageData: EmailMessageWithBody = {
      to: ['test@sendgrid.com'],
      from: 'test@test.com',
      subject: 'Hello, John!',
      content: {
        type: 'text',
        value: 'Hello, John! How are you?',
      },
    };

    await provider.sendEmail(messageData);

    expect(sendgridMock.send).toHaveBeenCalled();
  });
});
