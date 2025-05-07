import 'playwright';

/**
 * Custom type declarations to extend Playwright types
 */
declare module 'playwright' {
  interface PageScreenshotOptions {
    /**
     * Maximum allowed ratio of pixels that are different to the total amount of pixels, between 0 and 1.
     */
    maxDiffPixelRatio?: number;
  }
} 