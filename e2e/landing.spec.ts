import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display header and navigate to sections', async ({ page }) => {
    // Go to the landing page
    await page.goto('http://localhost:3000');
    
    // Check header elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText('AIStudyPlans')).toBeVisible();
    
    // Check navigation links
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'How It Works' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible();
    
    // Check hero section
    await expect(page.getByRole('heading', { name: /Your AI Study Partner/i })).toBeVisible();
    
    // Navigate to features section
    await page.getByRole('link', { name: 'Features', exact: true }).first().click();
    await expect(page.locator('#features')).toBeInViewport();
    
    // Navigate to pricing section
    await page.getByRole('link', { name: 'Pricing', exact: true }).first().click();
    await expect(page.locator('#pricing')).toBeInViewport();
    
    // Check CTA button
    await expect(page.getByRole('link', { name: 'Launch App' })).toBeVisible();
  });
  
  test('should show pricing tiers and toggle between annual/monthly', async ({ page }) => {
    // Go to the landing page
    await page.goto('http://localhost:3000');
    
    // Navigate to pricing section
    await page.getByRole('link', { name: 'Pricing', exact: true }).first().click();
    
    // Check pricing tiers
    await expect(page.getByRole('heading', { name: 'Basic' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pro' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Premium' })).toBeVisible();
    
    // Check "Most Popular" tag
    await expect(page.getByText('Most Popular')).toBeVisible();
    
    // Default should be annual pricing
    await expect(page.getByText('$6')).toBeVisible();
    await expect(page.getByText('$8')).toBeVisible();
    
    // Toggle to monthly pricing
    await page.locator('input[type="checkbox"]').check();
    
    // Check monthly pricing is displayed
    await expect(page.getByText('$8')).toBeVisible();
    await expect(page.getByText('$11')).toBeVisible();
  });
  
  test('should display footer with links', async ({ page }) => {
    // Go to the landing page
    await page.goto('http://localhost:3000');
    
    // Scroll to footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Check footer elements
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer').getByText('AIStudyPlans')).toBeVisible();
    
    // Check footer links
    await expect(page.locator('footer').getByText('Features')).toBeVisible();
    await expect(page.locator('footer').getByText('Company')).toBeVisible();
    await expect(page.locator('footer').getByText('Legal')).toBeVisible();
    
    // Check copyright
    const currentYear = new Date().getFullYear();
    await expect(page.getByText(`© ${currentYear} AIStudyPlans`)).toBeVisible();
  });
});

/**
 * Helper function to check if element is in viewport
 */
declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      toBeInViewport(): R;
    }
  }
}

expect.extend({
  async toBeInViewport(element: any) {
    const isInViewport = await element.evaluate((el: Element) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    });

    return {
      message: () => 
        `expected element to ${isInViewport ? 'not ' : ''}be in viewport`,
      pass: isInViewport,
    };
  },
}); 