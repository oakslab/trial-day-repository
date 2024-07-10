import { testEnv } from './env';
import { defineConfig, devices } from '@playwright/test';

export const getBaseConfig = (
  projectName: string,
): Parameters<typeof defineConfig>[0] => {
  return {
    use: {
      trace: 'on-first-retry',
      video: 'retain-on-failure', // Record video for failing tests only
    },

    projects: [
      {
        name: projectName,
        testDir: './src/tests',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
    reporter:
      testEnv.QASE_API_TOKEN && testEnv.QASE_PROJECT_CODE
        ? [
            ['list', { outputFolder: 'html-report', open: 'never' }],
            [
              'playwright-qase-reporter',
              {
                environment: testEnv.QASE_ENVIRONMENT || 'localhost',
                testops: {
                  api: {
                    token: testEnv.QASE_API_TOKEN || undefined,
                  },
                  project: testEnv.QASE_PROJECT_CODE || undefined,
                  uploadAttachments: true,
                  run: {
                    complete:
                      testEnv.QASE_RUN_COMPLETE != undefined
                        ? testEnv.QASE_RUN_COMPLETE
                        : true,
                    id: testEnv.QASE_RUN_ID || undefined,
                  },
                },
              },
            ],
          ]
        : [['list', { outputFolder: 'html-report', open: 'never' }]],
  };
};
