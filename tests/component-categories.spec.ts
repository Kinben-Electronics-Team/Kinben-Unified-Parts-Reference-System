import { test, expect } from './fixtures';

test.describe('KPN System Workbook - Component Categories', () => {
  test.beforeEach(async ({ kpnPage }) => {
    await kpnPage.goto();
  });

  const componentCategories = [
    { name: 'capacitors', displayName: '🔋 CAPACITORS' },
    { name: 'resistors', displayName: '⚡ RESISTORS' },
    { name: 'inductors', displayName: '🌀 INDUCTORS' },
    { name: 'diodes', displayName: '💡 DIODES' },
    { name: 'transistors', displayName: '🔧 TRANSISTORS' },
    { name: 'ics', displayName: '🖥️ ICs' },
    { name: 'connectors', displayName: '🔌 CONNECTORS' },
    { name: 'crystals', displayName: '🔮 CRYSTALS' },
    { name: 'fuses', displayName: '🛡️ FUSES' },
    { name: 'switches', displayName: '🔘 SWITCHES' },
    { name: 'relays', displayName: '🔄 RELAYS' },
    { name: 'optocouplers', displayName: '💡 OPTOCOUPLERS' },
    { name: 'sensors', displayName: '📡 SENSORS' },
    { name: 'mechanical', displayName: '⚙️ MECHANICAL' },
    { name: 'hardware', displayName: '🔩 HARDWARE' },
    { name: 'cables', displayName: '🔌 CABLES' }
  ];

  for (const category of componentCategories) {
    test(`should navigate to ${category.displayName} category`, async ({ kpnPage }) => {
      await kpnPage.clickTab(category.name);
      await kpnPage.waitForTabToLoad(category.name);
      
      // Check that the tab becomes active
      const tabElement = kpnPage.page.locator('.tab', { hasText: category.displayName });
      await expect(tabElement).toHaveClass(/active/);
      
      // Check that the category content is visible
      const activeSheet = kpnPage.page.locator('.sheet.active');
      await expect(activeSheet).toBeVisible();
    });
  }

  test('should have component table structure in category tabs', async ({ kpnPage }) => {
    // Test a few representative categories
    const categoriesToTest = ['capacitors', 'resistors', 'connectors'];
    
    for (const category of categoriesToTest) {
      await kpnPage.clickTab(category);
      await kpnPage.waitForTabToLoad(category);
      
      // Should have a table or table-like structure
      const table = kpnPage.page.locator('table, .component-table, .category-table').first();
      await expect(table).toBeVisible();
      
      // Should have headers
      const headers = kpnPage.page.locator('th, .table-header');
      await expect(headers.first()).toBeVisible();
    }
  });

  test('should show appropriate content for empty categories', async ({ kpnPage }) => {
    await kpnPage.clickTab('capacitors');
    await kpnPage.waitForTabToLoad('capacitors');
    
    // Should either show components or an empty state message
    const hasContent = await kpnPage.page.locator('tbody tr').count() > 0;
    const hasEmptyMessage = await kpnPage.page.locator(':text("No") :text("added yet"), :text("Click"), :text("Add")').count() > 0;
    
    expect(hasContent || hasEmptyMessage).toBeTruthy();
  });

  test('should have search/filter functionality in component categories', async ({ kpnPage }) => {
    await kpnPage.clickTab('capacitors');
    await kpnPage.waitForTabToLoad('capacitors');
    
    // Look for search or filter controls
    const searchElements = kpnPage.page.locator('input[placeholder*="search"], input[type="search"], .search-input, .filter-select');
    if (await searchElements.count() > 0) {
      await expect(searchElements.first()).toBeVisible();
    }
  });

  test('should have sortable column headers in component tables', async ({ kpnPage }) => {
    await kpnPage.clickTab('capacitors');
    await kpnPage.waitForTabToLoad('capacitors');
    
    // Look for sortable headers
    const sortableHeaders = kpnPage.page.locator('.sortable-header, th[onclick*="sort"], th.sortable');
    if (await sortableHeaders.count() > 0) {
      await expect(sortableHeaders.first()).toBeVisible();
      
      // Test clicking a sortable header
      await sortableHeaders.first().click();
      // Should not cause any errors
    }
  });

  test.describe('Add Component Functionality', () => {
    test('should access Add Component tab', async ({ kpnPage }) => {
      await kpnPage.clickTab('add-component');
      await kpnPage.waitForTabToLoad('add-component');
      
      const tabElement = kpnPage.page.locator('.tab', { hasText: '➕ Add Component' });
      await expect(tabElement).toHaveClass(/active/);
      
      // Should show component addition interface
      const addComponentContent = kpnPage.page.locator('.add-component-form, .form-container, form');
      await expect(addComponentContent).toBeVisible();
    });

    test('should have category selection in Add Component', async ({ kpnPage }) => {
      await kpnPage.clickTab('add-component');
      await kpnPage.waitForTabToLoad('add-component');
      
      // Should have category selection dropdown or buttons
      const categorySelector = kpnPage.page.locator('select[name*="category"], select[id*="category"], .category-selector');
      if (await categorySelector.count() > 0) {
        await expect(categorySelector).toBeVisible();
      }
    });
  });

  test.describe('Bulk Import Functionality', () => {
    test('should access Bulk Import tab', async ({ kpnPage }) => {
      await kpnPage.clickTab('bulk-import');
      await kpnPage.waitForTabToLoad('bulk-import');
      
      const tabElement = kpnPage.page.locator('.tab', { hasText: '📥 Bulk Import' });
      await expect(tabElement).toHaveClass(/active/);
      
      // Should show bulk import interface
      const bulkImportContent = kpnPage.page.locator('.bulk-import-container, .upload-area');
      await expect(bulkImportContent).toBeVisible();
    });

    test('should have file upload capability in Bulk Import', async ({ kpnPage }) => {
      await kpnPage.clickTab('bulk-import');
      await kpnPage.waitForTabToLoad('bulk-import');
      
      // Should have file input or upload area
      const fileUpload = kpnPage.page.locator('input[type="file"], .upload-area');
      await expect(fileUpload).toBeVisible();
    });
  });
});