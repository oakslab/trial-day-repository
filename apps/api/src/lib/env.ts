import pick from 'lodash/pick';
import { z } from 'zod';

const environments = {
  PRODUCTION: 'production',
  STAGING: 'staging',
  DEV: 'development',
  LOCAL: 'local',
};

// Define the schema for environment variables
const envSchema = z.object({
  DATABASE_URL: z.string(),
  GOOGLE_CLOUD_PROJECT: z.string(),
  GOOGLE_CLOUD_REGION: z.string(),
  PORT: z.string().default('3001'),
  WEB_URL: z.string().default('http://localhost:3000'),
  ADMIN_URL: z.string().default('http://localhost:3003'),
  API_URL: z.string().default('http://localhost:3001'),
  FIREBASE_AUTH_EMULATOR_HOST: z.string().optional(),
  INVITATION_KEY_EXPIRES_IN_DAYS: z.coerce.number().default(15),
  SENTRY_DSN: z.string().optional(),
  ENVIRONMENT: z.nativeEnum(environments).optional().default(environments.DEV),
  ENABLE_TRACING: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().optional(),
  SENTRY_APP: z.string().optional(),
  USER_ASSETS_BUCKET: z.string(),
  MAIN_CLOUD_TASKS_QUEUE: z.string(),
  CLOUD_TASKS_SERVICE_ACCOUNT_EMAIL: z.string(),
  CLOUD_TASKS_HANDLER_URL: z.string().default('/api/trpc/examples.taskHandler'),
  EMAIL_PROVIDER: z
    .enum(['sendgrid', 'postmark', 'console', 'test'])
    .optional(),
  POSTMARK_API_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  FROM_EMAIL_ADDRESS: z.string().optional(),
  SLACK_BOT_TOKEN: z
    .string()
    .optional()
    .describe("Bot User OAuth Token, starting with 'xoxb-'"),
});

const parsedEnvResult = envSchema.safeParse(
  pick(process.env, Object.keys(envSchema.shape)),
);

if (!parsedEnvResult.success) {
  const detailedError = buildDetailedErrorMessage(parsedEnvResult.error);
  throw new Error(`Failed to load env config: ${detailedError}`);
}

function buildDetailedErrorMessage(error: z.ZodError<unknown>) {
  return error.issues
    .map((issue, index) => {
      const pathMessage =
        issue.path.length > 0 ? `(${issue.path.join(', ')})` : '';
      const description =
        issue.code === 'invalid_type'
          ? 'has an invalid type'
          : 'does not meet the requirement';
      const expectedType =
        'expected' in issue && issue.expected
          ? ` (expected ${issue.expected})`
          : '';
      const errorMessage = `${index + 1}) ${issue.message} '${pathMessage}' ${description}${expectedType}`;
      return `\x1b[31m${errorMessage}\x1b[0m`; // Red color for each error message
    })
    .join('\n');
}

export const apiEnv = parsedEnvResult.data;
