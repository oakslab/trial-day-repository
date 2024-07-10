import { z } from 'zod';

export const AppEnvironments = {
  Production: 'PRODUCTION',
  Staging: 'STAGING',
  Dev: 'DEV',
  Local: 'LOCAL',
} as const;

export const NODE_ENVS = {
  production: 'production',
  development: 'development',
  test: 'test',
  ci: 'ci',
} as const;

export const commonEnv = z
  .object({
    APP_ENV: z
      .nativeEnum(AppEnvironments)
      .optional()
      .default(AppEnvironments.Local),
    NODE_ENV: z.nativeEnum(NODE_ENVS).optional().default(NODE_ENVS.development),
    GOOGLE_CLOUD_PROJECT: z.string().optional(),
    USER_ASSETS_BUCKET: z.string().optional(),
  })
  .parse({
    APP_ENV: process.env.APP_ENV,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
    USER_ASSETS_BUCKET: process.env.USER_ASSETS_BUCKET,
  });
