#!/bin/bash
# Install Playwright browsers with fallback handling

echo "🚀 Installing Playwright browsers..."

# Try to install browsers with timeout
timeout 120 npx playwright install chromium

if [ $? -eq 0 ]; then
    echo "✅ Chromium browser installed successfully"
else
    echo "⚠️ Chromium installation failed or timed out, but continuing..."
fi

# Try to install webkit and firefox only in CI
if [ "$CI" = "true" ]; then
    echo "🔄 Installing additional browsers for CI..."
    timeout 60 npx playwright install webkit || echo "⚠️ Webkit installation failed"
    timeout 60 npx playwright install firefox || echo "⚠️ Firefox installation failed"
fi

echo "🎭 Browser installation process completed"