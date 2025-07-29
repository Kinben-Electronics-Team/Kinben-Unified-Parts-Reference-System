#!/usr/bin/env node

/**
 * Build script for Firebase deployment
 * Copies necessary files to dist directory for Firebase hosting
 */

const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
    console.log('✅ Created dist directory');
}

// Files to copy to dist
const filesToCopy = [
    'index.html',
    'KPN_System_Workbook.html', // This will be the primary application (local CSV version after migration)
    'KPN_System_Workbook_Legacy.html' // This will be the backup (current localStorage version)
];

// Directories to copy
const directoriesToCopy = [
    'KPN Master Reference Sheet',
    'Kinben Basic Kicad Library',
    'Project Templates'
];

// Copy files
filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied ${file}`);
    } else {
        console.log(`⚠️  Warning: ${file} not found, skipping`);
    }
});

// Copy directories recursively
function copyDirectoryRecursive(src, dest) {
    if (!fs.existsSync(src)) {
        console.log(`⚠️  Warning: Directory ${src} not found, skipping`);
        return;
    }
    
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectoryRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

directoriesToCopy.forEach(dir => {
    const srcPath = path.join(__dirname, dir);
    const destPath = path.join(distDir, dir);
    copyDirectoryRecursive(srcPath, destPath);
    console.log(`✅ Copied directory ${dir}`);
});

console.log('\n🎯 Build Summary:');
console.log('- Files copied to dist/ directory');
console.log('- Ready for Firebase deployment');
console.log('- Primary app: KPN_System_Workbook.html (will be local CSV version)');
console.log('- Legacy app: KPN_System_Workbook_Legacy.html (localStorage version)');
console.log('\n🚀 Firebase will serve from dist/ directory');