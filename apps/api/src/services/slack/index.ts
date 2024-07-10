import { WebClient, KnownBlock, Block } from '@slack/web-api';
import { Service } from 'typedi';

import { apiEnv } from '../../lib/env';
import { LoggerService } from '../logger';
import { ChannelName, channels } from './util';

@Service()
export class SlackService {
  slack: WebClient;
  constructor(private logger: LoggerService) {
    this.slack = new WebClient(apiEnv.SLACK_BOT_TOKEN);
  }

  /**
   *
   * @param channel Channel Name
   * @param blocks Blocks from @slack/web-api
   * @param thread_ts if message will be added to a thread(on top of a message)
   * @returns
   */
  async sendBlockMessage(
    channel: ChannelName,
    blocks: (Block | KnownBlock)[],
    threadTs?: string,
  ) {
    const roomName = this.getRoomName(channel);
    try {
      return await this.slack.chat.postMessage({
        channel: roomName,
        blocks,
        thread_ts: threadTs,
      });
    } catch (e) {
      this.logger.warn((e as Error).message, {
        error: e,
      });
    }
  }

  /**
   *
   * @param message Text message to be sent
   * @param channel Channel Name
   * @param thread_ts if message will be added to a thread(on top of a message)
   * @returns
   */
  async sendMessage(message: string, channel: ChannelName, thread_ts?: string) {
    const roomName = this.getRoomName(channel);
    try {
      return await this.slack.chat.postMessage({
        text: message,
        channel: roomName,
        thread_ts,
      });
    } catch (e) {
      this.logger.warn((e as Error).message, {
        error: e,
      });
    }
  }

  private getRoomName(channel: ChannelName) {
    const channelConfig = channels[channel];
    return channelConfig[apiEnv.ENVIRONMENT as keyof typeof channelConfig];
  }
}
