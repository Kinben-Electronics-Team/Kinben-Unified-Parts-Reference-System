#!/usr/bin/env node

// Basic HTML and JavaScript validation script
const fs = require('fs');
const path = require('path');

console.log('🔍 Running basic application validation...');

const files = {
  'index.html': 'Landing page',
  'KPN_System_Workbook.html': 'Main application'
};

let allValid = true;

// Check if files exist and are valid HTML
for (const [filename, description] of Object.entries(files)) {
  const filepath = path.join(__dirname, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`❌ ${description} (${filename}) not found`);
    allValid = false;
    continue;
  }
  
  const content = fs.readFileSync(filepath, 'utf8');
  
  // Basic HTML validation
  if (!content.includes('<html') || !content.includes('</html>')) {
    console.log(`❌ ${description} (${filename}) is not valid HTML`);
    allValid = false;
    continue;
  }
  
  // Check for basic structure
  if (filename === 'KPN_System_Workbook.html') {
    const requiredElements = [
      '<title',
      '<head',
      '<body',
      'function',
      'workbook-container'
    ];
    
    let elementsFound = 0;
    for (const element of requiredElements) {
      if (content.includes(element)) {
        elementsFound++;
      }
    }
    
    if (elementsFound < requiredElements.length) {
      console.log(`⚠️  ${description} (${filename}) is missing some expected elements (${elementsFound}/${requiredElements.length})`);
    } else {
      console.log(`✅ ${description} (${filename}) structure looks good`);
    }
  } else {
    console.log(`✅ ${description} (${filename}) is valid HTML`);
  }
}

// Check if package.json is valid
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ package.json is valid (version: ${packageJson.version})`);
} catch (error) {
  console.log(`❌ package.json is invalid: ${error.message}`);
  allValid = false;
}

// Test server script exists and is executable
if (fs.existsSync('serve.py')) {
  const stats = fs.statSync('serve.py');
  if (stats.mode & parseInt('111', 8)) {
    console.log('✅ Server script (serve.py) is executable');
  } else {
    console.log('⚠️  Server script (serve.py) exists but may not be executable');
  }
} else {
  console.log('❌ Server script (serve.py) not found');
  allValid = false;
}

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('✅ Basic validation passed - Application structure looks good');
  process.exit(0);
} else {
  console.log('❌ Some validation issues found');
  process.exit(1);
}