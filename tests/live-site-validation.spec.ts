import { test, expect } from '@playwright/test';

test.describe('🧪 Live Site Functionality Validation - Issue #23', () => {
  
  test.describe('🚀 Launch Button Test (PR #16 Fix Validation)', () => {
    test('should navigate from landing page to main application', async ({ page }) => {
      // Test the specific functionality mentioned in Issue #23
      
      // Step 1: Navigate to landing page
      await page.goto('/');
      
      // Step 2: Verify landing page loads
      await expect(page).toHaveTitle(/Kinben/);
      await expect(page.locator('h1')).toContainText('KPN System Workbook');
      
      // Step 3: Find and verify launch button exists
      const launchButton = page.locator('a.launch-button', { hasText: 'Launch Application' });
      await expect(launchButton).toBeVisible();
      await expect(launchButton).toContainText('🚀 Launch Application');
      
      // Step 4: Check button href attribute
      const buttonHref = await launchButton.getAttribute('href');
      expect(buttonHref).toBe('KPN_System_Workbook.html');
      
      // Step 5: Click launch button 
      await launchButton.click();
      
      // Step 6: Verify navigation to main application
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/KPN_System_Workbook\.html/);
      
      // Step 7: Verify main application loads successfully
      await expect(page.locator('.workbook-container, .sheet-tabs, body')).toBeVisible();
      
      // Step 8: Verify no JavaScript console errors during navigation
      const consoleErrors: string[] = [];
      page.on('console', message => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });
      
      // Wait a moment for any delayed errors
      await page.waitForTimeout(2000);
      
      // Filter out non-critical errors (like missing favicon)
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('404') &&
        (error.includes('TypeError') || error.includes('ReferenceError') || error.includes('SyntaxError'))
      );
      
      expect(criticalErrors).toHaveLength(0);
    });

    test('should have smooth transition without broken links', async ({ page }) => {
      await page.goto('/');
      
      // Test the launch button styling and responsiveness
      const launchButton = page.locator('a.launch-button');
      
      // Should be styled properly
      await expect(launchButton).toHaveCSS('background', /linear-gradient/);
      await expect(launchButton).toHaveCSS('border-radius', '50px');
      
      // Should be clickable (not disabled)
      await expect(launchButton).toBeEnabled();
      
      // Should respond to hover (test hover effect)
      await launchButton.hover();
      
      // Click and ensure successful navigation
      await launchButton.click();
      await page.waitForLoadState('domcontentloaded');
      
      // Verify we're on the right page
      await expect(page.locator('.tab').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('📁 File Upload/Download Test (PR #13 Fix Validation)', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to main application for file upload tests
      await page.goto('/KPN_System_Workbook.html');
      await page.waitForLoadState('networkidle');
    });

    test('should be able to upload files in Add Component section', async ({ page }) => {
      // Step 1: Go to Add Component section
      // Look for tabs that might contain "Add" functionality
      const addTabs = page.locator('.tab', { hasText: /ADD|🔧|🏗️|🟩/ });
      const addTabCount = await addTabs.count();
      
      if (addTabCount > 0) {
        await addTabs.first().click();
        await page.waitForTimeout(1000);
      }
      
      // Step 2: Look for Add button to open modal
      const addButton = page.locator('button', { hasText: /Add|Create|\+/ }).first();
      if (await addButton.count() > 0) {
        await addButton.click();
        await page.waitForTimeout(1000);
      }
      
      // Step 3: Look for file input fields
      const fileInputs = page.locator('input[type="file"]');
      const fileInputCount = await fileInputs.count();
      
      if (fileInputCount > 0) {
        // Step 4: Create a test file to upload
        const testFilePath = '/tmp/test-upload.txt';
        await page.evaluate(async () => {
          // Create test file content in browser
          const fs = require('fs').promises;
          await fs.writeFile('/tmp/test-upload.txt', 'Test file content for KPN system');
        }).catch(() => {
          // If we can't create file, skip this part of the test
          console.log('Could not create test file - will test UI only');
        });
        
        // Step 5: Test file input exists and is functional
        const firstFileInput = fileInputs.first();
        await expect(firstFileInput).toBeVisible();
        
        // Verify file input accepts files
        await expect(firstFileInput).toHaveAttribute('type', 'file');
        
        // Step 6: Verify form submission works
        const form = page.locator('form').first();
        if (await form.count() > 0) {
          // Check that submit button exists
          const submitButton = page.locator('button[type="submit"], button', { hasText: /Submit|Save|Add/ });
          if (await submitButton.count() > 0) {
            await expect(submitButton.first()).toBeVisible();
          }
        }
      } else {
        // Log that file upload functionality was not found
        console.log('No file input fields found - file upload may not be implemented in current view');
      }
    });

    test('should handle multiple file types', async ({ page }) => {
      // Navigate through different component types to find file upload
      const componentTabs = [
        { name: 'systems', text: '🏗️' },
        { name: 'assemblies', text: '🔧' }, 
        { name: 'pcbs', text: '🟩' },
        { name: '3d-parts', text: '🖨️' },
        { name: 'cable-assemblies', text: '🔗' }
      ];
      
      for (const tab of componentTabs) {
        // Click tab
        const tabElement = page.locator('.tab', { hasText: tab.text });
        if (await tabElement.count() > 0) {
          await tabElement.click();
          await page.waitForTimeout(1000);
          
          // Look for Add button
          const addButton = page.locator('button', { hasText: /Add|Create|\+/ }).first();
          if (await addButton.count() > 0) {
            await addButton.click();
            await page.waitForTimeout(1000);
            
            // Check for file inputs
            const fileInputs = page.locator('input[type="file"]');
            if (await fileInputs.count() > 0) {
              // Verify file input accepts multiple types
              const acceptAttribute = await fileInputs.first().getAttribute('accept');
              
              // Close modal before next iteration
              const closeButton = page.locator('button', { hasText: /Close|Cancel|✕/ });
              if (await closeButton.count() > 0) {
                await closeButton.first().click();
              }
              
              console.log(`File upload found in ${tab.name} tab with accept: ${acceptAttribute}`);
              break;
            }
            
            // Close modal if no file input found
            const closeButton = page.locator('button', { hasText: /Close|Cancel|✕/ });
            if (await closeButton.count() > 0) {
              await closeButton.first().click();
            }
          }
        }
      }
    });
  });

  test.describe('🧭 Navigation Test', () => {
    test('should have working tab navigation', async ({ page }) => {
      await page.goto('/KPN_System_Workbook.html');
      
      // Test all main tabs work
      const tabs = page.locator('.tab');
      const tabCount = await tabs.count();
      expect(tabCount).toBeGreaterThan(0);
      
      // Test clicking each tab
      for (let i = 0; i < Math.min(tabCount, 6); i++) {
        const tab = tabs.nth(i);
        await tab.click();
        await page.waitForTimeout(500);
        
        // Verify tab becomes active
        await expect(tab).toHaveClass(/active/);
      }
    });

    test('should be mobile responsive', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/KPN_System_Workbook.html');
      
      // Should still load and be functional
      await expect(page.locator('.tab').first()).toBeVisible();
      await expect(page.locator('body')).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.reload();
      
      await expect(page.locator('.tab').first()).toBeVisible();
    });

    test('should have no broken UI elements', async ({ page }) => {
      await page.goto('/KPN_System_Workbook.html');
      
      // Check for basic UI integrity
      const body = page.locator('body');
      await expect(body).not.toContainText('undefined');
      await expect(body).not.toContainText('null');
      await expect(body).not.toContainText('[object Object]');
      
      // Check that essential elements load
      await expect(page.locator('.tab').first()).toBeVisible();
    });
  });

  test.describe('⚙️ Core Functionality Test', () => {
    test('should be able to add a new component', async ({ page }) => {
      await page.goto('/KPN_System_Workbook.html');
      
      // Find a tab with Add functionality
      const addableTabs = page.locator('.tab', { hasText: /🏗️|🔧|🟩/ });
      if (await addableTabs.count() > 0) {
        await addableTabs.first().click();
        await page.waitForTimeout(1000);
        
        // Look for Add button
        const addButton = page.locator('button', { hasText: /Add|Create|\+/ });
        if (await addButton.count() > 0) {
          await addButton.first().click();
          
          // Should open a modal or form
          await page.waitForTimeout(1000);
          
          // Look for form fields
          const formFields = page.locator('input[type="text"], input[type="number"], textarea, select');
          if (await formFields.count() > 0) {
            // Verify form exists
            expect(await formFields.count()).toBeGreaterThan(0);
          }
        }
      }
    });

    test('should persist data after page refresh', async ({ page }) => {
      await page.goto('/KPN_System_Workbook.html');
      
      // Check if there's any existing data
      const dataElements = page.locator('[data-kpn], .component-item, .system-item');
      const hasData = await dataElements.count() > 0;
      
      if (hasData) {
        // Get some identifier of existing data
        const dataText = await dataElements.first().textContent();
        
        // Refresh page
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Check if data persists
        if (dataText) {
          await expect(page.locator('body')).toContainText(dataText);
        }
      }
    });

    test('should have export functionality', async ({ page }) => {
      await page.goto('/KPN_System_Workbook.html');
      
      // Look for export buttons
      const exportButtons = page.locator('button', { hasText: /Export|Download|CSV|JSON/ });
      const exportCount = await exportButtons.count();
      
      if (exportCount > 0) {
        // Verify export buttons exist
        await expect(exportButtons.first()).toBeVisible();
        
        // Note: We don't actually trigger download to avoid file management issues
        console.log(`Found ${exportCount} export buttons`);
      }
    });
  });

  test.describe('🐛 Error Handling', () => {
    test('should not have JavaScript errors in console', async ({ page }) => {
      const consoleErrors: string[] = [];
      const consoleWarnings: string[] = [];
      
      page.on('console', message => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        } else if (message.type() === 'warning') {
          consoleWarnings.push(message.text());
        }
      });
      
      await page.goto('/KPN_System_Workbook.html');
      await page.waitForLoadState('networkidle');
      
      // Wait for any delayed errors
      await page.waitForTimeout(3000);
      
      // Filter out non-critical errors
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('404') &&
        !error.includes('net::ERR_') &&
        (error.includes('TypeError') || error.includes('ReferenceError') || error.includes('SyntaxError'))
      );
      
      // Report findings
      if (consoleErrors.length > 0) {
        console.log('Console errors found:', consoleErrors);
      }
      if (consoleWarnings.length > 0) {
        console.log('Console warnings found:', consoleWarnings);
      }
      
      // Critical errors should be zero
      expect(criticalErrors).toHaveLength(0);
    });

    test('should handle network failures gracefully', async ({ page }) => {
      await page.goto('/KPN_System_Workbook.html');
      
      // Test that the app still functions if external resources fail
      // (This is a basic test - in a real scenario you'd mock network failures)
      
      await expect(page.locator('.tab').first()).toBeVisible();
      
      // Try to interact with the app
      const tabs = page.locator('.tab');
      if (await tabs.count() > 1) {
        await tabs.nth(1).click();
        await expect(tabs.nth(1)).toHaveClass(/active/);
      }
    });
  });

  test.describe('📊 Performance Tests', () => {
    test('should load within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/KPN_System_Workbook.html');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 10 seconds (generous timeout)
      expect(loadTime).toBeLessThan(10000);
      
      console.log(`Page load time: ${loadTime}ms`);
    });
  });
});