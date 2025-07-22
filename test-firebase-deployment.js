#!/usr/bin/env node
/**
 * Test script to check Firebase deployment status and configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Deployment Test\n');

// Check if dist directory exists and has correct files
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
    console.log('❌ ERROR: dist/ directory does not exist');
    console.log('💡 Run: npm run build');
    process.exit(1);
}

console.log('✅ dist/ directory exists');

// Check required files
const requiredFiles = ['index.html', 'KPN_System_Workbook.html'];
const missingFiles = [];

requiredFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} exists`);
        
        // Check if it has the expected content
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('Build:') && content.includes('Root-level deployment')) {
            console.log(`   📅 Contains build timestamp`);
        } else {
            console.log(`   ⚠️  Missing build timestamp - may be old version`);
        }
    } else {
        console.log(`❌ ${file} missing`);
        missingFiles.push(file);
    }
});

if (missingFiles.length > 0) {
    console.log('\n❌ Missing files in dist/. Run: npm run build');
    process.exit(1);
}

// Check firebase.json configuration
const firebaseConfigPath = path.join(__dirname, 'firebase.json');
if (fs.existsSync(firebaseConfigPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
    console.log('\n🔧 Firebase Configuration:');
    console.log(`   Public directory: ${firebaseConfig.hosting?.public || 'NOT SET'}`);
    console.log(`   Clean URLs: ${firebaseConfig.hosting?.cleanUrls}`);
    console.log(`   Trailing slash: ${firebaseConfig.hosting?.trailingSlash}`);
    
    if (firebaseConfig.hosting?.public === 'dist') {
        console.log('✅ Firebase configured to deploy from dist/');
    } else {
        console.log('❌ Firebase NOT configured for dist/ deployment');
    }
} else {
    console.log('❌ firebase.json not found');
}

// Check .firebaserc
const firebaseRcPath = path.join(__dirname, '.firebaserc');
if (fs.existsSync(firebaseRcPath)) {
    const firebaseRc = JSON.parse(fs.readFileSync(firebaseRcPath, 'utf8'));
    console.log(`\n🎯 Firebase Project: ${firebaseRc.projects?.default || 'NOT SET'}`);
} else {
    console.log('\n❌ .firebaserc not found');
}

// Test the expected landing page structure
const indexPath = path.join(distPath, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

if (indexContent.includes('href="KPN_System_Workbook.html"')) {
    console.log('\n✅ Landing page button correctly links to KPN_System_Workbook.html');
} else {
    console.log('\n❌ Landing page button link is incorrect');
    console.log('   Expected: href="KPN_System_Workbook.html"');
    
    // Look for what it actually links to
    const linkMatch = indexContent.match(/href="([^"]*)" class="launch-button"/);
    if (linkMatch) {
        console.log(`   Found: href="${linkMatch[1]}"`);
    }
}

console.log('\n🚀 Expected deployment URLs:');
console.log('   Landing: https://the-clever-studio-f3b16.web.app/');
console.log('   App: https://the-clever-studio-f3b16.web.app/KPN_System_Workbook.html');

console.log('\n📋 Next Steps:');
console.log('1. Ensure GitHub Actions deployment is working');
console.log('2. Check Firebase service account secret is configured');
console.log('3. Trigger deployment by pushing to main/master branch');
console.log('4. Verify files appear on live site');