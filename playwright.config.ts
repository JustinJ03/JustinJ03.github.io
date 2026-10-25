import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:4321${process.env.BASE_PATH || ''}/`,
    channel: process.platform === 'win32' ? 'msedge' : undefined,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    url: `http://127.0.0.1:4321${process.env.BASE_PATH || ''}/`,
    reuseExistingServer: false,
  },
});
