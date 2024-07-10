import { authRoutesList } from '@base/auth-frontend-base';

export const allRoutes = {
  home: '/',
  settings: '/settings',
  errors: {
    notFound: '/404',
    serverError: '/500',
  },
} as const;

export type Route = (typeof allRoutes)[keyof typeof allRoutes];

export const publicRoutes: string[] = [...authRoutesList, allRoutes.home];

export const protectedRoutes: string[] = [allRoutes.home, allRoutes.settings];

export const errorRoutes: string[] = [
  allRoutes.errors.notFound,
  allRoutes.errors.serverError,
];
