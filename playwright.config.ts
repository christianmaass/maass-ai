import { defineConfig, devices } from '@playwright/test';
import { testEnv } from '@/lib/config/env.test';

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!testEnv.CI,
  retries: testEnv.CI ? 2 : 0,
  workers: testEnv.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !testEnv.CI,
  },
});
