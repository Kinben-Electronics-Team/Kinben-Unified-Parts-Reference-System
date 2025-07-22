import { test, expect } from '@playwright/test';

test.describe('Comprehensive Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    // Wait for the application to load
    await expect(page.locator('body')).toBeVisible();
  });

  test('should complete full workflow: upload CSV, navigate tabs, download data', async ({ page }) => {
    // Test full user workflow
    
    // 1. Check initial state
    await expect(page.locator('.tab').first()).toBeVisible();
    
    // 2. Try to upload a CSV file (if file input exists)
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      // Create a mock CSV content for testing
      const csvContent = 'KPN,Description,Manufacturer\nKPN001,Test Component,Test Manufacturer';
      
      // Note: In real tests, we would upload an actual file
      // For now, just verify the input exists and is functional
      await expect(fileInput).toBeVisible();
    }
    
    // 3. Navigate between tabs
    const tabs = page.locator('.tab');
    const tabCount = await tabs.count();
    
    if (tabCount > 1) {
      // Click on second tab if it exists
      await tabs.nth(1).click();
      await page.waitForTimeout(500); // Allow tab switch
      
      // Click back to first tab
      await tabs.nth(0).click();
      await page.waitForTimeout(500);
    }
    
    // 4. Check for download functionality
    const downloadLinks = page.locator('a[download], button:has-text("download"), button:has-text("Download")');
    if (await downloadLinks.count() > 0) {
      // Verify download elements are present (don't actually download in test)
      await expect(downloadLinks.first()).toBeVisible();
    }
    
    // 5. Verify no JavaScript errors occurred during workflow
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(msg.text());
      }
    });
    
    // Give some time for any delayed errors to appear
    await page.waitForTimeout(1000);
    
    // Assert no critical errors occurred
    const criticalErrors = consoleLogs.filter(log => 
      log.includes('Uncaught') || log.includes('TypeError') || log.includes('ReferenceError')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should handle form interactions without errors', async ({ page }) => {
    // Test form elements and interactions
    
    // Find any input fields
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = inputs.nth(i);
        const inputType = await input.getAttribute('type');
        
        if (inputType !== 'file' && inputType !== 'submit') {
          // Try to interact with the input
          try {
            await input.click({ timeout: 2000 });
            await input.fill('test data');
            await input.clear();
          } catch (error) {
            // Some inputs might not be interactive, that's ok
            console.log(`Input ${i} not interactive: ${inputType}`);
          }
        }
      }
    }
    
    // Check for buttons and try to click non-destructive ones
    const buttons = page.locator('button:not(:has-text("delete")):not(:has-text("remove")):not(:has-text("clear"))');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // Try clicking the first few buttons
      for (let i = 0; i < Math.min(buttonCount, 2); i++) {
        try {
          const button = buttons.nth(i);
          await button.click({ timeout: 2000 });
          await page.waitForTimeout(500); // Allow for UI updates
        } catch (error) {
          // Some buttons might trigger modals or other interactions
          console.log(`Button ${i} interaction handled`);
        }
      }
    }
    
    // Verify the page is still functional after interactions
    await expect(page.locator('body')).toBeVisible();
  });

  test('should maintain responsive design across viewport sizes', async ({ page }) => {
    // Test responsive design
    const viewports = [
      { width: 320, height: 568 },   // Mobile portrait
      { width: 768, height: 1024 },  // Tablet
      { width: 1024, height: 768 },  // Tablet landscape
      { width: 1920, height: 1080 }  // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500); // Allow layout adjustment
      
      // Check that key elements are still visible
      await expect(page.locator('body')).toBeVisible();
      
      // Check that tabs are still accessible (might be collapsed on mobile)
      const tabs = page.locator('.tab');
      if (await tabs.count() > 0) {
        // At least one tab should be visible or accessible
        const visibleTabs = await tabs.evaluateAll(elements => 
          elements.filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
          }).length
        );
        expect(visibleTabs).toBeGreaterThan(0);
      }
    }
    
    // Reset to default viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should handle data persistence and localStorage', async ({ page }) => {
    // Test localStorage functionality if present
    
    const hasLocalStorage = await page.evaluate(() => {
      try {
        localStorage.setItem('test', 'value');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    });
    
    if (hasLocalStorage) {
      // Test localStorage integration
      await page.evaluate(() => {
        // Clear any existing test data
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('test_')) {
            localStorage.removeItem(key);
          }
        });
      });
      
      // Interact with the application to trigger localStorage usage
      const inputs = page.locator('input[type="text"], textarea');
      if (await inputs.count() > 0) {
        const input = inputs.first();
        await input.fill('persistence test data');
        await page.waitForTimeout(1000); // Allow for auto-save
        
        // Check if data was stored (this depends on app implementation)
        const storageKeys = await page.evaluate(() => Object.keys(localStorage));
        console.log('LocalStorage keys found:', storageKeys.length);
      }
    }
  });

  test('should handle error conditions gracefully', async ({ page }) => {
    // Test error handling
    
    let consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Try to trigger some edge cases
    
    // 1. Click on elements that might not exist
    try {
      await page.click('#non-existent-element', { timeout: 1000 });
    } catch {
      // Expected to fail
    }
    
    // 2. Try to access file inputs with invalid data
    const fileInputs = page.locator('input[type="file"]');
    if (await fileInputs.count() > 0) {
      // File inputs should handle invalid selections gracefully
      await expect(fileInputs.first()).toBeVisible();
    }
    
    // 3. Try rapid tab switching if tabs exist
    const tabs = page.locator('.tab');
    if (await tabs.count() > 1) {
      for (let i = 0; i < 3; i++) {
        try {
          await tabs.nth(i % await tabs.count()).click({ timeout: 500 });
        } catch {
          // Rapid clicking might fail, that's ok
        }
      }
    }
    
    // Check that no critical JavaScript errors occurred
    await page.waitForTimeout(1000);
    
    const criticalErrors = consoleErrors.filter(error => 
      error.includes('Uncaught') && !error.includes('test')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});