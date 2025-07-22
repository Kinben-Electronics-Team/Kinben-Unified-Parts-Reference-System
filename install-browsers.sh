#!/bin/bash

# Install Playwright browsers with fallback handling
echo "🎭 Installing Playwright browsers..."

# Try to install all browsers first
echo "Attempting to install all browsers..."
if npx playwright install; then
    echo "✅ All browsers installed successfully"
    exit 0
fi

echo "❌ Full browser installation failed, trying individual browsers..."

# Fallback: try to install just Chromium
echo "Attempting to install Chromium only..."
if npx playwright install chromium; then
    echo "✅ Chromium installed successfully"
    echo "⚠️  Note: Only Chromium is available for testing"
    exit 0
fi

echo "❌ Chromium installation failed, trying system dependencies..."

# Try installing system dependencies that might help
if command -v apt-get >/dev/null 2>&1; then
    echo "Installing system dependencies..."
    sudo apt-get update -qq
    sudo apt-get install -y \
        libnss3 \
        libatk-bridge2.0-0 \
        libdrm2 \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libxrandr2 \
        libgbm1 \
        libxss1 \
        libasound2 \
        fonts-liberation \
        libxshmfence1 \
        wget \
        ca-certificates
        
    # Try again after installing dependencies
    if npx playwright install chromium; then
        echo "✅ Chromium installed after dependency installation"
        exit 0
    fi
fi

echo "❌ All browser installation attempts failed"
echo "🔧 Tests will need to run with available system browsers or in CI environment"
exit 1