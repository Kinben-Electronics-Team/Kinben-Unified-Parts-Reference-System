#!/usr/bin/env node

/**
 * Direct Firebase Deployment Script
 * Bypasses GitHub Actions and deploys directly to Firebase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Direct Firebase Deployment...');

// Step 1: Build the application
console.log('📦 Building application...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

// Step 2: Check if dist directory exists
if (!fs.existsSync('dist')) {
    console.error('❌ dist directory not found. Build may have failed.');
    process.exit(1);
}

console.log('📁 Built files ready in dist/');

// Step 3: Instructions for manual deployment
console.log('\n🎯 MANUAL DEPLOYMENT STEPS:');
console.log('1. Install Firebase CLI: npm install -g firebase-tools');
console.log('2. Login to Firebase: firebase login');
console.log('3. Deploy: firebase deploy --only hosting --project kinbenpartssystem');
console.log('\n🌐 After deployment, your site will be live at:');
console.log('   https://kinbenpartssystem.web.app/');
console.log('\n📱 Direct app access:');
console.log('   https://kinbenpartssystem.web.app/KPN_System_Workbook.html');

// Step 4: Try automated deployment if Firebase CLI is available
console.log('\n🤖 Attempting automated deployment...');
try {
    // Check if firebase CLI is available
    execSync('firebase --version', { stdio: 'pipe' });
    
    // Try to deploy
    console.log('🔥 Deploying to Firebase...');
    execSync('firebase deploy --only hosting --project kinbenpartssystem', { 
        stdio: 'inherit',
        timeout: 60000 // 1 minute timeout
    });
    
    console.log('\n🎉 DEPLOYMENT SUCCESSFUL!');
    console.log('🌐 Your site is now live at: https://kinbenpartssystem.web.app/');
    
} catch (error) {
    console.log('\n⚠️  Automated deployment failed (likely authentication issue)');
    console.log('Please follow the manual steps above to complete deployment.');
    console.log('\nError details:', error.message);
}