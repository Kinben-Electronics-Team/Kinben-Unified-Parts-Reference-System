#!/usr/bin/env node

/**
 * Debug script to test Firebase SDK loading
 */

const https = require('https');

console.log('🔍 Testing Firebase SDK availability...');

// Test if Firebase SDK URLs are accessible
const testUrls = [
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
];

async function testUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                console.log(`✅ ${url} - OK (${res.statusCode})`);
                resolve(true);
            } else {
                console.log(`❌ ${url} - FAILED (${res.statusCode})`);
                resolve(false);
            }
        }).on('error', (err) => {
            console.log(`❌ ${url} - ERROR: ${err.message}`);
            resolve(false);
        });
    });
}

async function main() {
    console.log('Testing Firebase SDK URLs...\n');
    
    let allOk = true;
    for (const url of testUrls) {
        const ok = await testUrl(url);
        if (!ok) allOk = false;
    }
    
    console.log('\n🎯 Results:');
    if (allOk) {
        console.log('✅ All Firebase SDK URLs are accessible');
        console.log('🔍 The issue is likely in the JavaScript code, not SDK loading');
    } else {
        console.log('❌ Some Firebase SDK URLs are not accessible');
        console.log('🔧 This explains why buttons are not working');
    }
}

main().catch(console.error);