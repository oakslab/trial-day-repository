import pick from 'lodash/pick';
import { z } from 'zod';
import * as dotenv from 'dotenv';

const environments = {
  PRODUCTION: 'production',
  STAGING: 'staging',
  DEV: 'development',
  LOCAL: 'local',
};

// Define the schema for environment variables
const envSchema = z.object({
  WEB_URL: z.string().default('http://localhost:3000'),
  ADMIN_PORTAL_URL: z.string().default('http://localhost:3003'),
  TEST_USER_EMAIL: z.string(),
  TEST_USER_PASSWORD: z.string(),
  TEST_ADMIN_EMAIL: z.string(),
  TEST_ADMIN_PASSWORD: z.string(),
  QASE_API_TOKEN: z.string().optional(),
  QASE_PROJECT_CODE: z.string().optional(),
  QASE_RUN_COMPLETE: z.string().optional(),
  QASE_RUN_ID: z.string().optional(),
  QASE_ENVIRONMENT: z
    .nativeEnum(environments)
    .optional()
    .default(environments.LOCAL),
});

// dotenv is here as I need to load the env variables from the .env file before accessing them
dotenv.config({ path: ['.env', '.env.local'] });

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

export const testEnv = parsedEnvResult.data;
