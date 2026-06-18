import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.QA_BASE_URL || process.env.BASE_URL || 'https://exanh.online'
const isCI = !!process.env.CI
const chromiumExecutablePath = process.env.QA_CHROMIUM_PATH || process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
const videoMode = process.env.QA_DISABLE_VIDEO === '1' ? 'off' : 'retain-on-failure'
const launchOptions = {
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  ...(chromiumExecutablePath ? { executablePath: chromiumExecutablePath } : {}),
}

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL,
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: videoMode,
    ignoreHTTPSErrors: true,
    locale: 'vi-VN',
    launchOptions,
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
  ],
})
