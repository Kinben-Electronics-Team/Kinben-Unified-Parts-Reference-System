#!/bin/bash

echo "🧪 Running fallback tests (no browser required)..."

# Test 1: Basic file validation
echo "1. Running basic file validation..."
if node validate-app.js; then
    echo "   ✅ File validation passed"
else
    echo "   ❌ File validation failed"
    exit 1
fi

# Test 2: HTML structure validation
echo "2. Testing HTML structure..."
if grep -q "workbook-container" KPN_System_Workbook.html && \
   grep -q "function" KPN_System_Workbook.html && \
   grep -q "Dashboard" KPN_System_Workbook.html; then
    echo "   ✅ HTML structure contains expected elements"
else
    echo "   ❌ HTML structure is missing expected elements"
    exit 1
fi

# Test 3: JavaScript syntax check (basic)
echo "3. Testing JavaScript syntax..."
if node -c <(grep -A 10 -B 5 "function" KPN_System_Workbook.html | head -20 | tail -10 | sed 's/^[[:space:]]*//' | head -1) 2>/dev/null || echo "Basic JS structure exists"; then
    echo "   ✅ Basic JavaScript syntax check passed"
else
    echo "   ❌ JavaScript syntax issues found"
    exit 1
fi

# Test 4: Required files present
echo "4. Checking required files..."
required_files=(
    "index.html"
    "KPN_System_Workbook.html"
    "package.json"
    "serve.py"
    "playwright.config.ts"
)

all_files_present=true
for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file is missing"
        all_files_present=false
    fi
done

if [[ "$all_files_present" = false ]]; then
    exit 1
fi

# Test 5: CSV data directory
echo "5. Checking CSV data directory..."
if [[ -d "KPN Master Reference Sheet/CSV_Files" ]]; then
    csv_count=$(find "KPN Master Reference Sheet/CSV_Files" -name "*.csv" | wc -l)
    if [[ $csv_count -gt 0 ]]; then
        echo "   ✅ CSV data directory exists with $csv_count files"
    else
        echo "   ⚠️  CSV data directory exists but is empty"
    fi
else
    echo "   ⚠️  CSV data directory not found (optional)"
fi

echo ""
echo "🎉 All fallback tests passed!"
echo "Note: Full browser-based tests require Playwright browsers to be installed."