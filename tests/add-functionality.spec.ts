import { test, expect } from './fixtures';

test.describe('KPN System Workbook - Add Functionality', () => {
  test.beforeEach(async ({ kpnPage }) => {
    await kpnPage.goto();
  });

  test.describe('Systems Add Functionality', () => {
    test('should open correct modal when clicking Add button in Systems tab', async ({ kpnPage }) => {
      await kpnPage.clickTab('systems');
      await kpnPage.waitForTabToLoad('systems');
      
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      const modalTitle = await kpnPage.getModalTitle();
      expect(modalTitle).toContain('System');
      
      const formFields = await kpnPage.getFormFields();
      expect(formFields.length).toBeGreaterThan(0);
      
      // Should have system-specific fields
      const fieldNames = formFields.map(f => f.name);
      expect(fieldNames.some(name => name.includes('system') || name.includes('System'))).toBeTruthy();
    });

    test('should have correct form fields for Systems', async ({ kpnPage }) => {
      await kpnPage.clickTab('systems');
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      const formFields = await kpnPage.getFormFields();
      const fieldNames = formFields.map(f => f.name);
      
      // Expected system fields
      const expectedFields = ['systemName', 'systemType', 'systemVersion', 'systemOwner', 'systemDescription'];
      for (const expectedField of expectedFields) {
        expect(fieldNames.some(name => name.includes(expectedField) || name.includes(expectedField.replace('system', '')))).toBeTruthy();
      }
    });
  });

  test.describe('Assemblies Add Functionality', () => {
    test('should open correct modal when clicking Add button in Assemblies tab', async ({ kpnPage }) => {
      await kpnPage.clickTab('assemblies');
      await kpnPage.waitForTabToLoad('assemblies');
      
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      const modalTitle = await kpnPage.getModalTitle();
      expect(modalTitle).toContain('Assembly');
      
      const formFields = await kpnPage.getFormFields();
      expect(formFields.length).toBeGreaterThan(0);
    });

    test('should have correct form fields for Assemblies', async ({ kpnPage }) => {
      await kpnPage.clickTab('assemblies');
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      const formFields = await kpnPage.getFormFields();
      const fieldNames = formFields.map(f => f.name);
      
      // Expected assembly fields
      const expectedFields = ['assemblyName', 'assemblyType', 'assemblyVersion', 'assemblyDescription'];
      for (const expectedField of expectedFields) {
        expect(fieldNames.some(name => name.includes(expectedField) || name.includes(expectedField.replace('assembly', '')))).toBeTruthy();
      }
    });
  });

  test.describe('PCBs Add Functionality', () => {
    test('should open correct modal when clicking Add button in PCBs tab', async ({ kpnPage }) => {
      await kpnPage.clickTab('pcbs');
      await kpnPage.waitForTabToLoad('pcbs');
      
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      const modalTitle = await kpnPage.getModalTitle();
      expect(modalTitle).toContain('PCB');
      expect(modalTitle).toContain('Add New PCB (PKN)');
    });

    test('should have correct form fields for PCBs', async ({ kpnPage }) => {
      await kpnPage.clickTab('pcbs');
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      const formFields = await kpnPage.getFormFields();
      const fieldNames = formFields.map(f => f.name);
      
      // Expected PCB fields
      const expectedFields = ['pcbName', 'pcbType', 'pcbLayers', 'pcbSize', 'pcbThickness'];
      for (const expectedField of expectedFields) {
        expect(fieldNames.some(name => name.includes(expectedField) || name.includes(expectedField.replace('pcb', '')))).toBeTruthy();
      }
    });
  });

  test.describe('Cable Assemblies Add Functionality', () => {
    test('should open correct modal when clicking Add button in Cable Assemblies tab', async ({ kpnPage }) => {
      await kpnPage.clickTab('cable-assemblies');
      await kpnPage.waitForTabToLoad('cable-assemblies');
      
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      const modalTitle = await kpnPage.getModalTitle();
      expect(modalTitle).toContain('Cable');
      expect(modalTitle).toContain('Add New Cable Assembly (CAN)');
    });

    test('should have correct form fields for Cable Assemblies including cableLength', async ({ kpnPage }) => {
      await kpnPage.clickTab('cable-assemblies');
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      const formFields = await kpnPage.getFormFields();
      const fieldNames = formFields.map(f => f.name);
      
      // Should specifically have cableLength field as mentioned in requirements
      expect(fieldNames.some(name => name.includes('cableLength'))).toBeTruthy();
      
      // Check that the cableLength input field exists and is visible
      const cableLengthField = kpnPage.page.locator('input[name="cableLength"], input#cableLength');
      await expect(cableLengthField).toBeVisible();
      
      // Expected cable fields
      const expectedFields = ['cableName', 'cableType', 'cableLength', 'cableConnectors', 'cableDescription'];
      for (const expectedField of expectedFields) {
        expect(fieldNames.some(name => name.includes(expectedField) || name.includes(expectedField.replace('cable', '')))).toBeTruthy();
      }
    });

    test('should be able to fill cable length field', async ({ kpnPage }) => {
      await kpnPage.clickTab('cable-assemblies');
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      const cableLengthField = kpnPage.page.locator('input[name="cableLength"], input#cableLength');
      await cableLengthField.fill('150mm');
      
      const value = await cableLengthField.inputValue();
      expect(value).toBe('150mm');
    });
  });

  test.describe('3D Parts Add Functionality', () => {
    test('should open correct modal when clicking Add button in 3D Parts tab', async ({ kpnPage }) => {
      await kpnPage.clickTab('3d-parts');
      await kpnPage.waitForTabToLoad('3d-parts');
      
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      const modalTitle = await kpnPage.getModalTitle();
      expect(modalTitle).toContain('3D') || expect(modalTitle).toContain('Part');
    });

    test('should have correct form fields for 3D Parts', async ({ kpnPage }) => {
      await kpnPage.clickTab('3d-parts');
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      const formFields = await kpnPage.getFormFields();
      const fieldNames = formFields.map(f => f.name);
      
      // Expected 3D part fields
      const expectedFields = ['partName', 'partType', 'material', 'partDescription'];
      for (const expectedField of expectedFields) {
        expect(fieldNames.some(name => name.includes(expectedField) || name.includes(expectedField.replace('part', '')))).toBeTruthy();
      }
    });
  });

  test.describe('Modal Interactions', () => {
    test('should be able to close modals', async ({ kpnPage }) => {
      await kpnPage.clickTab('systems');
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      await kpnPage.closeModal();
      
      // Modal should no longer be visible
      await expect(kpnPage.page.locator('.modal:visible')).not.toBeVisible();
    });

    test('should be able to fill sample data in forms', async ({ kpnPage }) => {
      await kpnPage.clickTab('cable-assemblies');
      await kpnPage.clickAddButton();
      await kpnPage.waitForModal();
      
      await kpnPage.fillSampleData('cable-assemblies');
      
      // Check that fields were filled
      const cableLengthField = kpnPage.page.locator('input[name="cableLength"], input#cableLength');
      const lengthValue = await cableLengthField.inputValue();
      expect(lengthValue).toBe('150mm');
    });
  });
});