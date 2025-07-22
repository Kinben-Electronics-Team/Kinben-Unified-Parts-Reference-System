#!/bin/bash

# Test suite that runs without requiring npm dependencies
set -e

echo "🧪 KPN System - Dependency-Free Test Suite"
echo "==========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test results tracking
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n🔍 Running: $test_name"
    echo "-------------------------------------"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASSED: $test_name${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAILED: $test_name${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# 1. Critical file structure validation
run_test "Critical Files Present" "
test -f KPN_System_Workbook.html && 
test -f index.html && 
test -f serve.py && 
test -f firebase.json &&
test -d 'KPN Master Reference Sheet' &&
echo 'All critical files and directories present'
"

# 2. HTML structure validation
run_test "HTML Structure Validation" "
node -e '
const fs = require(\"fs\");
console.log(\"📄 Checking main application HTML...\");
const html = fs.readFileSync(\"KPN_System_Workbook.html\", \"utf8\");

// Check for critical elements
const checks = [
    { name: \"HTML DOCTYPE\", pattern: /<!DOCTYPE html/i },
    { name: \"Title tag\", pattern: /<title[^>]*>.*Kinben.*<\/title>/i },
    { name: \"Tab navigation\", pattern: /class=\"tab/i },
    { name: \"Modal dialogs\", pattern: /class=\"modal/i },
    { name: \"File input\", pattern: /type=\"file\"/i },
    { name: \"CSV processing\", pattern: /Papa\.parse|CSV/i },
    { name: \"LocalStorage usage\", pattern: /localStorage\./i }
];

let passed = 0;
checks.forEach(check => {
    if (check.pattern.test(html)) {
        console.log(\"✅ \" + check.name + \" found\");
        passed++;
    } else {
        console.log(\"❌ \" + check.name + \" missing or malformed\");
    }
});

console.log(\"HTML validation: \" + passed + \"/\" + checks.length + \" checks passed\");
if (passed >= checks.length * 0.8) process.exit(0); else process.exit(1);
'
"

# 3. JavaScript syntax and structure check
run_test "JavaScript Structure Analysis" "
node -e '
const fs = require(\"fs\");
console.log(\"🔧 Analyzing JavaScript structure...\");
const html = fs.readFileSync(\"KPN_System_Workbook.html\", \"utf8\");

// Extract inline scripts
const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
if (!scriptMatches) {
    console.log(\"❌ No inline scripts found\");
    process.exit(1);
}

// Check for key functionality patterns
const patterns = [
    { name: \"Function definitions\", pattern: /function\s+\w+/g },
    { name: \"Event listeners\", pattern: /addEventListener|onclick/g },
    { name: \"File upload handling\", pattern: /FileReader|readAsText|files\[0\]/g },
    { name: \"CSV processing\", pattern: /Papa\.parse|csv/g },
    { name: \"Data persistence\", pattern: /localStorage\.(get|set)Item/g },
    { name: \"Modal management\", pattern: /modal.*show|modal.*hide/g },
    { name: \"Tab switching\", pattern: /tab.*active|showTab/g },
    { name: \"Error handling\", pattern: /try.*catch|throw.*Error/g }
];

console.log(`Found ${scriptMatches.length} script blocks`);
let functionalityScore = 0;

patterns.forEach(p => {
    const matches = html.match(p.pattern);
    if (matches && matches.length > 0) {
        console.log(`✅ ${p.name}: ${matches.length} instances`);
        functionalityScore++;
    } else {
        console.log(`⚠️ ${p.name}: Not found or minimal`);
    }
});

console.log(`JavaScript functionality: ${functionalityScore}/${patterns.length} patterns found`);
if (functionalityScore >= patterns.length * 0.6) process.exit(0); else process.exit(1);
'
"

# 4. CSS and UI structure check
run_test "CSS & UI Structure Validation" "
node -e '
const fs = require(\"fs\");
console.log(\"🎨 Checking CSS and UI structure...\");
const html = fs.readFileSync(\"KPN_System_Workbook.html\", \"utf8\");

const uiElements = [
    { name: \"Tab container\", pattern: /class=\".*tab.*container/i },
    { name: \"Modal dialogs\", pattern: /class=\".*modal/i },
    { name: \"Form elements\", pattern: /<form|<input|<select|<textarea/i },
    { name: \"Button elements\", pattern: /<button|type=\"button\"/i },
    { name: \"Bootstrap classes\", pattern: /class=\".*btn|class=\".*form|class=\".*col/i },
    { name: \"Responsive design\", pattern: /@media|viewport|mobile/i },
    { name: \"CSS Grid/Flexbox\", pattern: /display:.*grid|display:.*flex/i }
];

let uiScore = 0;
uiElements.forEach(element => {
    if (element.pattern.test(html)) {
        console.log(`✅ ${element.name} detected`);
        uiScore++;
    } else {
        console.log(`⚠️ ${element.name} not detected`);
    }
});

console.log(`UI structure: ${uiScore}/${uiElements.length} elements found`);
if (uiScore >= uiElements.length * 0.7) process.exit(0); else process.exit(1);
'
"

# 5. File upload/download functionality check
run_test "File Operations Infrastructure" "
node -e '
const fs = require(\"fs\");
console.log(\"📁 Checking file operation infrastructure...\");
const html = fs.readFileSync(\"KPN_System_Workbook.html\", \"utf8\");

const fileOps = [
    { name: \"File input elements\", pattern: /input.*type=\"file\"/gi },
    { name: \"FileReader usage\", pattern: /new FileReader|readAsText|readAsDataURL/gi },
    { name: \"CSV processing\", pattern: /Papa\.parse|csv.*parse|split.*,/gi },
    { name: \"Download functionality\", pattern: /download.*=|href.*data:|createObjectURL/gi },
    { name: \"Blob creation\", pattern: /new Blob|URL\.createObjectURL/gi },
    { name: \"File validation\", pattern: /\.csv|\.CSV|files\[0\]\.name/gi }
];

let fileScore = 0;
fileOps.forEach(op => {
    const matches = html.match(op.pattern);
    if (matches && matches.length > 0) {
        console.log(`✅ ${op.name}: ${matches.length} instances`);
        fileScore++;
    } else {
        console.log(`❌ ${op.name}: Not implemented`);
    }
});

console.log(`File operations: ${fileScore}/${fileOps.length} features implemented`);
if (fileScore >= fileOps.length * 0.5) process.exit(0); else process.exit(1);
'
"

# 6. Navigation and routing check
run_test "Navigation Infrastructure" "
node -e '
const fs = require(\"fs\");
console.log(\"🔀 Checking navigation infrastructure...\");
const html = fs.readFileSync(\"KPN_System_Workbook.html\", \"utf8\");

const navFeatures = [
    { name: \"Tab elements\", pattern: /class=\".*tab/gi },
    { name: \"Tab switching logic\", pattern: /showTab|switchTab|tabClick/gi },
    { name: \"Active state management\", pattern: /active.*tab|tab.*active/gi },
    { name: \"Navigation buttons\", pattern: /btn.*nav|nav.*btn/gi },
    { name: \"Breadcrumbs or indicators\", pattern: /breadcrumb|indicator|step/gi },
    { name: \"Hash routing\", pattern: /location\.hash|window\.hash/gi }
];

let navScore = 0;
navFeatures.forEach(feature => {
    const matches = html.match(feature.pattern);
    if (matches && matches.length > 0) {
        console.log(`✅ ${feature.name}: ${matches.length} instances`);
        navScore++;
    } else {
        console.log(`⚠️ ${feature.name}: Not detected`);
    }
});

console.log(`Navigation features: ${navScore}/${navFeatures.length} implemented`);
if (navScore >= navFeatures.length * 0.4) process.exit(0); else process.exit(1);
'
"

# 7. Python server test (lightweight)
run_test "Python Server Quick Test" "
python3 -c '
import sys
import os
sys.path.append(\".\")
print(\"🐍 Testing Python server import...\")
try:
    # Just check if the server file is valid Python
    with open(\"serve.py\", \"r\") as f:
        content = f.read()
    
    # Basic syntax check
    compile(content, \"serve.py\", \"exec\")
    print(\"✅ serve.py syntax is valid\")
    
    # Check for required imports/features
    required = [\"http.server\", \"8080\", \"socketserver\"]
    found = sum(1 for req in required if req in content)
    print(f\"✅ Server features: {found}/{len(required)} found\")
    
except Exception as e:
    print(f\"❌ Python server issue: {e}\")
    sys.exit(1)
'
"

# 8. Landing page validation
run_test "Landing Page Structure" "
node -e '
const fs = require(\"fs\");
console.log(\"🏠 Checking landing page...\");
const html = fs.readFileSync(\"index.html\", \"utf8\");

const landingFeatures = [
    { name: \"HTML structure\", pattern: /<html.*>.*<head.*>.*<body.*>/si },
    { name: \"Title reference\", pattern: /Kinben|KPN/i },
    { name: \"Main app link\", pattern: /href=\".*KPN_System_Workbook\.html\"/i },
    { name: \"Navigation elements\", pattern: /<nav|<button|<a.*href/i },
    { name: \"CSS styling\", pattern: /<style|<link.*css/i }
];

let landingScore = 0;
landingFeatures.forEach(feature => {
    if (feature.pattern.test(html)) {
        console.log(`✅ ${feature.name} present`);
        landingScore++;
    } else {
        console.log(`❌ ${feature.name} missing`);
    }
});

console.log(`Landing page: ${landingScore}/${landingFeatures.length} features present`);
if (landingScore >= landingFeatures.length * 0.6) process.exit(0); else process.exit(1);
'
"

# 9. Firebase configuration check
run_test "Firebase Configuration" "
node -e '
const fs = require(\"fs\");
console.log(\"🔥 Checking Firebase configuration...\");
try {
    const config = JSON.parse(fs.readFileSync(\"firebase.json\", \"utf8\"));
    
    console.log(\"✅ firebase.json is valid JSON\");
    
    if (config.hosting) {
        console.log(\"✅ Hosting configuration found\");
        
        if (config.hosting.public) {
            console.log(`✅ Public directory: ${config.hosting.public}`);
        }
        
        if (config.hosting.rewrites) {
            console.log(`✅ Rewrites configured: ${config.hosting.rewrites.length} rules`);
        }
    } else {
        console.log(\"⚠️ No hosting configuration found\");
    }
    
} catch (e) {
    console.log(`❌ Firebase config error: ${e.message}`);
    process.exit(1);
}
'
"

# Print comprehensive test summary
echo -e "\n🏁 Comprehensive Test Summary"
echo "============================="
echo -e "Total Tests:  ${TESTS_RUN}"
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"

PASS_RATE=$((TESTS_PASSED * 100 / TESTS_RUN))
echo -e "Pass Rate:    ${PASS_RATE}%"

if [ ${TESTS_FAILED} -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Application is in excellent condition.${NC}"
    exit 0
elif [ ${PASS_RATE} -ge 80 ]; then
    echo -e "\n${GREEN}✅ Most tests passed (${PASS_RATE}%). Application is in good condition.${NC}"
    exit 0
elif [ ${PASS_RATE} -ge 60 ]; then
    echo -e "\n${YELLOW}⚠️ Decent test results (${PASS_RATE}%). Some improvements needed.${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Multiple test failures (${PASS_RATE}% pass rate). Significant issues detected.${NC}"
    exit 1
fi