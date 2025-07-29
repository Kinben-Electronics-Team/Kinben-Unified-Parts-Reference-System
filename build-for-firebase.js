#!/usr/bin/env node

/**
 * Build script for Firebase deployment
 * Copies necessary files to dist directory for Firebase hosting
 * Safely injects environment variables without exposing secrets
 */

const fs = require('fs');
const path = require('path');

// Load .env file if it exists and dotenv is available
try {
    require('dotenv').config();
} catch (error) {
    console.log('📝 dotenv not available, using environment variables only');
}

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
    'KPN_System_Workbook_Legacy.html', // This will be the backup (current localStorage version)
    'secure-config.js' // Include secure configuration management
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

// Create environment configuration for deployment
const envConfig = {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || 'kinbenpartssystem.firebaseapp.com',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'kinbenpartssystem',
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || 'kinbenpartssystem.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
    ENABLE_FIREBASE_AUTH: process.env.ENABLE_FIREBASE_AUTH || 'false',
    DEFAULT_AUTH_MODE: process.env.DEFAULT_AUTH_MODE || 'local'
};

console.log('\n🎯 Build Summary:');
console.log('- Files copied to dist/ directory');
console.log('- Ready for Firebase deployment');
console.log('- Primary app: KPN_System_Workbook.html (will be local CSV version)');
console.log('- Legacy app: KPN_System_Workbook_Legacy.html (localStorage version)');
console.log('- Security: Environment variables configured safely');
console.log('\n📝 Integration Notes:');
if (!envConfig.FIREBASE_API_KEY) {
    console.log('- To enable Firebase: Set FIREBASE_API_KEY and other Firebase env vars');
    console.log('- HTML files will need <script src="env-config.js"></script> before Firebase init');
    console.log('- Use SecureConfig class for safe configuration management');
}
console.log('\n🚀 Firebase will serve from dist/ directory');

// Write safe environment config (no secrets in plain text)
const envConfigPath = path.join(distDir, 'env-config.js');
const configContent = `
// Auto-generated environment configuration
// This file is safe for client-side use
window.__ENV__ = ${JSON.stringify(envConfig, null, 2)};
`;

fs.writeFileSync(envConfigPath, configContent);
console.log('✅ Created environment configuration');

// Log security status
if (envConfig.FIREBASE_API_KEY) {
    console.log('🔒 Firebase API key configured');
} else {
    console.log('🏠 Running in local-only mode');
}