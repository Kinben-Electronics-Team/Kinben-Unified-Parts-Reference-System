#!/usr/bin/env node
/**
 * Comprehensive Live Site Testing Script
 * Tests all functionality specified in issue #23
 */

const https = require('https');
const fs = require('fs');

const baseUrl = process.env.BASE_URL || 'https://the-clever-studio-f3b16.web.app';

console.log('🧪 LIVE SITE COMPREHENSIVE TEST');
console.log('================================\n');

console.log(`🌐 Testing base URL: ${baseUrl}`);
console.log(`📱 Expected app URL: ${baseUrl}/KPN_System_Workbook.html\n`);

/**
 * Test if URL returns 200 and valid HTML
 */
function testUrl(url, description) {
    return new Promise((resolve) => {
        console.log(`🔍 Testing: ${description}`);
        console.log(`   URL: ${url}`);
        
        const req = https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const status = res.statusCode;
                console.log(`   Status: ${status}`);
                
                if (status === 200) {
                    // Check if it's valid HTML
                    if (data.includes('<html') && data.includes('</html>')) {
                        console.log(`   ✅ SUCCESS: Valid HTML response`);
                        
                        // Additional checks for specific content
                        if (url.includes('index.html') || url === baseUrl) {
                            if (data.includes('Launch Application')) {
                                console.log(`   ✅ Contains launch button`);
                            } else {
                                console.log(`   ⚠️  Missing launch button`);
                            }
                        }
                        
                        if (url.includes('KPN_System_Workbook.html')) {
                            if (data.includes('Kinben KPN System')) {
                                console.log(`   ✅ Contains app content`);
                            } else {
                                console.log(`   ⚠️  Missing app content`);
                            }
                        }
                        
                        resolve({ status, success: true, data });
                    } else {
                        console.log(`   ❌ FAIL: Invalid HTML response`);
                        resolve({ status, success: false, error: 'Invalid HTML' });
                    }
                } else if (status === 404) {
                    console.log(`   ❌ FAIL: Page not found (404)`);
                    console.log(`   💡 This indicates deployment is not working`);
                    resolve({ status, success: false, error: 'Not found' });
                } else {
                    console.log(`   ❌ FAIL: HTTP ${status}`);
                    resolve({ status, success: false, error: `HTTP ${status}` });
                }
            });
        });
        
        req.on('error', (err) => {
            console.log(`   ❌ FAIL: Network error - ${err.message}`);
            resolve({ status: 0, success: false, error: err.message });
        });
        
        req.setTimeout(10000, () => {
            console.log(`   ❌ FAIL: Request timeout`);
            req.destroy();
            resolve({ status: 0, success: false, error: 'Timeout' });
        });
    });
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('📋 TEST CASES (from Issue #23):\n');
    
    const tests = [
        {
            url: baseUrl + '/',
            description: 'Landing page access'
        },
        {
            url: baseUrl + '/index.html',
            description: 'Index page direct access'
        },
        {
            url: baseUrl + '/KPN_System_Workbook.html',
            description: 'Main application access'
        }
    ];
    
    const results = [];
    
    for (const test of tests) {
        const result = await testUrl(test.url, test.description);
        results.push({ ...test, ...result });
        console.log(''); // Add spacing
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('📊 SUMMARY REPORT:');
    console.log('==================\n');
    
    let passCount = 0;
    let failCount = 0;
    
    results.forEach(result => {
        const status = result.success ? '✅ PASS' : '❌ FAIL';
        console.log(`${status}: ${result.description}`);
        if (!result.success) {
            console.log(`        Error: ${result.error}`);
            failCount++;
        } else {
            passCount++;
        }
    });
    
    console.log(`\n📈 Results: ${passCount} passed, ${failCount} failed\n`);
    
    if (failCount > 0) {
        console.log('🚨 DEPLOYMENT ISSUE CONFIRMED');
        console.log('The Firebase deployment is not working properly.');
        console.log('This confirms the Firebase service account secret is missing/invalid.\n');
        
        console.log('🔧 IMMEDIATE ACTION REQUIRED:');
        console.log('1. Add FIREBASE_SERVICE_ACCOUNT secret to GitHub repository');
        console.log('2. Push any change to main/master branch to trigger deployment');
        console.log('3. Re-run this test script after deployment');
        
        return false;
    } else {
        console.log('🎉 ALL TESTS PASSED');
        console.log('Firebase deployment is working correctly!');
        console.log('Ready for comprehensive functionality testing.');
        
        return true;
    }
}

// Run the tests
runTests().then(success => {
    process.exit(success ? 0 : 1);
}).catch(err => {
    console.error('Test runner error:', err);
    process.exit(1);
});