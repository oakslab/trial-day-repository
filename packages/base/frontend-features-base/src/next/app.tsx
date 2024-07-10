import { useEffect, useMemo, useState } from 'react';
import {
  AUTH_BASE_ROUTE,
  AuthContext,
  RedirectGuard,
  authRoutes,
  useAuthSetup,
} from '@base/auth-frontend-base';
import { ACCEPT_INVITATION_ROUTE_PREFIX } from '@base/common-base';
import {
  trpc,
  frontendEnv,
  trackExceptionInSentry,
} from '@base/frontend-utils-base';
import { MotionLazy } from '@base/ui-base/components/animate';
import { ErrorSkeleton } from '@base/ui-base/components/error-skeleton';
import { JiraBadge, PathMetadata } from '@base/ui-base/components/jira';
import { SplashScreen } from '@base/ui-base/components/loading-screen';
import { ProgressBar } from '@base/ui-base/components/progress-bar';
import { SettingsProvider } from '@base/ui-base/components/settings/context';
import { SnackbarProvider } from '@base/ui-base/components/snackbar';
import { LocalizationProvider } from '@base/ui-base/locales/index';
import { ThemeProvider } from '@base/ui-base/ui';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { AppProps } from 'next/app';
import { Roboto } from 'next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ErrorBoundary } from 'react-error-boundary';
import { HotjarContainer } from '../components/hotjar/HotjarContainer';
import { QueryParamProvider } from '../components/query-params-provider';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

interface NextAppProps {
  props: AppProps;
  pageFaviconUrl: string;
  pageFaviconDarkUrl: string;
  pathMetadataList: PathMetadata[];
  publicRoutes?: string[];
  wrapComponent?: (node: React.ReactNode) => React.ReactNode;
}

const baseLoggedInRedirect = (route: string) => {
  if (
    route.startsWith(authRoutes.login) ||
    route.startsWith(authRoutes.signup)
  ) {
    return '/';
  }
};

const baseLoggedOutRedirect = (route: string) => {
  if (
    !route.startsWith(AUTH_BASE_ROUTE) &&
    !route.startsWith(ACCEPT_INVITATION_ROUTE_PREFIX)
  ) {
    return authRoutes.login;
  }
};

export default function NextApp({
  props,
  pageFaviconUrl,
  pageFaviconDarkUrl,
  pathMetadataList,
  publicRoutes,
  wrapComponent,
}: NextAppProps) {
  const router = useRouter();
  const { Component, pageProps } = props;
  const { refetch } = trpc.authentication.me.useQuery(undefined, {
    enabled: false,
  });
  const { mutateAsync: signup, isLoading } =
    trpc.authentication.signup.useMutation();
  const { mutateAsync: sendVerificationEmail } =
    trpc.authentication.sendVerificationEmail.useMutation();
  const { mutateAsync: sendResetPasswordEmail } =
    trpc.authentication.sendResetPasswordEmail.useMutation();
  const invalidateCache = trpc.useUtils().invalidate;

  const authService = useAuthSetup({
    sendVerificationEmail,
    sendResetPasswordEmail,
    fetchUser: refetch,

    signupUser: signup,
    isSigningUp: isLoading,
    invalidateCache: invalidateCache,
    trackExceptionInSentry,
    hostUrl: frontendEnv.NEXT_PUBLIC_API_URL,
    apiUrl: frontendEnv.NEXT_PUBLIC_API_URL,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [loggedInRedirects, loggedOutRedirects] = useMemo(() => {
    return [
      [
        (route: string) =>
          !publicRoutes?.includes(route) && baseLoggedInRedirect(route),
      ],
      [
        (route: string) =>
          !publicRoutes?.includes(route) && baseLoggedOutRedirect(route),
      ],
    ];
  }, [publicRoutes]);

  return (
    <AppCacheProvider {...props}>
      <Head>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
        <link
          href={pageFaviconDarkUrl}
          media="(prefers-color-scheme: light)"
          rel="icon"
          sizes="32x32"
        />
        <link
          href={pageFaviconUrl}
          media="(prefers-color-scheme: dark)"
          rel="icon"
          sizes="32x32"
        />
      </Head>
      <main className={roboto.className}>
        <QueryParamProvider>
          <SettingsProvider
            defaultSettings={{
              themeMode: 'light', // 'light' | 'dark'
              themeDirection: 'ltr', //  'rtl' | 'ltr'
              themeContrast: 'default', // 'default' | 'bold'
              themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
              themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
              themeStretch: false,
            }}
          >
            <ThemeProvider>
              <SnackbarProvider>
                <AuthContext.Provider value={authService}>
                  <LocalizationProvider>
                    <MotionLazy>
                      <RedirectGuard
                        router={router}
                        loggedInRedirects={loggedInRedirects}
                        loggedOutRedirects={loggedOutRedirects}
                        loadingNode={<SplashScreen />}
                      >
                        <ErrorBoundary FallbackComponent={ErrorSkeleton}>
                          {!isMounted && <SplashScreen />}
                          <div
                            style={{
                              display: isMounted ? 'block' : 'none',
                            }}
                          >
                            <ProgressBar />
                            <JiraBadge pathMetadataList={pathMetadataList} />
                            {wrapComponent ? (
                              wrapComponent(<Component {...pageProps} />)
                            ) : (
                              <Component {...pageProps} />
                            )}
                          </div>
                        </ErrorBoundary>
                      </RedirectGuard>
                    </MotionLazy>
                  </LocalizationProvider>
                </AuthContext.Provider>
              </SnackbarProvider>
            </ThemeProvider>
          </SettingsProvider>
        </QueryParamProvider>
        <HotjarContainer />
      </main>
    </AppCacheProvider>
  );
}
