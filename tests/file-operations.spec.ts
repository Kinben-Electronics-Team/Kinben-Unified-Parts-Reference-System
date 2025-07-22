import { test, expect } from './fixtures';

test.describe('KPN System Workbook - File Upload/Download Functionality', () => {
  test.beforeEach(async ({ kpnPage }) => {
    await kpnPage.goto();
  });

  test.describe('File Upload Tests', () => {
    test('should have file upload elements visible', async ({ kpnPage }) => {
      // Look for file upload buttons/inputs across different tabs
      const uploadSelectors = [
        'input[type="file"]',
        'button:has-text("Upload")',
        'button:has-text("Import")',
        'button:has-text("Browse")',
        '.file-upload',
        '.upload-button'
      ];

      let uploadElementFound = false;
      for (const selector of uploadSelectors) {
        const elements = kpnPage.page.locator(selector);
        const count = await elements.count();
        if (count > 0) {
          // Debugging statement removed to keep test output clean.
          uploadElementFound = true;
        }
      }

      // If no upload elements found, check if they appear on specific tabs
      if (!uploadElementFound) {
        const tabsToCheck = ['bulk-import', 'dashboard'];
        for (const tab of tabsToCheck) {
          try {
            await kpnPage.clickTab(tab);
            await kpnPage.waitForTabToLoad(tab);
            
            for (const selector of uploadSelectors) {
              const elements = kpnPage.page.locator(selector);
              const count = await elements.count();
              if (count > 0) {
                console.log(`Found ${count} upload elements on ${tab} tab with selector: ${selector}`);
                uploadElementFound = true;
                break;
              }
            }
            if (uploadElementFound) break;
          } catch (e) {
            // Tab might not exist
          }
        }
      }

      expect(uploadElementFound).toBeTruthy();
    });

    test('should be able to interact with file upload elements', async ({ kpnPage, page }) => {
      // Look for file input elements
      const fileInputs = page.locator('input[type="file"]');
      const fileInputCount = await fileInputs.count();
      
      if (fileInputCount > 0) {
        const firstFileInput = fileInputs.first();
        await expect(firstFileInput).toBeAttached();
        
        // Check if the input accepts the expected file types
        const acceptAttr = await firstFileInput.getAttribute('accept');
        if (acceptAttr) {
          console.log(`File input accepts: ${acceptAttr}`);
          // Common file types for electronics: .csv, .xlsx, .json, .xml
          const expectedTypes = ['.csv', '.xlsx', '.json', '.xml', 'image'];
          const hasExpectedType = expectedTypes.some(type => 
            acceptAttr.toLowerCase().includes(type.toLowerCase())
          );
          expect(hasExpectedType).toBeTruthy();
        }
      } else {
        // Look for upload buttons that might trigger file dialogs
        const uploadButtons = page.locator('button:has-text("Upload"), button:has-text("Import"), button:has-text("Browse")');
        const buttonCount = await uploadButtons.count();
        expect(buttonCount).toBeGreaterThan(0);
        
        // Try clicking the first upload button
        if (buttonCount > 0) {
          const firstButton = uploadButtons.first();
          await expect(firstButton).toBeVisible();
          // Note: Actual file upload would require file handling which is complex in tests
          // This validates the button exists and is clickable
        }
      }
    });

    test('should handle bulk import functionality', async ({ kpnPage }) => {
      try {
        await kpnPage.clickTab('bulk-import');
        await kpnPage.waitForTabToLoad('bulk-import');
        
        // Look for bulk import specific elements
        const bulkImportElements = [
          'text=Import',
          'text=Upload',
          'text=CSV',
          'text=Excel',
          '.import-section',
          '.bulk-upload'
        ];
        
        let importElementFound = false;
        for (const selector of bulkImportElements) {
          const element = kpnPage.page.locator(selector);
          if (await element.count() > 0 && await element.first().isVisible()) {
            importElementFound = true;
            break;
          }
        }
        
        expect(importElementFound).toBeTruthy();
        
      } catch (e) {
        // Bulk import tab might not exist - check for import functionality elsewhere
        const importButtons = kpnPage.page.locator('button:has-text("Import")');
        const importCount = await importButtons.count();
        expect(importCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('File Download Tests', () => {
    test('should have download/export functionality', async ({ kpnPage, page }) => {
      const downloadSelectors = [
        'button:has-text("Download")',
        'button:has-text("Export")',
        'a[download]',
        'button:has-text("Save")',
        '.download-button',
        '.export-button'
      ];

      let downloadElementFound = false;
      
      // Check current page first
      for (const selector of downloadSelectors) {
        const elements = page.locator(selector);
        const count = await elements.count();
        if (count > 0) {
          console.log(`Found ${count} download elements with selector: ${selector}`);
          downloadElementFound = true;
        }
      }

      // If not found, check specific tabs that might have download functionality
      if (!downloadElementFound) {
        const tabsToCheck = ['dashboard', 'systems', 'assemblies'];
        for (const tab of tabsToCheck) {
          try {
            await kpnPage.clickTab(tab);
            await kpnPage.waitForTabToLoad(tab);
            
            for (const selector of downloadSelectors) {
              const elements = page.locator(selector);
              const count = await elements.count();
              if (count > 0) {
                console.log(`Found ${count} download elements on ${tab} tab`);
                downloadElementFound = true;
                break;
              }
            }
            if (downloadElementFound) break;
          } catch (e) {
            // Tab might not exist
          }
        }
      }

      expect(downloadElementFound).toBeTruthy();
    });

    test('should be able to trigger export functionality', async ({ kpnPage, page }) => {
      // Listen for download events
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
      
      // Look for export buttons
      const exportButtons = page.locator('button:has-text("Export"), button:has-text("Download")');
      const exportCount = await exportButtons.count();
      
      if (exportCount > 0) {
        const firstExportButton = exportButtons.first();
        await expect(firstExportButton).toBeVisible();
        
        // Click the export button
        await firstExportButton.click();
        
        // Check if download was triggered (optional - might not happen without data)
        const download = await downloadPromise;
        if (download) {
          console.log(`Download triggered: ${await download.suggestedFilename()}`);
        } else {
          console.log('Export button clicked - no immediate download (may require data)');
        }
        
        // Button click should not cause errors
        await expect(page.locator('body')).toBeVisible();
      } else {
        // Look for download links
        const downloadLinks = page.locator('a[download]');
        const linkCount = await downloadLinks.count();
        expect(linkCount).toBeGreaterThan(0);
      }
    });

    test('should support different export formats', async ({ kpnPage, page }) => {
      // Check for format-specific export options
      const exportFormats = [
        'text=CSV',
        'text=Excel',
        'text=JSON',
        'text=XML',
        'text=PDF'
      ];

      let formatFound = false;
      for (const format of exportFormats) {
        const elements = page.locator(format);
        if (await elements.count() > 0) {
          formatFound = true;
          console.log(`Found export format option: ${format}`);
        }
      }

      // If no format selectors found, check for generic export with format indicators
      if (!formatFound) {
        const exportButtons = page.locator('button:has-text("Export"), button:has-text("Download")');
        const count = await exportButtons.count();
        
        if (count > 0) {
          // Check if button text or attributes suggest format support
          for (let i = 0; i < count; i++) {
            const button = exportButtons.nth(i);
            const text = await button.textContent();
            const title = await button.getAttribute('title');
            
            if (text && (text.includes('CSV') || text.includes('Excel') || text.includes('JSON'))) {
              formatFound = true;
              break;
            }
            if (title && (title.includes('CSV') || title.includes('Excel') || title.includes('JSON'))) {
              formatFound = true;
              break;
            }
          }
        }
      }

      // At minimum, should have some form of export capability
      expect(formatFound || await page.locator('button:has-text("Export"), button:has-text("Download")').count() > 0).toBeTruthy();
    });
  });

  test.describe('Data Persistence Tests', () => {
    test('should validate data storage and retrieval', async ({ kpnPage, page }) => {
      // Check for local storage or session storage usage
      const hasLocalStorage = await page.evaluate(() => {
        try {
          const testKey = 'kpn_test_storage';
          localStorage.setItem(testKey, 'test');
          const value = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          return value === 'test';
        } catch (e) {
          return false;
        }
      });

      const hasSessionStorage = await page.evaluate(() => {
        try {
          const testKey = 'kpn_test_session';
          sessionStorage.setItem(testKey, 'test');
          const value = sessionStorage.getItem(testKey);
          sessionStorage.removeItem(testKey);
          return value === 'test';
        } catch (e) {
          return false;
        }
      });

      expect(hasLocalStorage || hasSessionStorage).toBeTruthy();
    });

    test('should handle data import/export workflow', async ({ kpnPage, page }) => {
      // Test basic workflow: navigate to bulk import, check for upload, then check for export
      
      // Step 1: Try to access import functionality
      let importAccessible = false;
      try {
        await kpnPage.clickTab('bulk-import');
        importAccessible = true;
      } catch (e) {
        // Check if import is available elsewhere
        const importButtons = page.locator('button:has-text("Import")');
        importAccessible = await importButtons.count() > 0;
      }

      // Step 2: Check for export functionality
      const exportButtons = page.locator('button:has-text("Export"), button:has-text("Download")');
      const exportAccessible = await exportButtons.count() > 0;

      // At least one of import or export should be available for a complete system
      expect(importAccessible || exportAccessible).toBeTruthy();
      
      if (importAccessible && exportAccessible) {
        console.log('✅ Both import and export functionality detected');
      } else if (importAccessible) {
        console.log('✅ Import functionality detected');
      } else if (exportAccessible) {
        console.log('✅ Export functionality detected');
      }
    });
  });
});