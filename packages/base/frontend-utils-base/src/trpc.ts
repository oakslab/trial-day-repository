import { getHttpHeaders } from '@base/common-base';
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type {
  inferRouterError,
  inferRouterInputs,
  inferRouterOutputs,
} from '@trpc/server';
import type { AppRouter } from 'api';
import superjson from 'superjson';
import { frontendEnv } from './env';

/**
 * Line below will be stripped out on run time build since it's type.
 */

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterError = inferRouterError<AppRouter>;

export const trpc = createTRPCNext<AppRouter>({
  config(_opts) {
    return {
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            // Change as you need on project
            retry: 0,
            cacheTime: 0,
            refetchOnWindowFocus: false,
          },
        },
      },
      links: [
        httpBatchLink({
          url: `${frontendEnv.NEXT_PUBLIC_API_URL}/api/trpc`,
          async headers() {
            return await getHttpHeaders();
          },
        }),
      ],
    };
  },
  ssr: false,
});
