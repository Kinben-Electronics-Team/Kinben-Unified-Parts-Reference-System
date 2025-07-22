import { test, expect } from './fixtures';

test.describe('KPN System Workbook - Tab Navigation', () => {
  test.beforeEach(async ({ kpnPage }) => {
    await kpnPage.goto();
  });

  test('should load the main workbook page', async ({ kpnPage }) => {
    await expect(kpnPage.page).toHaveTitle(/Kinben KPN System Master Workbook/);
    await expect(kpnPage.page.locator('h1, .landing-title')).toContainText(['Kinben', 'KPN', 'System']);
  });

  test('should have all main navigation tabs visible', async ({ kpnPage }) => {
    const mainTabs = [
      '📊 Dashboard',
      '🏗️ SYSTEMS', 
      '🔧 ASSEMBLIES',
      '🟩 PCBs',
      '🖨️ 3D PARTS',
      '🔗 CABLE ASSY'
    ];

    for (const tabText of mainTabs) {
      await expect(kpnPage.page.locator('.tab', { hasText: tabText })).toBeVisible();
    }
  });

  test('should have component category tabs visible', async ({ kpnPage }) => {
    const componentTabs = [
      '🔋 CAPACITORS',
      '⚡ RESISTORS', 
      '🌀 INDUCTORS',
      '💡 DIODES',
      '🔧 TRANSISTORS',
      '🖥️ ICs',
      '🔌 CONNECTORS'
    ];

    for (const tabText of componentTabs) {
      await expect(kpnPage.page.locator('.tab', { hasText: tabText })).toBeVisible();
    }
  });

  test('dashboard tab should be active by default', async ({ kpnPage }) => {
    const dashboardTab = kpnPage.page.locator('.tab', { hasText: '📊 Dashboard' });
    await expect(dashboardTab).toHaveClass(/active/);
  });

  const tabsToTest = [
    { name: 'systems', displayName: '🏗️ SYSTEMS' },
    { name: 'assemblies', displayName: '🔧 ASSEMBLIES' },
    { name: 'pcbs', displayName: '🟩 PCBs' },
    { name: '3d-parts', displayName: '🖨️ 3D PARTS' },
    { name: 'cable-assemblies', displayName: '🔗 CABLE ASSY' },
    { name: 'capacitors', displayName: '🔋 CAPACITORS' },
    { name: 'resistors', displayName: '⚡ RESISTORS' }
  ];

  for (const tab of tabsToTest) {
    test(`should be able to click and navigate to ${tab.displayName} tab`, async ({ kpnPage }) => {
      await kpnPage.clickTab(tab.name);
      await kpnPage.waitForTabToLoad(tab.name);
      
      // Check that the tab becomes active
      const tabElement = kpnPage.page.locator('.tab', { hasText: tab.displayName });
      await expect(tabElement).toHaveClass(/active/);
      
      // Check that content is visible
      const activeSheet = kpnPage.page.locator('.sheet.active');
      await expect(activeSheet).toBeVisible();
    });
  }
});