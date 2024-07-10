/* eslint-disable turbo/no-undeclared-env-vars */
import { z } from 'zod';

const frontendEnvSchema = z.object({
  NEXT_PUBLIC_APPLICATION_NAME: z.string().default('Boilerplate'),
  NEXT_PUBLIC_API_URL: z.string().optional().default('http://localhost:3001'),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_ENVIRONMENT: z.string().optional(),
  NEXT_PUBLIC_SENTRY_ORG: z.string().optional(),
  NEXT_PUBLIC_SENTRY_PROJECT: z.string().optional(),
  NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().optional(),
  NEXT_PUBLIC_SENTRY_APP: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
  NEXT_PUBLIC_HOTJAR_SITE_ID: z.coerce.number().optional(),
});

export const frontendEnv = frontendEnvSchema.parse({
  NEXT_PUBLIC_APPLICATION_NAME: process.env.NEXT_PUBLIC_APPLICATION_NAME,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  NEXT_PUBLIC_SENTRY_ORG: process.env.NEXT_PUBLIC_SENTRY_ORG,
  NEXT_PUBLIC_SENTRY_PROJECT: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
  NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE:
    process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
  NEXT_PUBLIC_SENTRY_APP: process.env.NEXT_PUBLIC_SENTRY_APP,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_HOTJAR_SITE_ID: process.env.NEXT_PUBLIC_HOTJAR_SITE_ID,
});
