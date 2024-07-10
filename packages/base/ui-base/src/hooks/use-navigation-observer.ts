import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const throwFakeErrorToFoolNextRouter = () => {
  // Throwing an actual error class trips the Next.JS 500 Page, this string literal does not.
  throw ' 👍 Abort route change due to unsaved changes in form. Triggered by useNavigationObserver. Please ignore this error.';
};

interface NavigationObserverProps {
  shouldPreventNavigation: boolean | undefined;
  shouldFireBeforeUnload?: boolean;
  onNavigate: (nextUrl: string, wasStopped: boolean) => void;
}

export const useNavigationObserver = ({
  shouldPreventNavigation,
  shouldFireBeforeUnload,
  onNavigate,
}: NavigationObserverProps) => {
  const router = useRouter();
  const currentPath = router.asPath;
  const [forceNavigateInProgress, setForceNavigate] = useState(false);

  const killRouterEvent = useCallback(() => {
    router.events.emit('routeChangeError');
    throwFakeErrorToFoolNextRouter();
  }, [router]);

  const onRouteChange = useCallback(
    (url: string) => {
      if (
        shouldPreventNavigation &&
        url !== currentPath &&
        !forceNavigateInProgress
      ) {
        onNavigate(url, true);
        killRouterEvent();
      } else {
        onNavigate(url, false);
      }
    },
    [
      shouldPreventNavigation,
      currentPath,
      killRouterEvent,
      onNavigate,
      forceNavigateInProgress,
    ]
  );

  useEffect(() => {
    router.events.on('routeChangeStart', onRouteChange);

    return () => {
      router.events.off('routeChangeStart', onRouteChange);
    };
  }, [router.events, onRouteChange]);

  useEffect(() => {
    if (!shouldFireBeforeUnload) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldPreventNavigation) {
        event.preventDefault();
        event.returnValue =
          'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldPreventNavigation, shouldFireBeforeUnload]);

  return {
    forceRouterPush: async (url: string) => {
      const urlStrippedOfBasePath = url.startsWith(router.basePath)
        ? url.slice(router.basePath.length)
        : url;
      setForceNavigate(true);
      let error;
      try {
        // If we are redirecting to the base path, we need to add a trailing slash. Otherwise the
        // router tries to "reload" the current page.
        await router.push(
          urlStrippedOfBasePath.length === 0 ? '/' : urlStrippedOfBasePath
        );
      } catch (e) {
        error = e;
      } finally {
        setForceNavigate(false);
      }
      throw error;
    },
    forceNavigateInProgress,
  };
};
