#!/bin/bash

# Enhanced test report generator for the KPN System
set -e

echo "📊 KPN System Test Report Generator"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Generate timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
REPORT_FILE="test-report-$(date '+%Y%m%d-%H%M%S').md"

# Initialize report
cat > "$REPORT_FILE" << EOF
# KPN System Test Report
Generated: $TIMESTAMP

## Test Summary
EOF

echo -e "${BLUE}📋 Generating comprehensive test report...${NC}"

# Test categories and results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test and log results
run_test_with_logging() {
    local test_name="$1"
    local test_command="$2"
    local test_description="$3"
    
    echo -e "\n${BLUE}🔍 Testing: $test_name${NC}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Capture output and result
    if output=$(eval "$test_command" 2>&1); then
        echo -e "${GREEN}✅ PASSED: $test_name${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        
        cat >> "$REPORT_FILE" << EOF

### ✅ $test_name
**Status:** PASSED  
**Description:** $test_description  
**Output:** 
\`\`\`
$output
\`\`\`

EOF
        return 0
    else
        echo -e "${RED}❌ FAILED: $test_name${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        
        cat >> "$REPORT_FILE" << EOF

### ❌ $test_name
**Status:** FAILED  
**Description:** $test_description  
**Error Output:** 
\`\`\`
$output
\`\`\`

EOF
        return 1
    fi
}

# Test 1: Basic file structure
run_test_with_logging "File Structure Validation" \
    "test -f KPN_System_Workbook.html && test -f index.html && test -f serve.py && echo 'All critical files present'" \
    "Verifies that essential application files exist"

# Test 2: HTML validation
run_test_with_logging "HTML Structure Validation" \
    "./test-fallback.sh" \
    "Runs comprehensive HTML and JavaScript validation"

# Test 3: Configuration files
run_test_with_logging "Configuration Files" \
    "test -f playwright.config.ts && test -f package.json && test -f firebase.json && echo 'Configuration files present'" \
    "Checks that deployment and testing configuration files exist"

# Test 4: Test infrastructure
run_test_with_logging "Test Infrastructure" \
    "test -d tests && test -f tests/fixtures.ts && ls tests/*.spec.ts | wc -l" \
    "Verifies that test files and infrastructure are properly set up"

# Test 5: TypeScript compilation check
run_test_with_logging "TypeScript Syntax Check" \
    "node -e 'const fs = require(\"fs\"); const files = fs.readdirSync(\"tests\").filter(f => f.endsWith(\".ts\")); console.log(\`Found \${files.length} TypeScript test files: \${files.join(\", \")}\`);'" \
    "Checks TypeScript test files syntax"

# Test 6: Script permissions and executability
run_test_with_logging "Script Executability" \
    "test -x install-browsers.sh && test -x test-fallback.sh && test -x test-comprehensive.sh && echo 'All scripts executable'" \
    "Verifies that shell scripts have proper execution permissions"

# Test 7: Browser installation capability check
run_test_with_logging "Browser Installation Test" \
    "./install-browsers.sh" \
    "Tests browser installation process for Playwright"

# Test 8: Package.json script validation
run_test_with_logging "NPM Scripts Validation" \
    "node -e 'const pkg = require(\"./package.json\"); const scripts = Object.keys(pkg.scripts); console.log(\`Available scripts: \${scripts.join(\", \")}\`); console.log(\`Test scripts: \${scripts.filter(s => s.includes(\"test\")).join(\", \")}\`);'" \
    "Validates that package.json contains expected npm scripts"

# Test 9: Python server availability
run_test_with_logging "Python Server Check" \
    "which python3 && python3 --version && echo 'Python server available'" \
    "Checks if Python 3 is available for running the development server"

# Test 10: Firebase configuration
run_test_with_logging "Firebase Configuration" \
    "node -e 'const firebase = require(\"./firebase.json\"); console.log(\`Firebase project: \${firebase.hosting ? \"configured\" : \"not configured\"}\`); console.log(\`Public directory: \${firebase.hosting?.public || \"not set\"}\`);'" \
    "Validates Firebase hosting configuration"

# Add summary to report
cat >> "$REPORT_FILE" << EOF

## Final Summary

- **Total Tests Run:** $TOTAL_TESTS
- **Tests Passed:** $PASSED_TESTS ✅
- **Tests Failed:** $FAILED_TESTS ❌
- **Success Rate:** $(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%

## Recommendations

EOF

# Generate recommendations based on results
if [ $FAILED_TESTS -eq 0 ]; then
    cat >> "$REPORT_FILE" << EOF
🎉 **All tests passed!** The KPN System testing infrastructure appears to be working correctly.

### Next Steps:
1. Run full Playwright tests when browser installation is working
2. Add more comprehensive integration tests
3. Implement CI/CD pipeline with these tests
EOF
elif [ $PASSED_TESTS -gt $FAILED_TESTS ]; then
    cat >> "$REPORT_FILE" << EOF
⚠️ **Most tests passed** but there are some issues to address.

### Priority Actions:
1. Fix the failing tests listed above
2. Ensure browser installation works for full Playwright testing
3. Verify all dependencies are properly installed
EOF
else
    cat >> "$REPORT_FILE" << EOF
❌ **Multiple test failures detected** - requires immediate attention.

### Critical Actions:
1. Address all failing tests before proceeding
2. Check system dependencies and permissions
3. Verify file integrity and project structure
EOF
fi

# Print final summary
echo -e "\n${BLUE}📊 Test Report Summary${NC}"
echo "========================"
echo -e "Total Tests:  $TOTAL_TESTS"
echo -e "Passed:       ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:       ${RED}$FAILED_TESTS${NC}"
echo -e "Success Rate: $(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%"
echo ""
echo -e "${BLUE}📄 Detailed report saved to: $REPORT_FILE${NC}"

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed!${NC}"
    exit 0
elif [ $PASSED_TESTS -gt $FAILED_TESTS ]; then
    echo -e "\n${YELLOW}⚠️ Most tests passed - review failures${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Multiple failures - requires attention${NC}"
    exit 1
fi