#!/bin/bash

# Quick test runner for validating Playwright setup
echo "🧪 Running Playwright Test Suite Validation"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js to run tests."
    exit 1
fi

# Check basic files exist
echo "📁 Checking test files..."
if [[ ! -f "playwright.config.ts" ]]; then
    echo "❌ playwright.config.ts not found"
    exit 1
fi

if [[ ! -d "tests" ]]; then
    echo "❌ tests directory not found"
    exit 1
fi

echo "✅ Test files found"

# Validate basic file structure
echo "🔍 Validating test structure..."
if [[ ! -f "tests/fixtures.ts" ]]; then
    echo "❌ Missing fixtures.ts"
    exit 1
fi

if [[ ! -f "tests/smoke.spec.ts" ]]; then
    echo "❌ Missing smoke.spec.ts"
    exit 1
fi

echo "✅ Test structure valid"

# Check package.json has required scripts
echo "📦 Validating package.json..."
if ! grep -q '"test": "playwright test"' package.json; then
    echo "❌ Missing 'test' script in package.json"
    exit 1
fi

if ! grep -q '@playwright/test' package.json; then
    echo "❌ Missing @playwright/test dependency in package.json"
    exit 1
fi

echo "✅ package.json valid"

# Check GitHub Actions workflow
echo "⚙️ Validating GitHub Actions workflow..."
if [[ ! -f ".github/workflows/ci.yml" ]]; then
    echo "❌ GitHub Actions workflow not found"
    exit 1
fi

if ! grep -q -E "(npx playwright test|npm test)" .github/workflows/ci.yml; then
    echo "❌ Playwright test not found in CI workflow"
    exit 1
fi

echo "✅ GitHub Actions workflow valid"

echo ""
echo "🎉 All validations passed!"
echo ""
echo "📋 To run tests:"
echo "  1. Install dependencies: npm install"
echo "  2. Install browsers: npx playwright install --with-deps"
echo "  3. Run tests: npm test"
echo "  4. View reports: npm run test:report"
echo ""
echo "🚀 Test suite is ready for CI/CD!"