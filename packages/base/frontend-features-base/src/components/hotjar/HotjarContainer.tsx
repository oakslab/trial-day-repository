import { useEffect, useRef } from 'react';
import { frontendEnv } from '@base/frontend-utils-base';
import { initHotjar } from '@base/frontend-utils-base/hotjar';

const HOTJAR_VERSION = 6 as const;

export type HotjarContainerProps = {
  siteId?: number;
};

export const HotjarContainer = (props?: HotjarContainerProps) => {
  const isHotjarEnabled = useRef(false);

  useEffect(() => {
    const siteId = frontendEnv.NEXT_PUBLIC_HOTJAR_SITE_ID ?? props?.siteId;

    if (isHotjarEnabled.current || !siteId) {
      return;
    }
    isHotjarEnabled.current = true;

    initHotjar({ siteId, hotjarVersion: HOTJAR_VERSION });
  }, []);

  return null;
};
