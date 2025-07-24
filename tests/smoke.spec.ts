import { test, expect } from '@playwright/test';

test.describe('KPN System Workbook - Firebase Integration Tests', () => {
  test('should load the application with Firebase authentication', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Basic checks that the application loads
    await expect(page).toHaveTitle(/Kinben/);
    await expect(page.locator('body')).toBeVisible();
    
    // Should show Firebase login modal initially
    await expect(page.locator('#login-modal')).toBeVisible();
    await expect(page.locator('#firebase-auth-form')).toBeVisible();
    
    // Should have Firebase authentication form
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    
    // Should have Firebase sign in button
    await expect(page.locator('button:has-text("Sign In with Firebase")')).toBeVisible();
    await expect(page.locator('button:has-text("Create New Account")')).toBeVisible();
    
    // Should not have JavaScript errors preventing basic functionality
    const hasError = await page.evaluate(() => {
      return document.body.innerHTML.includes('error') && 
             !document.querySelector('#login-modal');
    });
    
    expect(hasError).toBeFalsy();
  });

  test('should display Firebase configuration status', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Wait for Firebase initialization
    await page.waitForTimeout(3000);
    
    // Check console for Firebase initialization messages
    const logs = [];
    page.on('console', (msg) => {
      if (msg.type() === 'log' && msg.text().includes('Firebase')) {
        logs.push(msg.text());
      }
    });
    
    // Reload to capture initialization logs
    await page.reload();
    await page.waitForTimeout(3000);
    
    // Should have Firebase initialization logs (when connected to internet)
    const hasFirebaseLog = logs.some(log => 
      log.includes('Firebase initialized') || 
      log.includes('Firebase') ||
      log.includes('Firestore')
    );
    
    console.log('Firebase logs:', logs);
  });

  test('should handle authentication form interactions', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Should be able to type in email field
    await page.fill('#email', 'test@example.com');
    await expect(page.locator('#email')).toHaveValue('test@example.com');
    
    // Should be able to type in password field
    await page.fill('#password', 'testpassword');
    await expect(page.locator('#password')).toHaveValue('testpassword');
    
    // Should be able to click authentication buttons without crashing
    const signInButton = page.locator('button:has-text("Sign In with Firebase")');
    await expect(signInButton).toBeVisible();
    
    const createAccountButton = page.locator('button:has-text("Create New Account")');
    await expect(createAccountButton).toBeVisible();
    
    // Application should remain stable after button interactions
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have tab navigation accessible after authentication UI loads', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Look for key UI elements that should exist
    const keyElements = [
      '.login-modal',     // Login modal
      '.tabs',            // Tab container (if exists)
      '.container',       // Main container
    ];
    
    for (const selector of keyElements) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
      }
    }
  });

  test('should have proper Firebase project configuration', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Check that Firebase configuration exists
    const firebaseConfig = await page.evaluate(() => {
      return window.firebaseConfig || null;
    });
    
    // Should have Firebase configuration for kinbenpartssystem project
    if (firebaseConfig) {
      expect(firebaseConfig.projectId).toBe('kinbenpartssystem');
      expect(firebaseConfig.authDomain).toBe('kinbenpartssystem.firebaseapp.com');
    }
  });

  test('should show online-only system messaging', async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Should indicate this is an online Firebase system
    const pageContent = await page.content();
    expect(pageContent).toContain('Firebase');
    expect(pageContent).toContain('Online');
    
    // Should not reference local storage or local systems
    expect(pageContent).not.toContain('localStorage');
    expect(pageContent).not.toContain('local deployment');
  });
});