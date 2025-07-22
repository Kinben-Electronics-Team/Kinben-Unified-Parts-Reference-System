import { test as base, Page, Locator } from '@playwright/test';

// Page fixture for KPN System Workbook
export class KPNWorkbookPage {
  constructor(public readonly page: Page) {}

  // Navigation methods
  async goto() {
    await this.page.goto('/KPN_System_Workbook.html');
  }

  async clickTab(tabName: string) {
    const tabSelectors = {
      'dashboard': 'text=📊 Dashboard',
      'systems': 'text=🏗️ SYSTEMS',
      'assemblies': 'text=🔧 ASSEMBLIES', 
      'pcbs': 'text=🟩 PCBs',
      '3d-parts': 'text=🖨️ 3D PARTS',
      'cable-assemblies': 'text=🔗 CABLE ASSY',
      'add-component': 'text=➕ Add Component',
      'bulk-import': 'text=📥 Bulk Import',
      'capacitors': 'text=🔋 CAPACITORS',
      'resistors': 'text=⚡ RESISTORS',
      'inductors': 'text=🌀 INDUCTORS',
      'diodes': 'text=💡 DIODES',
      'transistors': 'text=🔧 TRANSISTORS',
      'ics': 'text=🖥️ ICs',
      'connectors': 'text=🔌 CONNECTORS',
      'crystals': 'text=🔮 CRYSTALS',
      'fuses': 'text=🛡️ FUSES',
      'switches': 'text=🔘 SWITCHES',
      'relays': 'text=🔄 RELAYS',
      'optocouplers': 'text=💡 OPTOCOUPLERS',
      'sensors': 'text=📡 SENSORS',
      'mechanical': 'text=⚙️ MECHANICAL',
      'hardware': 'text=🔩 HARDWARE',
      'cables': 'text=🔌 CABLES'
    };

    const selector = tabSelectors[tabName as keyof typeof tabSelectors];
    if (!selector) {
      throw new Error(`Unknown tab: ${tabName}`);
    }
    
    await this.page.click(selector);
  }

  // Add button methods
  async clickAddButton() {
    // Look for various Add button patterns
    const addButtonSelectors = [
      'button:has-text("Add")', 
      'button[onclick*="addSystemItem"]',
      'button[onclick*="openAddModal"]',
      '.btn:has-text("Add New")',
      '.btn:has-text("Add")'
    ];

    for (const selector of addButtonSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 })) {
          await element.click();
          return;
        }
      } catch (e) {
        // Try next selector
      }
    }

    throw new Error('Could not find Add button on current tab');
  }

  // Modal methods
  async waitForModal() {
    await this.page.waitForSelector('.modal:visible', { timeout: 10000 });
  }

  async getModalTitle() {
    await this.waitForModal();
    const title = await this.page.locator('.modal-content h3').first().textContent();
    return title?.trim() || '';
  }

  async closeModal() {
    await this.page.click('.close, button:has-text("Cancel"), button:has-text("✕")');
  }

  // Form field methods
  async getFormFields() {
    await this.waitForModal();
    const inputs = await this.page.locator('.modal-content input').all();
    const textareas = await this.page.locator('.modal-content textarea').all();
    const selects = await this.page.locator('.modal-content select').all();
    
    const fields = [];
    
    for (const input of inputs) {
      const name = await input.getAttribute('name') || await input.getAttribute('id') || '';
      const type = await input.getAttribute('type') || 'text';
      const placeholder = await input.getAttribute('placeholder') || '';
      fields.push({ element: 'input', name, type, placeholder });
    }
    
    for (const textarea of textareas) {
      const name = await textarea.getAttribute('name') || await textarea.getAttribute('id') || '';
      const placeholder = await textarea.getAttribute('placeholder') || '';
      fields.push({ element: 'textarea', name, placeholder });
    }
    
    for (const select of selects) {
      const name = await select.getAttribute('name') || await select.getAttribute('id') || '';
      fields.push({ element: 'select', name });
    }
    
    return fields;
  }

  async fillSampleData(category: string) {
    const sampleData = {
      'systems': {
        'systemName': 'Test System v1.0',
        'systemType': 'Electronic',
        'systemVersion': '1.0',
        'systemOwner': 'Test User',
        'systemDescription': 'Sample system for testing'
      },
      'assemblies': {
        'assemblyName': 'Test Assembly',
        'assemblyType': 'PCBA',
        'assemblyVersion': '1.0', 
        'assemblyDescription': 'Sample assembly for testing'
      },
      'pcbs': {
        'pcbName': 'Test PCB',
        'pcbType': 'Rigid',
        'pcbLayers': '4',
        'pcbSize': '50x30',
        'pcbThickness': '1.6',
        'pcbDescription': 'Sample PCB for testing'
      },
      'cable-assemblies': {
        'cableName': 'Test Cable',
        'cableType': 'Power',
        'cableLength': '150mm',
        'cableConnectors': 'JST-PH 4-pin to Molex MicroFit 6-pin',
        'cableDescription': 'Sample cable assembly for testing'
      },
      '3d-parts': {
        'partName': 'Test 3D Part',
        'partType': 'Enclosure',
        'material': 'PLA',
        'partDescription': 'Sample 3D part for testing'
      }
    };

    const data = sampleData[category as keyof typeof sampleData] || {};
    
    for (const [fieldName, value] of Object.entries(data)) {
      try {
        const field = this.page.locator(`#${fieldName}, [name="${fieldName}"]`).first();
        if (await field.isVisible({ timeout: 1000 })) {
          await field.fill(value);
        }
      } catch (e) {
        // Field might not exist or be visible
      }
    }
  }

  // Utility methods
  async waitForTabToLoad(tabName: string) {
    // Wait for tab content to be visible
    await this.page.waitForFunction(() => {
      const activeSheet = document.querySelector('.sheet.active');
      return activeSheet && activeSheet.style.display !== 'none';
    }, { timeout: 10000 });
  }

  async isTabActive(tabName: string) {
    const tab = this.page.locator(`.tab:has-text("${tabName}")`);
    return await tab.getAttribute('class').then(classes => classes?.includes('active') || false);
  }
}

// Extend the base test with our page fixture
export const test = base.extend<{ kpnPage: KPNWorkbookPage }>({
  kpnPage: async ({ page }, use) => {
    const kpnPage = new KPNWorkbookPage(page);
    await use(kpnPage);
  },
});

export { expect } from '@playwright/test';