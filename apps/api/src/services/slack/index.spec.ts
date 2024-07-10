import { useTestEnvironment } from '../../../tests/test-environment';
import { LoggerService } from '../logger';
import { SlackService } from '.';

const mockedSlack = {
  chat: {
    postMessage: jest.fn(),
    sendBlockMessage: jest.fn(),
  },
};

jest.mock('@slack/web-api', () => {
  return { WebClient: jest.fn(() => mockedSlack) };
});

describe('Slack Service', () => {
  const { container } = useTestEnvironment();

  const logger = container.get(LoggerService);

  const slackService = new SlackService(logger);

  it('send message integration', async () => {
    await slackService.sendMessage('test', 'notification');

    expect(mockedSlack.chat.postMessage).toHaveBeenCalledWith({
      channel: 'reusability-slack-demo-test',
      text: 'test',
    });
  });

  it('send block message integration', async () => {
    await slackService.sendBlockMessage('notification', [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'test',
        },
      },
    ]);

    expect(mockedSlack.chat.postMessage).toHaveBeenCalledWith({
      channel: 'reusability-slack-demo-test',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'test',
          },
        },
      ],
    });
  });
});
