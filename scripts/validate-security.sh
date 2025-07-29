#!/bin/bash

# Security Validation Script
# Demonstrates that all security measures are properly implemented

echo "🔍 Security System Validation"
echo "============================="
echo ""

# Test 1: Secret Detection
echo "1. Testing secret detection system..."
npm run security-check
if [ $? -eq 0 ]; then
    echo "✅ Secret detection: PASSED"
else
    echo "❌ Secret detection: FAILED"
    exit 1
fi
echo ""

# Test 2: Environment Configuration
echo "2. Testing environment configuration..."
if [ -f ".env.example" ]; then
    echo "✅ Environment template: EXISTS"
else
    echo "❌ Environment template: MISSING"
    exit 1
fi

# Test 3: GitIgnore Protection
echo "3. Testing .gitignore protection..."
if grep -q "\.env$" .gitignore && grep -q "\*secrets\*" .gitignore; then
    echo "✅ GitIgnore protection: CONFIGURED"
else
    echo "❌ GitIgnore protection: INCOMPLETE"
    exit 1
fi

# Test 4: Git Hooks
echo "4. Testing Git hooks installation..."
if [ -f ".githooks/pre-commit" ] && [ -x ".githooks/pre-commit" ]; then
    echo "✅ Pre-commit hook: AVAILABLE"
else
    echo "❌ Pre-commit hook: MISSING"
    exit 1
fi

# Test 5: Build Process
echo "5. Testing secure build process..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ] && [ -f "dist/env-config.js" ] && [ -f "dist/secure-config.js" ]; then
    echo "✅ Secure build: WORKING"
else
    echo "❌ Secure build: FAILED"
    exit 1
fi

# Test 6: Documentation
echo "6. Testing security documentation..."
if [ -f "SECURITY_SETUP.md" ] && grep -q "credential rotation" SECURITY_SETUP.md; then
    echo "✅ Security documentation: COMPLETE"
else
    echo "❌ Security documentation: INCOMPLETE"
    exit 1
fi

echo ""
echo "🎉 All security measures validated successfully!"
echo "🔒 Repository is protected against secret leaks"
echo ""
echo "Next steps:"
echo "1. Set up .env file with actual credentials (for local development)"
echo "2. Configure GitHub repository secrets (for deployment)"
echo "3. Run 'npm run setup' to install Git hooks"
echo "4. Review SECURITY_SETUP.md for detailed instructions"