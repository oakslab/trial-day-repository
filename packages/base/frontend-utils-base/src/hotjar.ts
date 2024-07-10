import Hotjar from '@hotjar/browser';

export type HotjarProviderConfig = {
  siteId: number;
  hotjarVersion: number;
};

export const initHotjar = (config: HotjarProviderConfig) => {
  const { siteId, hotjarVersion } = config;

  return Hotjar.init(siteId, hotjarVersion);
};
