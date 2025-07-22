# Playwright Test Suite for KPN System Workbook

This directory contains comprehensive Playwright test automation for the Kinben KPN System Workbook ERP-style web application.

## 🎯 Test Coverage

### Core Test Files

1. **`smoke.spec.ts`** - Basic application loading and functionality tests
2. **`tab-navigation.spec.ts`** - Tab navigation and UI responsiveness tests  
3. **`add-functionality.spec.ts`** - "Add" button and modal functionality tests
4. **`component-categories.spec.ts`** - Component category management tests
5. **`integration.spec.ts`** - End-to-end workflow and integration tests

### Support Files

- **`fixtures.ts`** - Page object model and reusable test fixtures
- **`test-data.ts`** - Sample test data and expected field configurations

## 🧪 Test Scenarios

### Tab Navigation Tests
- ✅ All main tabs are visible and clickable
- ✅ Systems, Assemblies, PCBs, 3D Parts, Cable Assemblies
- ✅ Component categories (Capacitors, Resistors, etc.)
- ✅ State management between tab switches

### Add Functionality Tests
- ✅ "Add" buttons open correct modals for each category
- ✅ Modal titles match expected patterns
- ✅ Form fields validation for each category type
- ✅ **Cable Assembly specific**: `cableLength` input field validation
- ✅ Sample data entry and form interaction

### Integration Tests
- ✅ Complete workflow from tab navigation to form interaction
- ✅ Mobile responsiveness testing
- ✅ Error handling and graceful degradation
- ✅ Accessibility and keyboard navigation

## 🚀 Running Tests

### Prerequisites
```bash
npm install
npx playwright install --with-deps
```

### Test Commands
```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Run specific test file
npx playwright test smoke.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium

# Generate and view HTML report
npm run test:report
```

### Debug Tests
```bash
# Debug mode with browser dev tools
npm run test:debug

# Run specific test in debug mode
npx playwright test add-functionality.spec.ts --debug
```

## 🎯 Target Application

**URL**: https://the-clever-studio-f3b16.web.app/KPS/KPN_System_Workbook

The test suite validates:
- **Main Tabs**: Systems, Assemblies, PCBs, 3D Parts, Cable Assemblies
- **Component Categories**: 16+ component types (Capacitors, Resistors, etc.)
- **Add Functionality**: Modal forms for each category with proper field validation
- **Special Requirements**: Cable Assembly forms must have `input[name="cableLength"]`

## 🔧 Configuration

- **Base URL**: Configured in `playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Reports**: HTML reports in `playwright-report/` directory
- **Screenshots**: Captured on test failures
- **Videos**: Recorded on retry attempts

## 📊 CI/CD Integration

Tests run automatically on:
- Push to main/master branches
- Pull request creation/updates
- Manual workflow dispatch

Generates:
- HTML test reports as GitHub artifacts
- Test result summaries in PR comments
- Deployment validation before GitHub Pages updates

## 🏗️ Test Architecture

### Page Object Pattern
The test suite uses a custom page fixture (`KPNWorkbookPage`) that provides:
- Navigation methods for all tabs
- Modal interaction helpers
- Form field detection and interaction
- Sample data filling capabilities

### Test Data Management
Centralized test data in `test-data.ts` includes:
- Sample form data for all categories
- Expected field configurations
- Tab display name mappings

### Reusable Utilities
- Tab navigation with state verification
- Modal opening/closing with timeout handling
- Form field discovery and validation
- Cross-browser and mobile testing support

## 🐛 Troubleshooting

### Common Issues

1. **Tests failing due to network issues**
   - Ensure stable internet connection
   - Check if the target URL is accessible
   - Consider adding retry logic for network-dependent tests

2. **Modal detection issues**
   - Verify modal selectors in fixtures.ts match application structure
   - Check timing - modals may need additional wait time to appear

3. **Form field detection**
   - Update field selectors if application HTML structure changes
   - Verify field names and IDs match expected patterns

### Debug Tips

1. Use `--headed` flag to see browser interactions
2. Add `await page.pause()` in tests for manual inspection
3. Check browser console for JavaScript errors
4. Verify network requests in browser dev tools

## 📈 Future Enhancements

- [ ] Visual regression testing with screenshot comparison
- [ ] Performance testing and load time validation
- [ ] Cross-browser compatibility expanded testing
- [ ] API testing for backend interactions
- [ ] Automated accessibility (a11y) testing