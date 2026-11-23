import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on',
    ...devices['Desktop Chrome'],
  },
  webServer: [
    {
      command: 'npm run dev',
      cwd: '..',
      url: 'http://localhost:3001/health',
      reuseExistingServer: true,
    },
    {
      command: 'npm run dev:frontend',
      cwd: '..',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
    },
  ],
})
