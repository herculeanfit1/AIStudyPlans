import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 30 * 1000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    actionTimeout: 15000,
    // Use environment variable BASE_URL for Docker compatibility
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  // Run tests in files in parallel
  fullyParallel: !process.env.CI,
  // In Docker, only use Chromium for stability
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use the system installed browser in Docker
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH,
        },
        // For visual tests, we need to allow for some pixel differences
        // due to differences in rendering across environments
        screenshot: {
          maxDiffPixelRatio: 0.05
        }
      },
    },
  ],
  // Use webServer to start dev server before tests when not running in Docker
  webServer: process.env.CI || process.env.DOCKER 
    ? undefined 
    : {
        command: 'npm run dev',
        port: 3000,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
      },
};

export default config; 