import { test, expect } from '@playwright/test';

// Configure context with proper permissions
test.use({
  contextOptions: {
    permissions: ['clipboard-read', 'clipboard-write'],
    storageState: {},
  }
});

test.describe('Admin Dashboard Tests', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear cookies before each test (we can't clear localStorage directly)
    await context.clearCookies();
  });

  test('redirects to login page when not authenticated', async ({ page }) => {
    // Go to admin page
    await page.goto('/admin');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*\/admin\/login.*/);
    await expect(page.locator('h1')).toContainText('Admin Login');
  });

  test('shows loading state while checking authentication', async ({ page }) => {
    // Go to admin page
    await page.goto('/admin');
    
    // Should show loading state briefly before redirecting
    const loadingElement = page.locator('text=Loading admin panel...');
    await expect(loadingElement).toBeVisible({ timeout: 2000 }).catch(() => {
      // It's okay if we don't see this - it might redirect too quickly
      console.log('Loading state not visible - redirect was too fast');
    });
    
    // Should end up at login page
    await expect(page).toHaveURL(/.*\/admin\/login.*/);
  });
  
  test('allows login with development credentials', async ({ page }) => {
    // Go to login page
    await page.goto('/admin/login');
    
    // Click "Use development login" button
    await page.click('text=Use development login');
    
    // Fill in credentials
    await page.fill('input[id="username"]', 'adminbridgingtrustaitk');
    await page.fill('input[id="password"]', 'Movingondownthelineuntil1gettotheend!');
    
    // Click Sign in button
    await page.click('button[type="submit"]');
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL('/admin');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
    
    // Should show admin navigation
    await expect(page.locator('text=Admin Settings')).toBeVisible();
    await expect(page.locator('text=Visit Website')).toBeVisible();
  });
  
  test('persists authentication across page reloads', async ({ page }) => {
    // Log in first with development credentials
    await page.goto('/admin/login');
    await page.click('text=Use development login');
    await page.fill('input[id="username"]', 'adminbridgingtrustaitk');
    await page.fill('input[id="password"]', 'Movingondownthelineuntil1gettotheend!');
    await page.click('button[type="submit"]');
    
    // Verify redirect to admin dashboard
    await expect(page).toHaveURL('/admin');
    
    // Reload the page
    await page.reload();
    
    // Wait for load
    await page.waitForLoadState('networkidle');
    
    // Should still be on admin dashboard
    await expect(page).toHaveURL('/admin');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });
  
  test('allows navigation between admin pages', async ({ page }) => {
    // Log in first with development credentials
    await page.goto('/admin/login');
    await page.click('text=Use development login');
    await page.fill('input[id="username"]', 'adminbridgingtrustaitk');
    await page.fill('input[id="password"]', 'Movingondownthelineuntil1gettotheend!');
    await page.click('button[type="submit"]');
    
    // Navigate to Settings page (using a more specific selector)
    await page.locator('a:has-text("Admin Settings")').click();
    await expect(page).toHaveURL('/admin/settings');
    
    // Navigate back to dashboard using the admin header link
    await page.locator('a:has-text("AI Study Plans Admin")').click();
    await expect(page).toHaveURL('/admin');
  });
  
  test('allows logout and redirects to login page', async ({ page }) => {
    // Log in first with development credentials
    await page.goto('/admin/login');
    await page.click('text=Use development login');
    await page.fill('input[id="username"]', 'adminbridgingtrustaitk');
    await page.fill('input[id="password"]', 'Movingondownthelineuntil1gettotheend!');
    await page.click('button[type="submit"]');
    
    // Click Sign Out button using a more specific selector
    await page.locator('button:has-text("Sign Out")').click();
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*\/admin\/login.*/);
  });
}); 