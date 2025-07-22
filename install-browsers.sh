#!/bin/bash
# Install Playwright browsers with enhanced fallback handling

echo "🚀 Installing Playwright browsers..."

# Function to check if browser is already installed
check_browser() {
    local browser="$1"
    if npx playwright install --dry-run "$browser" 2>/dev/null | grep -q "is already installed"; then
        echo "✅ $browser is already installed"
        return 0
    else
        return 1
    fi
}

# Function to install browser with retry
install_browser() {
    local browser="$1"
    local max_retries=2
    local retry=0
    
    while [ $retry -lt $max_retries ]; do
        echo "🔄 Attempting to install $browser (attempt $((retry + 1))/$max_retries)"
        
        if timeout 300 npx playwright install "$browser" 2>/dev/null; then
            echo "✅ $browser installation successful"
            return 0
        else
            echo "⚠️ $browser installation attempt $((retry + 1)) failed"
            retry=$((retry + 1))
            if [ $retry -lt $max_retries ]; then
                echo "⏰ Waiting 10 seconds before retry..."
                sleep 10
            fi
        fi
    done
    
    echo "❌ Failed to install $browser after $max_retries attempts"
    return 1
}

# Check if we have network connectivity
if ! ping -c 1 8.8.8.8 >/dev/null 2>&1; then
    echo "⚠️ No network connectivity - skipping browser installation"
    echo "ℹ️ Tests will fall back to validation scripts"
    exit 0
fi

# Install dependencies first if they don't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies first..."
    npm install --no-audit --no-fund >/dev/null 2>&1 || echo "⚠️ Dependency installation warnings"
fi

# Check and install browsers with priority order
browsers=("chromium")
if [ "$CI" = "true" ]; then
    browsers=("chromium" "firefox" "webkit")
fi

installed_count=0

for browser in "${browsers[@]}"; do
    if check_browser "$browser"; then
        installed_count=$((installed_count + 1))
    elif install_browser "$browser"; then
        installed_count=$((installed_count + 1))
    fi
done

echo "📊 Browser installation summary:"
echo "   - Browsers available: $installed_count/${#browsers[@]}"

if [ $installed_count -gt 0 ]; then
    echo "✅ At least one browser available for testing"
    exit 0
else
    echo "⚠️ No browsers available - tests will use fallback validation"
    echo "ℹ️ This is not critical - fallback tests will still verify functionality"
    exit 0
fi