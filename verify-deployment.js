#!/usr/bin/env node
/**
 * Deployment verification script for Kinben KPN System
 * Verifies that all required files are present and properly linked
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying deployment build...');

const distDir = path.join(__dirname, 'dist');
const kpsDir = path.join(distDir, 'KPS');

// Check if build directory exists
if (!fs.existsSync(distDir)) {
    console.error('❌ Error: dist directory not found. Run "npm run build" first.');
    process.exit(1);
}

if (!fs.existsSync(kpsDir)) {
    console.error('❌ Error: KPS directory not found in dist.');
    process.exit(1);
}

// Check required files
const requiredFiles = [
    'index.html',
    'KPN_System_Workbook.html'
];

let allFilesPresent = true;

console.log('\n📁 Checking required files in KPS directory:');
requiredFiles.forEach(file => {
    const filePath = path.join(kpsDir, file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        allFilesPresent = false;
    }
});

// Check if index.html has correct launch button link
const indexPath = path.join(kpsDir, 'index.html');
if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    if (indexContent.includes('href="KPN_System_Workbook.html"')) {
        console.log('  ✅ Launch button link is correct');
    } else {
        console.log('  ❌ Launch button link is incorrect or missing');
        // Show what href we found instead
        const hrefMatch = indexContent.match(/href="([^"]*)".*🚀 Launch Application/);
        if (hrefMatch) {
            console.log(`     Found: href="${hrefMatch[1]}"`);
        }
        allFilesPresent = false;
    }
    
    if (indexContent.includes('🚀 Launch Application')) {
        console.log('  ✅ Launch button text is present');
    } else {
        console.log('  ❌ Launch button text is missing');
        allFilesPresent = false;
    }
    
    // Check for build timestamp
    const timestampMatch = indexContent.match(/Build: ([^\s]+)/);
    if (timestampMatch) {
        console.log(`  ✅ Build timestamp: ${timestampMatch[1]}`);
    } else {
        console.log('  ⚠️ No build timestamp found');
    }
    
    // Check version
    const versionMatch = indexContent.match(/v(\d+\.\d+\.?\d*)/);
    if (versionMatch) {
        console.log(`  ✅ Version: v${versionMatch[1]}`);
    } else {
        console.log('  ⚠️ No version found');
    }
}

// Check root redirect file
const rootIndexPath = path.join(distDir, 'index.html');
if (fs.existsSync(rootIndexPath)) {
    console.log('  ✅ Root redirect file exists');
} else {
    console.log('  ❌ Root redirect file is missing');
    allFilesPresent = false;
}

console.log('\n📊 Verification Results:');
if (allFilesPresent) {
    console.log('✅ All checks passed! Deployment is ready.');
    console.log('\n🚀 To deploy to Firebase, run:');
    console.log('   npm run deploy');
    console.log('\n🌐 After deployment, the app will be accessible at:');
    console.log('   https://the-clever-studio-f3b16.web.app/KPS');
    process.exit(0);
} else {
    console.log('❌ Some checks failed. Please fix the issues above.');
    process.exit(1);
}