import sendgrid from '@sendgrid/mail';
import { apiEnv } from '../../../lib/env';
import { EmailProviderEnum } from '.';

// Mock a successful response from Postmark
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postmarkClientMockResponse = (...messages: any[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return messages[0].flatMap((message: any) => {
    const recipients = message.To.split(',').map((recipient: string) =>
      recipient.trim(),
    );

    return recipients.map((recipient: string) => ({
      ErrorCode: 0,
      To: recipient,
    }));
  });
};

// Make sure we are not sending out any emails
// and that the libraries don't complain about the missing API key.
export const postmarkClientMock = {
  sendEmail: jest.fn((...args: unknown[][]) =>
    postmarkClientMockResponse(...args),
  ),
  sendEmailBatch: jest.fn((...args: unknown[][]) =>
    postmarkClientMockResponse(...args),
  ),
  sendEmailWithTemplate: jest.fn((...args: unknown[][]) =>
    postmarkClientMockResponse(...args),
  ),
  sendEmailBatchWithTemplates: jest.fn((...args: unknown[][]) =>
    postmarkClientMockResponse(...args),
  ),
};

jest.mock('postmark', () => {
  return {
    ...jest.requireActual('postmark'),
    Client: function () {
      return postmarkClientMock;
    },
  };
});

sendgrid.setApiKey = jest.fn();
sendgrid.send = jest.fn(() =>
  Promise.resolve([{ statusCode: 202, body: {}, headers: [] }, {}]),
);

export const sendgridMock = sendgrid;

export const mockEnv = (provider?: EmailProviderEnum, apiKey?: string) => {
  apiEnv.POSTMARK_API_KEY =
    provider === EmailProviderEnum.Postmark ? apiKey : undefined;
  apiEnv.SENDGRID_API_KEY =
    provider === EmailProviderEnum.Sendgrid ? apiKey : undefined;
  apiEnv.EMAIL_PROVIDER = provider;
};

export const clearAllMocks = () => {
  Object.values(postmarkClientMock).forEach((mock) => mock.mockClear());
  (sendgrid.setApiKey as jest.Mock<unknown>).mockClear();
  (sendgrid.send as jest.Mock<unknown>).mockReset();
};
