// Custom type declarations for third-party libraries

// Extend Playwright types
import '@playwright/test';

declare module '@playwright/test' {
  namespace PlaywrightTest {
    interface PageScreenshotOptions {
      /**
       * Maximum allowed ratio of pixels that are different to the total amount of pixels, between 0 and 1.
       */
      maxDiffPixelRatio?: number;
    }
  }
} 