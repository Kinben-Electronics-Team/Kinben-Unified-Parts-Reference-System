#!/bin/bash

# Install Git Hooks for Security
# Run this script to install pre-commit hooks that prevent secret leaks

echo "🔧 Installing Git hooks for security..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Install pre-commit hook
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

echo "✅ Pre-commit hook installed!"
echo "🔍 This will automatically scan for secrets before each commit"
echo ""
echo "To test the hook:"
echo "  npm run security-check"
echo ""
echo "To manually bypass the hook (not recommended):"
echo "  git commit --no-verify"