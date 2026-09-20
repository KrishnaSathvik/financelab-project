import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  outputDir: 'output/playwright/test-results',
  reporter: 'list',
  use: { baseURL: process.env.MONEYBASIS_TEST_URL ?? 'http://127.0.0.1:3101', channel: 'chrome', headless: true, trace: 'retain-on-failure' },
  webServer: process.env.MONEYBASIS_TEST_URL ? undefined : {
    command: 'npm run start -- --hostname 127.0.0.1 --port 3101',
    url: 'http://127.0.0.1:3101',
    reuseExistingServer: false,
  },
});
