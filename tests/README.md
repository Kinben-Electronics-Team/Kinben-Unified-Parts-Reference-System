# KPN System Workbook - Test Suite Documentation

This directory contains the comprehensive test suite for the KPN System Workbook application with multiple testing approaches.

## 🎯 Test Types Available

### 1. Full Playwright Tests (`npm test`)
- **What it tests**: Complete browser-based integration tests
- **Requirements**: Playwright browsers installed (`npm run install-browsers`)
- **Coverage**: 290+ tests across multiple browsers (Chrome, Firefox, Safari, Mobile)
- **Features tested**: 
  - Full UI interaction
  - Tab navigation  
  - Form functionality
  - Modal dialogs
  - Component categories
  - Data persistence

### 2. Fallback Tests (`npm run test:fallback`)
- **What it tests**: Basic application structure and functionality without browsers
- **Requirements**: Node.js only (no browser installation needed)
- **Coverage**: Core functionality verification
- **Features tested**:
  - File structure validation
  - HTML syntax and structure
  - JavaScript syntax checking
  - Required files present
  - CSV data directory

### 3. Safe Tests (`npm run test:safe`)
- **What it does**: Runs fallback tests first, then attempts full tests
- **Best for**: Development environments with unreliable browser installation

### 4. Basic Validation (`npm run validate`)
- **What it tests**: File integrity and basic structure
- **Fastest option**: Quick verification that core files are present and valid

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

### Local Development
```bash
# Quick validation
npm run validate

# Safe testing (recommended for development)
npm run test:safe  

# Fallback tests only (no browser needed)
npm run test:fallback

# Full tests (requires browser installation)
npm run install-browsers  # Run once
npm test

# Single browser testing
npm run test:chromium
```

### Specific Test Files
```bash
npx playwright test smoke.spec.ts
npx playwright test tab-navigation.spec.ts
npx playwright test integration.spec.ts
```

### Debug Mode
```bash
# Debug mode with browser dev tools
npm run test:debug

# Run specific test in debug mode
npx playwright test add-functionality.spec.ts --debug
```

## 📁 Core Test Files

### Playwright Tests
- `smoke.spec.ts` - Basic application loading and functionality tests
- `tab-navigation.spec.ts` - Tab switching and navigation tests
- `integration.spec.ts` - Full workflow integration tests
- `component-categories.spec.ts` - Component category management tests
- `add-functionality.spec.ts` - Add item functionality tests

### Support Files
- `fixtures.ts` - Custom Playwright fixtures and page object model
- `test-data.ts` - Sample data for testing various scenarios

### Fallback Tests
- `../test-fallback.sh` - Browser-independent tests
- `../validate-app.js` - Basic file and structure validation
- `../install-browsers.sh` - Browser installation with fallbacks

## 🔧 Configuration

- **Base URL**: Configured in `playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Reports**: HTML reports in `playwright-report/` directory
- **Screenshots**: Captured on test failures
- **Videos**: Recorded on retry attempts

## 🤖 Automated Issue Creation

### When Issues Are Created
- Tests fail in main/master branch
- Daily scheduled test runs detect regressions
- Critical failures that affect core functionality

### Issue Assignment  
- Issues are automatically assigned to `@copilot`
- Labels applied: `bug`, `test-failure`, `automated`, `needs-investigation`

## 🐛 Troubleshooting

### Browser Installation Issues
If `npm run install-browsers` fails:
1. Try running individual browser installation: `npx playwright install chromium`
2. Install system dependencies (Linux): See `install-browsers.sh` for required packages
3. Use fallback tests: `npm run test:fallback`

### Test Failures
1. **Check basic functionality first**: `npm run test:fallback`
2. **Verify server works**: `python3 serve.py` → visit http://localhost:8080
3. **Check browser console** for JavaScript errors
4. **Review test reports** in `playwright-report/` directory

### Common Issues
- **Port conflicts**: Kill existing servers with `pkill -f serve.py`
- **Permission issues**: Ensure test scripts are executable: `chmod +x *.sh`
- **Missing files**: Run `npm run validate` to check file integrity

## 📊 CI/CD Integration

Tests run automatically on:
- Push to main/master branches
- Pull requests
- Daily at 6 AM UTC (scheduled)

The CI pipeline includes:
- Automated browser installation with fallbacks
- Full test suite execution
- Fallback tests if browsers fail to install
- Automated issue creation for failures
- Test reports as GitHub artifacts
- PR comments with test results

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

### Layered Testing Approach
1. **Fallback Tests** - Basic functionality without browsers
2. **Playwright Tests** - Full browser integration testing
3. **Automated Issue Creation** - Failure detection and assignment
4. **Safe Testing** - Combined approach for reliable development

## 📈 Development Workflow

1. **Before committing**: Run `npm run test:safe`
2. **For quick checks**: Use `npm run validate`
3. **For full validation**: Use `npm test` (after browser setup)
4. **If browsers fail**: Fallback tests ensure core functionality works

This layered approach ensures that:
- ✅ Core functionality is always tested (fallback tests)
- ✅ Full UI testing when possible (Playwright tests)
- ✅ Developers can work even with browser installation issues
- ✅ CI/CD catches regressions automatically
- ✅ Issues are created and assigned automatically for failures