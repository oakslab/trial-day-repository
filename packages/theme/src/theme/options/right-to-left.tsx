import { useEffect } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';

// ----------------------------------------------------------------------

type Props = {
  themeDirection: 'rtl' | 'ltr';
  children: React.ReactNode;
};

export function RTL({ children, themeDirection }: Props) {
  useEffect(() => {
    document.dir = themeDirection;
  }, [themeDirection]);

  const cacheRtl = createCache({
    key: 'rtl',
    prepend: true,
    stylisPlugins: [rtlPlugin],
  });

  if (themeDirection === 'rtl') {
    return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
  }

  return <>{children}</>;
}
