import { defineConfig, devices } from '@playwright/test';

const appUrl = process.env.APP_URL || 'http://localhost:5173';
const apiUrl = process.env.API_URL || 'http://localhost:4000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'html',

  use: {
    baseURL: appUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: [
    {
      command: 'node mock-api/server.mjs',
      url: `${apiUrl}/api/auth/me`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev -- --host localhost',
      url: appUrl,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
