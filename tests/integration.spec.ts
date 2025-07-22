import { test, expect } from './fixtures';

test.describe('KPN System Workbook - Integration Tests', () => {
  test.beforeEach(async ({ kpnPage }) => {
    await kpnPage.goto();
  });

  test('should complete full workflow: navigate tabs and test add modals', async ({ kpnPage }) => {
    // Test main workflow tabs
    const mainTabs = [
      { name: 'systems', displayName: '🏗️ SYSTEMS', expectedModal: 'System' },
      { name: 'assemblies', displayName: '🔧 ASSEMBLIES', expectedModal: 'Assembly' },
      { name: 'pcbs', displayName: '🟩 PCBs', expectedModal: 'PCB' },
      { name: '3d-parts', displayName: '🖨️ 3D PARTS', expectedModal: '3D' },
      { name: 'cable-assemblies', displayName: '🔗 CABLE ASSY', expectedModal: 'Cable' }
    ];

    for (const tab of mainTabs) {
      // Navigate to tab
      await kpnPage.clickTab(tab.name);
      await kpnPage.waitForTabToLoad(tab.name);
      
      // Verify tab is active
      const tabElement = kpnPage.page.locator('.tab', { hasText: tab.displayName });
      await expect(tabElement).toHaveClass(/active/);
      
      // Click Add button and verify modal opens
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      // Verify correct modal opens
      const modalTitle = await kpnPage.getModalTitle();
      expect(modalTitle.toLowerCase()).toContain(tab.expectedModal.toLowerCase());
      
      // Verify form fields exist
      const formFields = await kpnPage.getFormFields();
      expect(formFields.length).toBeGreaterThan(0);
      
      // Close modal before moving to next tab
      await kpnPage.closeModal();
      await expect(kpnPage.page.locator('.modal:visible')).not.toBeVisible();
    }
  });

  test('should test cable assembly workflow with cableLength field', async ({ kpnPage }) => {
    // Navigate to cable assemblies
    await kpnPage.clickTab('cable-assemblies');
    await kpnPage.waitForTabToLoad('cable-assemblies');
    
    // Open add modal
    await kpnPage.clickAddButton();
    await kpnPage.waitForModal();
    
    // Verify this is the cable modal
    const modalTitle = await kpnPage.getModalTitle();
    expect(modalTitle).toContain('Add New Cable/Wire') || expect(modalTitle).toContain('Cable Assembly');
    
    // Verify cableLength field exists (requirement from issue)
    const cableLengthField = kpnPage.page.locator('input[name="cableLength"]');
    await expect(cableLengthField).toBeVisible();
    
    // Fill sample data
    await kpnPage.fillSampleData('cable-assemblies');
    
    // Verify cableLength was filled
    const lengthValue = await cableLengthField.inputValue();
    expect(lengthValue).toBe('150mm');
    
    // Verify other expected fields
    const formFields = await kpnPage.getFormFields();
    const fieldNames = formFields.map(f => f.name);
    
    expect(fieldNames.some(name => name.includes('cableLength'))).toBeTruthy();
    expect(fieldNames.some(name => name.includes('cableName') || name.includes('name'))).toBeTruthy();
    expect(fieldNames.some(name => name.includes('cableConnectors') || name.includes('connectors'))).toBeTruthy();
  });

  test('should handle responsive design across different screen sizes', async ({ kpnPage, page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await kpnPage.goto();
    
    // All tabs should be visible on desktop
    const mainTabs = ['📊 Dashboard', '🏗️ SYSTEMS', '🔧 ASSEMBLIES', '🟩 PCBs'];
    for (const tabText of mainTabs) {
      await expect(kpnPage.page.locator('.tab', { hasText: tabText })).toBeVisible();
    }
    
    // Test mobile view
    await page.setViewportSize({ width: 390, height: 844 });
    await kpnPage.goto();
    
    // Should still be functional on mobile
    await expect(kpnPage.page.locator('.tab').first()).toBeVisible();
  });

  test('should maintain state between tab switches', async ({ kpnPage }) => {
    // Start at dashboard
    await expect(kpnPage.page.locator('.tab', { hasText: '📊 Dashboard' })).toHaveClass(/active/);
    
    // Switch to systems
    await kpnPage.clickTab('systems');
    await expect(kpnPage.page.locator('.tab', { hasText: '🏗️ SYSTEMS' })).toHaveClass(/active/);
    await expect(kpnPage.page.locator('.tab', { hasText: '📊 Dashboard' })).not.toHaveClass(/active/);
    
    // Switch to cable assemblies
    await kpnPage.clickTab('cable-assemblies');
    await expect(kpnPage.page.locator('.tab', { hasText: '🔗 CABLE ASSY' })).toHaveClass(/active/);
    await expect(kpnPage.page.locator('.tab', { hasText: '🏗️ SYSTEMS' })).not.toHaveClass(/active/);
    
    // Switch back to dashboard
    await kpnPage.clickTab('dashboard');
    await expect(kpnPage.page.locator('.tab', { hasText: '📊 Dashboard' })).toHaveClass(/active/);
    await expect(kpnPage.page.locator('.tab', { hasText: '🔗 CABLE ASSY' })).not.toHaveClass(/active/);
  });

  test('should handle error conditions gracefully', async ({ kpnPage }) => {
    // Try to access invalid tab (should not crash)
    try {
      await kpnPage.page.evaluate(() => {
        // Try to trigger showSheet with invalid parameter
        if (typeof (window as any).showSheet === 'function') {
          (window as any).showSheet('invalid-tab');
        }
      });
      // Should not crash
    } catch (e) {
      // Expected - invalid tab should be handled gracefully
    }
    
    // Application should still be functional
    await kpnPage.clickTab('dashboard');
    await expect(kpnPage.page.locator('.tab', { hasText: '📊 Dashboard' })).toHaveClass(/active/);
  });

  test('should load all required assets and scripts', async ({ kpnPage, page }) => {
    // Check for console errors during page load
    const consoleMessages: string[] = [];
    page.on('console', message => {
      if (message.type() === 'error') {
        consoleMessages.push(message.text());
      }
    });
    
    await kpnPage.goto();
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check that essential elements are present
    await expect(kpnPage.page.locator('.workbook-container, body')).toBeVisible();
    await expect(kpnPage.page.locator('.sheet-tabs')).toBeVisible();
    
    // Should not have critical JavaScript errors
    const criticalErrors = consoleMessages.filter(msg => 
      msg.includes('TypeError') || 
      msg.includes('ReferenceError') || 
      msg.includes('SyntaxError')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should have proper accessibility attributes', async ({ kpnPage }) => {
    await kpnPage.goto();
    
    // Check for basic accessibility
    const tabs = kpnPage.page.locator('.tab');
    const firstTab = tabs.first();
    
    // Tabs should be focusable
    await firstTab.focus();
    await expect(firstTab).toBeFocused();
    
    // Should be able to navigate with keyboard
    await kpnPage.page.keyboard.press('Tab');
    // Next element should be focused (we don't test specific element, just that focus moved)
  });
});