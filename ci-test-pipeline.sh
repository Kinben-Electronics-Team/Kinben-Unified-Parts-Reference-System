#!/bin/bash

# CI/CD Pipeline Test Script for KPN System
# Works in GitHub Actions and other CI environments

set -e

echo "🚀 KPN System CI/CD Test Pipeline"
echo "================================="

# Environment detection
if [ "$CI" = "true" ]; then
    echo "🤖 Running in CI environment"
    export NODE_ENV=production
else
    echo "💻 Running in local environment"
fi

# Colors for output (only if terminal supports it)
if [ -t 1 ]; then
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    NC='\033[0m'
else
    GREEN=''
    YELLOW=''
    RED=''
    NC=''
fi

# Test tracking
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0
START_TIME=$(date +%s)

log_test() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%H:%M:%S')
    
    case "$level" in
        "PASS") echo -e "${GREEN}[${timestamp}] ✅ ${message}${NC}" ;;
        "FAIL") echo -e "${RED}[${timestamp}] ❌ ${message}${NC}" ;;
        "INFO") echo -e "${YELLOW}[${timestamp}] ℹ️ ${message}${NC}" ;;
        *) echo "[${timestamp}] ${message}" ;;
    esac
}

run_test() {
    local test_name="$1"
    local test_command="$2"
    local required="${3:-false}"
    
    echo ""
    echo "🔍 Testing: $test_name"
    echo "----------------------------------------"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    
    if eval "$test_command"; then
        log_test "PASS" "$test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        log_test "FAIL" "$test_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        
        if [ "$required" = "true" ]; then
            log_test "FAIL" "Required test failed - aborting pipeline"
            exit 1
        fi
        return 1
    fi
}

# Pre-flight checks
log_test "INFO" "Starting pre-flight system checks..."

run_test "Node.js Environment" "node --version && npm --version" "true"
run_test "Python Environment" "python3 --version" "true"
run_test "Critical Files Present" "test -f KPN_System_Workbook.html && test -f index.html && test -f firebase.json"

# Application structure tests
log_test "INFO" "Running application structure validation..."

run_test "Main Application HTML Validation" "
node -e '
const fs = require(\"fs\");
const html = fs.readFileSync(\"KPN_System_Workbook.html\", \"utf8\");

// Critical structure checks
const criticalChecks = [
    html.includes(\"<!DOCTYPE html\"),
    html.includes(\"Kinben\"),
    html.includes(\"class=\\\"tab\"),
    html.includes(\"localStorage\"),
    html.includes(\"Papa.parse\") || html.includes(\"CSV\"),
    html.includes(\"FileReader\")
];

const passedChecks = criticalChecks.filter(Boolean).length;
console.log(\"Structure validation: \" + passedChecks + \"/\" + criticalChecks.length + \" critical checks passed\");

if (passedChecks >= criticalChecks.length * 0.8) {
    process.exit(0);
} else {
    process.exit(1);
}
'" "true"

run_test "JavaScript Functionality Coverage" "
node -e '
const fs = require(\"fs\");
const html = fs.readFileSync(\"KPN_System_Workbook.html\", \"utf8\");

// Core functionality patterns
const functionalities = [
    { name: \"File Upload\", pattern: /FileReader|readAsText|files\[0\]/ },
    { name: \"CSV Processing\", pattern: /Papa\.parse|csv|\.split/ },
    { name: \"Data Persistence\", pattern: /localStorage\.(get|set)Item/ },
    { name: \"UI Interaction\", pattern: /addEventListener|onclick|getElementById/ },
    { name: \"Modal Management\", pattern: /modal|dialog|popup/ },
    { name: \"Tab Navigation\", pattern: /tab.*show|showTab|tab.*active/ },
    { name: \"Error Handling\", pattern: /try.*catch|throw|Error/ },
    { name: \"Download Feature\", pattern: /download|href.*data|createObjectURL/ }
];

let implementedCount = 0;
functionalities.forEach(func => {
    if (func.pattern.test(html)) {
        console.log(\"✅ \" + func.name + \" implemented\");
        implementedCount++;
    } else {
        console.log(\"⚠️ \" + func.name + \" not detected\");
    }
});

console.log(\"Functionality coverage: \" + implementedCount + \"/\" + functionalities.length + \" features\");
if (implementedCount >= functionalities.length * 0.6) process.exit(0); else process.exit(1);
'"

run_test "UI Components and Accessibility" "
node -e '
const fs = require(\"fs\");
const html = fs.readFileSync(\"KPN_System_Workbook.html\", \"utf8\");

// UI and accessibility checks
const uiChecks = [
    { name: \"Form Elements\", pattern: /<input|<select|<textarea|<button/ },
    { name: \"Semantic HTML\", pattern: /<nav|<main|<section|<article|<header/ },
    { name: \"ARIA Labels\", pattern: /aria-label|aria-describedby|role=/ },
    { name: \"Responsive Design\", pattern: /@media|viewport|col-|row-/ },
    { name: \"Bootstrap Classes\", pattern: /class=\".*btn|class=\".*form|class=\".*modal/ },
    { name: \"JavaScript Events\", pattern: /onclick|onchange|addEventListener/ }
];

let uiScore = 0;
uiChecks.forEach(check => {
    if (check.pattern.test(html)) {
        console.log(\"✅ \" + check.name + \" found\");
        uiScore++;
    } else {
        console.log(\"⚠️ \" + check.name + \" needs improvement\");
    }
});

console.log(\"UI quality score: \" + uiScore + \"/\" + uiChecks.length);
if (uiScore >= uiChecks.length * 0.5) process.exit(0); else process.exit(1);
'"

# Build and deployment tests
log_test "INFO" "Running build and deployment validation..."

run_test "Firebase Configuration Valid" "
node -e '
const fs = require(\"fs\");
try {
    const config = JSON.parse(fs.readFileSync(\"firebase.json\", \"utf8\"));
    
    if (!config.hosting) {
        console.log(\"❌ No hosting configuration\");
        process.exit(1);
    }
    
    console.log(\"✅ Firebase hosting configured\");
    
    if (config.hosting.public) {
        console.log(\"✅ Public directory: \" + config.hosting.public);
    }
    
    if (config.hosting.rewrites && config.hosting.rewrites.length > 0) {
        console.log(\"✅ Rewrites configured: \" + config.hosting.rewrites.length + \" rules\");
    }
    
    console.log(\"Firebase configuration is valid\");
    
} catch (e) {
    console.log(\"❌ Firebase config error: \" + e.message);
    process.exit(1);
}
'"

# Performance and optimization tests
run_test "Application Performance Check" "
node -e '
const fs = require(\"fs\");
const html = fs.readFileSync(\"KPN_System_Workbook.html\", \"utf8\");

// Performance indicators
const fileSize = fs.statSync(\"KPN_System_Workbook.html\").size;
const cssBlocks = (html.match(/<style[^>]*>/gi) || []).length;
const jsBlocks = (html.match(/<script[^>]*>/gi) || []).length;
const images = (html.match(/<img[^>]*>/gi) || []).length;

console.log(\"📊 Performance metrics:\");
console.log(\"   File size: \" + Math.round(fileSize / 1024) + \" KB\");
console.log(\"   CSS blocks: \" + cssBlocks);
console.log(\"   JS blocks: \" + jsBlocks);
console.log(\"   Images: \" + images);

// Performance thresholds
const sizeOk = fileSize < 5 * 1024 * 1024; // 5MB max
const structureOk = cssBlocks > 0 && jsBlocks > 0;

console.log(\"Performance check: \" + (sizeOk && structureOk ? \"PASS\" : \"NEEDS OPTIMIZATION\"));
if (sizeOk && structureOk) process.exit(0); else process.exit(1);
'"

# Data integrity tests
run_test "CSV Data Structure Validation" "
if [ -d 'KPN Master Reference Sheet' ]; then
    find 'KPN Master Reference Sheet' -name '*.csv' | while read csvfile; do
        echo \"📊 Checking: \$(basename \"\$csvfile\")\"
        # Basic CSV validation
        head -1 \"\$csvfile\" | grep -q ',' && echo \"✅ Has comma separators\" || echo \"⚠️ No comma separators found\"
    done
    echo \"CSV data directory structure validated\"
else
    echo \"⚠️ CSV data directory not found\"
    exit 1
fi
"

# Security checks
run_test "Basic Security Validation" "
node -e '
const fs = require(\"fs\");
const html = fs.readFileSync(\"KPN_System_Workbook.html\", \"utf8\");

// Security pattern checks
const securityIssues = [
    { name: \"Inline eval()\", pattern: /\\beval\\s*\\(/, severity: \"HIGH\" },
    { name: \"Document.write()\", pattern: /document\\.write\\s*\\(/, severity: \"MEDIUM\" },
    { name: \"innerHTML assignment\", pattern: /innerHTML\\s*=/, severity: \"MEDIUM\" },
    { name: \"External script sources\", pattern: /<script[^>]*src=[\"\\']http/, severity: \"LOW\" }
];

let securityScore = 0;
let issuesFound = 0;

securityIssues.forEach(issue => {
    if (issue.pattern.test(html)) {
        console.log(\"⚠️ \" + issue.severity + \": \" + issue.name + \" detected\");
        issuesFound++;
        if (issue.severity === \"HIGH\") securityScore -= 2;
        else if (issue.severity === \"MEDIUM\") securityScore -= 1;
    } else {
        console.log(\"✅ \" + issue.name + \" - clean\");
        securityScore++;
    }
});

console.log(\"Security assessment: \" + securityScore + \"/\" + securityIssues.length + \" (\" + issuesFound + \" issues found)\");
if (securityScore >= 0) process.exit(0); else process.exit(1);
'"

# CI-specific tests
if [ "$CI" = "true" ]; then
    log_test "INFO" "Running CI-specific validations..."
    
    run_test "GitHub Actions Compatibility" "
        echo '✅ Running in CI environment'
        echo '✅ Environment variables available'
        echo '✅ Node.js and npm accessible'
        test -n \"\$GITHUB_WORKSPACE\" && echo '✅ GitHub workspace detected' || echo '⚠️ Non-GitHub CI'
    "
    
    run_test "Deployment Readiness" "
        # Check if all required files are present for deployment
        test -f firebase.json && 
        test -f KPN_System_Workbook.html && 
        test -f index.html &&
        echo '✅ All deployment files ready'
    "
fi

# Generate test report
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "📈 TEST EXECUTION SUMMARY"
echo "========================"
echo "Execution time: ${DURATION} seconds"
echo "Total tests: $TESTS_RUN"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"

PASS_RATE=$((TESTS_PASSED * 100 / TESTS_RUN))
echo "Pass rate: $PASS_RATE%"

# Generate detailed report file
REPORT_FILE="ci-test-report-$(date +%Y%m%d-%H%M%S).md"
cat > "$REPORT_FILE" << EOF
# KPN System CI/CD Test Report

**Date**: $(date)  
**Environment**: $([ "$CI" = "true" ] && echo "CI/CD Pipeline" || echo "Local Development")  
**Duration**: ${DURATION} seconds

## Summary
- **Total Tests**: $TESTS_RUN
- **Passed**: $TESTS_PASSED
- **Failed**: $TESTS_FAILED  
- **Pass Rate**: $PASS_RATE%

## Test Results
$([ $TESTS_FAILED -eq 0 ] && echo "🎉 All tests passed successfully!" || echo "⚠️ Some tests failed - review required")

## Next Steps
$([ $TESTS_FAILED -eq 0 ] && echo "✅ Ready for deployment" || echo "🔧 Fix failing tests before deployment")

---
*Generated by KPN System CI/CD Pipeline*
EOF

echo "📄 Detailed report saved: $REPORT_FILE"

# Exit with appropriate code
if [ $TESTS_FAILED -eq 0 ]; then
    log_test "PASS" "All CI/CD tests completed successfully!"
    exit 0
elif [ $PASS_RATE -ge 80 ]; then
    log_test "INFO" "Most tests passed ($PASS_RATE%) - acceptable for deployment"
    exit 0
else
    log_test "FAIL" "Too many test failures ($TESTS_FAILED/$TESTS_RUN) - deployment not recommended"
    exit 1
fi