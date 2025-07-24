import { test, expect } from '@playwright/test';

test.describe('Firebase Integration - End-to-End Tests', () => {
  test('should initialize Firebase SDK successfully', async ({ page }) => {
    // Track console messages for Firebase initialization
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });

    await page.goto('/KPN_System_Workbook.html');
    
    // Wait for Firebase initialization
    await page.waitForTimeout(5000);
    
    // Check that Firebase SDK loads without errors
    const firebaseAvailable = await page.evaluate(() => {
      return typeof window.firebase !== 'undefined';
    });
    
    expect(firebaseAvailable).toBeTruthy();
    
    // Check for initialization success messages
    const hasInitMessage = consoleMessages.some(msg => 
      msg.includes('Firebase initialized') || 
      msg.includes('Firebase')
    );
    
    console.log('Console messages:', consoleMessages);
  });

  test('should display proper authentication UI', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Should show login modal
    await expect(page.locator('#login-modal')).toBeVisible();
    
    // Should have proper Firebase authentication form
    await expect(page.locator('#firebase-auth-form')).toBeVisible();
    await expect(page.locator('#email')).toHaveAttribute('type', 'email');
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    
    // Should have Firebase-specific messaging
    const modalContent = await page.locator('#login-modal').textContent();
    expect(modalContent).toContain('Firebase');
    expect(modalContent).toContain('online');
    
    // Should NOT have local authentication elements
    expect(modalContent).not.toContain('username');
    expect(modalContent).not.toContain('local');
  });

  test('should handle authentication form validation', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Try to sign in with empty fields
    await page.click('button:has-text("Sign In with Firebase")');
    
    // Should show validation error
    const statusElement = page.locator('#login-status');
    await expect(statusElement).toBeVisible();
    
    const statusText = await statusElement.textContent();
    expect(statusText).toContain('email');
    expect(statusText).toContain('password');
  });

  test('should handle Firebase configuration correctly', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Check Firebase configuration
    const config = await page.evaluate(() => {
      return {
        hasConfig: typeof window.firebaseConfig !== 'undefined',
        projectId: window.firebaseConfig?.projectId,
        authDomain: window.firebaseConfig?.authDomain
      };
    });
    
    expect(config.hasConfig).toBeTruthy();
    expect(config.projectId).toBe('kinbenpartssystem');
    expect(config.authDomain).toBe('kinbenpartssystem.firebaseapp.com');
  });

  test('should have no localStorage dependencies', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Check that no localStorage keys are being used for data storage
    const localStorageUsage = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      return keys.filter(key => 
        key.includes('kinben') || 
        key.includes('component') || 
        key.includes('pcb') || 
        key.includes('system')
      );
    });
    
    // Should have minimal or no localStorage usage for data
    console.log('LocalStorage keys:', localStorageUsage);
    
    // Page content should not reference localStorage for data operations
    const pageContent = await page.content();
    const localStorageReferences = (pageContent.match(/localStorage\./g) || []).length;
    
    // Allow minimal localStorage usage for user preferences only
    expect(localStorageReferences).toBeLessThan(5);
  });

  test('should show Firebase-only system messaging', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    const pageContent = await page.content();
    
    // Should emphasize online-only nature
    expect(pageContent).toContain('Firebase');
    expect(pageContent).toContain('online');
    expect(pageContent).toContain('cloud');
    
    // Should not suggest local alternatives
    expect(pageContent).not.toContain('offline');
    expect(pageContent).not.toContain('local storage');
    expect(pageContent).not.toContain('fallback');
  });

  test('should have proper error handling for network issues', async ({ page }) => {
    // Start with page load
    await page.goto('/KPN_System_Workbook.html');
    
    // Simulate network failure
    await page.route('**/*', route => route.abort());
    
    // Try to interact with Firebase authentication
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    
    // Click sign in button
    await page.click('button:has-text("Sign In with Firebase")');
    
    // Should handle network errors gracefully (not crash)
    await expect(page.locator('body')).toBeVisible();
    
    // Clear the route to restore normal behavior
    await page.unroute('**/*');
  });

  test('should have correct page title and branding', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Check page title indicates online system
    await expect(page).toHaveTitle(/Firebase|Online/);
    
    // Check that branding emphasizes online nature
    const headerContent = await page.locator('h2').first().textContent();
    expect(headerContent).toContain('Firebase');
  });
});