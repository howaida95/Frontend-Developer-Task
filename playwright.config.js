import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const appUrl = process.env.APP_URL || 'http://localhost:5173';
const apiUrl = process.env.API_URL || 'http://localhost:4000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: isCI ? 2 : 0,
  reporter: isCI ? 'github' : 'html',

  use: {
    baseURL: appUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: [
    {
      command: 'npm run api',
      url: `${apiUrl}/api/auth/me`,
      reuseExistingServer: !isCI,
      timeout: 60_000,
    },
    {
      command: 'npm run dev -- --host localhost',
      url: appUrl,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
  ],
});
