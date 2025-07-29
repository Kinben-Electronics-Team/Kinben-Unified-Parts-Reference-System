import { test, expect } from '@playwright/test';

test.describe('Component Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/KPN_System_Workbook.html');
    
    // Login with default credentials
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button:has-text("🔑 Sign In")');
    
    // Wait for login to complete
    await expect(page.locator('.header')).toBeVisible();
  });

  test('should display validation fields for resistors', async ({ page }) => {
    // Select resistors category
    await page.selectOption('#comp-category', 'resistors');
    await page.selectOption('#comp-subcategory', 'STD');
    
    // Check that value-with-unit field is present
    await expect(page.locator('#comp-value')).toBeVisible();
    await expect(page.locator('#comp-value-unit')).toBeVisible();
    
    // Check that package dropdown has resistor options
    const packageOptions = await page.locator('#comp-package option').allTextContents();
    expect(packageOptions).toContain('0805');
    expect(packageOptions).toContain('1206');
    
    // Check that tolerance dropdown has resistor options
    const toleranceOptions = await page.locator('#comp-tolerance option').allTextContents();
    expect(toleranceOptions).toContain('1%');
    expect(toleranceOptions).toContain('5%');
  });

  test('should display validation fields for capacitors', async ({ page }) => {
    // Select capacitors category
    await page.selectOption('#comp-category', 'capacitors');
    await page.selectOption('#comp-subcategory', 'CER');
    
    // Check that value-with-unit field is present with capacitance units
    await expect(page.locator('#comp-value')).toBeVisible();
    await expect(page.locator('#comp-value-unit')).toBeVisible();
    
    const valueUnits = await page.locator('#comp-value-unit option').allTextContents();
    expect(valueUnits).toContain('pF');
    expect(valueUnits).toContain('µF');
    
    // Check that voltage rating field with units is present
    await expect(page.locator('#comp-voltage')).toBeVisible();
    await expect(page.locator('#comp-voltage-unit')).toBeVisible();
    
    // Check that dielectric dropdown is present
    const dielectricOptions = await page.locator('#comp-rating option').allTextContents();
    expect(dielectricOptions).toContain('X7R');
    expect(dielectricOptions).toContain('X5R');
  });

  test('should show validation messages', async ({ page }) => {
    // Select resistors category
    await page.selectOption('#comp-category', 'resistors');
    await page.selectOption('#comp-subcategory', 'STD');
    
    // Enter valid value
    await page.fill('#comp-value', '10');
    await page.selectOption('#comp-value-unit', 'kΩ');
    
    // Check for validation message (should appear after input)
    await expect(page.locator('#comp-value-validation')).toBeVisible({ timeout: 1000 });
  });

  test('should successfully add component with validation', async ({ page }) => {
    // Select resistors category
    await page.selectOption('#comp-category', 'resistors');
    await page.selectOption('#comp-subcategory', 'STD');
    
    // Fill required fields
    await page.fill('#comp-value', '10');
    await page.selectOption('#comp-value-unit', 'kΩ');
    await page.selectOption('#comp-package', '0805');
    await page.selectOption('#comp-tolerance', '5%');
    
    // Add component
    await page.click('button:has-text("Add Component")');
    
    // Handle success alert
    page.on('dialog', dialog => dialog.accept());
    
    // Verify component appears in table
    await expect(page.locator('table tbody tr')).toHaveCount(1, { timeout: 2000 });
    await expect(page.locator('table tbody')).toContainText('RES-STD-001');
  });

  test('should display required field indicators', async ({ page }) => {
    // Select capacitors category
    await page.selectOption('#comp-category', 'capacitors');
    await page.selectOption('#comp-subcategory', 'CER');
    
    // Check for red asterisks on required fields
    await expect(page.locator('label:has-text("Value") .required-field')).toBeVisible();
    await expect(page.locator('label:has-text("Package") .required-field')).toBeVisible();
    await expect(page.locator('label:has-text("Voltage Rating") .required-field')).toBeVisible();
  });

  test('should auto-generate KPN correctly', async ({ page }) => {
    // Test resistor KPN generation
    await page.selectOption('#comp-category', 'resistors');
    await page.selectOption('#comp-subcategory', 'STD');
    await expect(page.locator('#comp-kpn-preview')).toHaveText('RES-STD-001');
    
    // Test capacitor KPN generation
    await page.selectOption('#comp-category', 'capacitors');
    await page.selectOption('#comp-subcategory', 'CER');
    await expect(page.locator('#comp-kpn-preview')).toHaveText('CAP-CER-001');
  });
});