import React, { useEffect, useTransition } from 'react';
// we are importing just type which is fine
// eslint-disable-next-line no-restricted-imports
import type { NextRouter } from 'next/router';
import { useAuth } from './authContext';
import { AUTH_BASE_ROUTE, authRoutes } from './authRoutes';

type StatelessCondition = (
  route: string,
  isLoggedIn: boolean,
) => string | undefined | false;

type StatefulCondition = (route: string) => string | undefined | null | false;

type Props = React.PropsWithChildren<{
  /**
   * Takes a route and flag whether user is logged in
   * Based on that determines where the user should be redirected
   * If no redirect is required returns undefined
   *
   * @example
   * ```ts
   *  <RedirectGuard conditions=[
   *  (route, isLoggedIn) => route === '/login' && isLoggedIn && '/dashboard'
   * ]><Component /></RedirectGuard>
   *
   *  <RedirectGuard loggedInRedirects=[
   *    (route) => route === '/login' && '/dashboard'
   *  ]><Component /></RedirectGuard>
   *
   *  <RedirectGuard loggedOutRedirects=[
   *    (route) => !['login', 'signup'].includes(route) && '/login'
   *  ]><Component /></RedirectGuard>
   * ```
   */
  conditions?: StatelessCondition[];
  loggedInRedirects?: StatefulCondition[];
  loggedOutRedirects?: StatefulCondition[];
  router: NextRouter;
  loadingNode?: React.ReactNode;
}>;

const NONE_ROUTE = Symbol('NONE_ROUTE');
const LOADING = Symbol('NONE_ROUTE');
const EMPTY_ARRAY = [] as const;

const UnwrappedRedirectGuard: React.FC<Props> = ({
  router,
  conditions = EMPTY_ARRAY,
  loggedInRedirects = EMPTY_ARRAY,
  loggedOutRedirects = EMPTY_ARRAY,
  loadingNode,
  children,
}) => {
  const { user, userProfile, claims, isLoadingUserProfile } = useAuth();
  const [routeToRedirect, setRouteToRedirect] = React.useState<
    Parameters<NextRouter['replace']>[0] | symbol
  >(LOADING);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      if (router.route === '/_error') return setRouteToRedirect(NONE_ROUTE);
      if (router.route === '/404') return setRouteToRedirect(NONE_ROUTE);
      if (isLoadingUserProfile) return setRouteToRedirect(NONE_ROUTE);

      const isLoggedIn = !!userProfile;
      const isVerified = !!user?.emailVerified;

      // Redirect from query "?redirect=" param
      const redirectFromQuery = router.query.redirect as string | undefined;
      if (userProfile && redirectFromQuery) {
        return setRouteToRedirect(
          decodeURIComponent(redirectFromQuery as string),
        );
      }

      // Verify email screen
      if (
        isLoggedIn &&
        !isVerified &&
        !router.route.startsWith(authRoutes.verifyEmailRequired) &&
        !router.route.startsWith(authRoutes.verifyEmailProcess) &&
        !claims?.original_user_id
      ) {
        return setRouteToRedirect(authRoutes.verifyEmailRequired);
      }

      for (const condition of conditions) {
        const newRoute = condition(router.route, isLoggedIn);
        if (newRoute) {
          return setRouteToRedirect(newRoute);
        }
      }

      const redirectConditions = isLoggedIn
        ? loggedInRedirects
        : loggedOutRedirects;

      for (const redirectCondition of redirectConditions) {
        const newRoute = redirectCondition(router.route);
        if (newRoute && router.route !== newRoute) {
          return setRouteToRedirect({
            pathname: newRoute,
            query:
              // Set up "?redirect=" param if a user is unathorized
              router.asPath !== '/' && !router.route.startsWith(AUTH_BASE_ROUTE)
                ? { redirect: encodeURIComponent(router.asPath) }
                : {},
          });
        }
      }

      setRouteToRedirect(NONE_ROUTE);
    });
  }, [
    router,
    conditions,
    loggedInRedirects,
    loggedOutRedirects,
    isLoadingUserProfile,
    userProfile,
    user,
    claims,
  ]);

  useEffect(() => {
    if (
      // typescript is not able to infer that routeToRedirect is not a symbol by using typeof
      // javascript runtime is not able to accept that routeToRedirect is not a symbol by using instanceof
      routeToRedirect instanceof Symbol ||
      typeof routeToRedirect === 'symbol'
    )
      return;

    startTransition(() => {
      router.replace(routeToRedirect);
    });
  }, [routeToRedirect, router]);

  // Still loading or redirecting
  if (
    (!userProfile && isLoadingUserProfile) ||
    routeToRedirect === LOADING ||
    routeToRedirect !== NONE_ROUTE
  ) {
    return loadingNode;
  }

  return children;
};

export const RedirectGuard = React.memo(UnwrappedRedirectGuard);
