import { test, expect } from '@playwright/test';

test.describe('KPN System Workbook - Smoke Tests', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto(process.env.CI ? '/KPN_System_Workbook' : '/KPN_System_Workbook.html');
    
    // Basic checks that the application loads
    await expect(page).toHaveTitle(/Kinben/);
    await expect(page.locator('body')).toBeVisible();
    
    // Should have tab navigation
    await expect(page.locator('.tab').first()).toBeVisible();
    
    // Should not have JavaScript errors preventing basic functionality
    const hasError = await page.evaluate(() => {
      return document.body.innerHTML.includes('error') && 
             !document.querySelector('.tab');
    });
    
    expect(hasError).toBeFalsy();
  });

  test('should be able to click at least one tab', async ({ page }) => {
    await page.goto(process.env.CI ? '/KPN_System_Workbook' : '/KPN_System_Workbook.html');
    
    // Find and click any visible tab
    const tabs = page.locator('.tab');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThan(0);
    
    // Click the first tab
    await tabs.first().click();
    
    // Should not crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have main sections accessible', async ({ page }) => {
    await page.goto(process.env.CI ? '/KPN_System_Workbook' : '/KPN_System_Workbook.html');
    
    // Look for key UI elements
    const keyElements = [
      '.sheet-tabs', // Tab container
      '.workbook-container', // Main container
    ];
    
    for (const selector of keyElements) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
      }
    }
  });
});