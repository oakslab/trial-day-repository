import { AppEnvironments, NODE_ENVS } from '@base/common-base';

// Use the AppEnvironments enum to define the environment-specific room names
export type ChannelName = keyof typeof channels;
export const channels = {
  notification: {
    [NODE_ENVS.test]: 'reusability-slack-demo-test',
    [AppEnvironments.Dev]: 'reusability-slack-demo',
  },
} as const;
