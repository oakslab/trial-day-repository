import './lib/env';
import { userRouter } from './domains/user/user.router';
import { authenticationRouter } from './routers/authentication/authentication.router';
import { examplesRouter } from './routers/examples/examples.router';
import { healthRouter } from './routers/health/health.router';
import { postRouter } from './domains/post/post.router';
// turbo-generator:placeholder:app:imports
import { router } from './trpc';

export const appRouter = router({
  health: healthRouter,
  examples: examplesRouter,
  authentication: authenticationRouter,
  user: userRouter,
  post: postRouter,
  // turbo-generator:placeholder:app:router
});

export type AppRouter = typeof appRouter;

/**
 * To prevent: "Inferred type cannot be named"
 * https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
 */
export * from '@base/common-base';
export * from 'typedi';
export * from '@base/auth-backend-base';
export * from './trpc/types';
