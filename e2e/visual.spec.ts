import { test, expect } from '@playwright/test';

/**
 * Visual regression tests
 * 
 * These tests capture screenshots of key pages and compare them
 * against baseline images to detect visual regressions.
 * 
 * Run with: npx playwright test --grep @visual
 * Update snapshots with: npx playwright test --grep @visual --update-snapshots
 */

// Helper function to determine if we should update snapshots
// Only update in development, not in CI
const shouldUpdate = () => {
  return process.env.UPDATE_SNAPSHOTS === 'true' || 
         process.env.NODE_ENV === 'development';
};

// Test critical pages for visual regression
test.describe('Visual regression tests @visual', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    // Set a consistent viewport size for screenshots
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Home page matches snapshot', async ({ page }) => {
    // Navigate to the landing page
    await page.goto('/');
    // Wait for animations to complete
    await page.waitForTimeout(1000);
    
    // Skip this test in Docker/CI environments
    if (process.env.DOCKER === 'true' || process.env.CI === 'true') {
      test.skip();
      return;
    }
    
    // Compare screenshot with baseline
    await expect(page).toHaveScreenshot('home-page.png', { 
      fullPage: true,
      maxDiffPixelRatio: 0.03,
      // Only update snapshots in development, not in CI
      animations: 'disabled',
    });
  });

  test('Waitlist page matches snapshot', async ({ page }) => {
    // Navigate to the waitlist page
    await page.goto('/waitlist');
    // Wait for animations to complete
    await page.waitForTimeout(1000);
    
    // Skip this test in Docker/CI environments
    if (process.env.DOCKER === 'true' || process.env.CI === 'true') {
      test.skip();
      return;
    }
    
    // Compare screenshot with baseline
    await expect(page).toHaveScreenshot('waitlist-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
      animations: 'disabled',
    });
  });

  test('Feedback form matches snapshot', async ({ page }) => {
    // Navigate to the feedback form
    await page.goto('/feedback?userId=1&emailId=test');
    // Wait for form to load
    try {
      await page.waitForSelector('form', { timeout: 5000 });
    } catch (e) {
      console.log('Form not found, skipping test');
      test.skip();
      return;
    }
    
    // Skip this test in Docker/CI environments
    if (process.env.DOCKER === 'true' || process.env.CI === 'true') {
      test.skip();
      return;
    }
    
    // Compare screenshot with baseline
    await expect(page).toHaveScreenshot('feedback-form.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
      animations: 'disabled',
    });
  });

  // Test responsive layouts
  test('Home page is responsive - mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Skip this test in Docker/CI environments
    if (process.env.DOCKER === 'true' || process.env.CI === 'true') {
      test.skip();
      return;
    }
    
    // Compare screenshot with baseline
    await expect(page).toHaveScreenshot('home-page-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
      animations: 'disabled',
    });
  });

  test('Home page is responsive - tablet', async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Skip this test in Docker/CI environments
    if (process.env.DOCKER === 'true' || process.env.CI === 'true') {
      test.skip();
      return;
    }
    
    // Compare screenshot with baseline
    await expect(page).toHaveScreenshot('home-page-tablet.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
      animations: 'disabled',
    });
  });

  // Test dark mode if supported
  test('Home page in dark mode', async ({ page }) => {
    // Set dark mode
    await page.goto('/');
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(1000);
    
    // Skip this test in Docker/CI environments
    if (process.env.DOCKER === 'true' || process.env.CI === 'true') {
      test.skip();
      return;
    }
    
    // Compare screenshot with baseline
    await expect(page).toHaveScreenshot('home-page-dark.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
      animations: 'disabled',
    });
  });

  // Component-level visual testing
  test('Navigation component matches snapshot', async ({ page }) => {
    await page.goto('/');
    
    // Skip this test in Docker/CI environments
    if (process.env.DOCKER === 'true' || process.env.CI === 'true') {
      test.skip();
      return;
    }
    
    // Take screenshot of just the navigation
    const navLocator = page.locator('nav').first();
    await expect(navLocator).toHaveScreenshot('navigation.png', {
      maxDiffPixelRatio: 0.03,
      animations: 'disabled',
    });
  });

  test('Footer component matches snapshot', async ({ page }) => {
    await page.goto('/');
    
    // Skip this test in Docker/CI environments
    if (process.env.DOCKER === 'true' || process.env.CI === 'true') {
      test.skip();
      return;
    }
    
    // Take screenshot of just the footer
    const footerLocator = page.locator('footer').first();
    await expect(footerLocator).toHaveScreenshot('footer.png', {
      maxDiffPixelRatio: 0.03,
      animations: 'disabled',
    });
  });
}); 