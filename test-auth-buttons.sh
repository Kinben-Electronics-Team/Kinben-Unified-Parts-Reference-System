#!/bin/bash
# Test script to validate Firebase authentication button functionality

echo "🔧 Testing Firebase Authentication Button Fix"
echo "=============================================="

# Test 1: Check if main HTML file exists
if [ -f "KPN_System_Workbook.html" ]; then
    echo "✅ Main application file exists"
else
    echo "❌ Main application file missing"
    exit 1
fi

# Test 2: Check if authentication functions are defined in HTML
if grep -q "window.signInWithFirebase" KPN_System_Workbook.html; then
    echo "✅ signInWithFirebase function defined"
else
    echo "❌ signInWithFirebase function not found"
    exit 1
fi

if grep -q "window.createAccountWithFirebase" KPN_System_Workbook.html; then
    echo "✅ createAccountWithFirebase function defined"
else
    echo "❌ createAccountWithFirebase function not found"
    exit 1
fi

if grep -q "window.logout" KPN_System_Workbook.html; then
    echo "✅ logout function defined"
else
    echo "❌ logout function not found"
    exit 1
fi

if grep -q "window.showTab" KPN_System_Workbook.html; then
    echo "✅ showTab function defined"
else
    echo "❌ showTab function not found"
    exit 1
fi

# Test 3: Check if onclick handlers exist for authentication buttons
if grep -q 'onclick="signInWithFirebase()"' KPN_System_Workbook.html; then
    echo "✅ Sign in button onclick handler found"
else
    echo "❌ Sign in button onclick handler missing"
    exit 1
fi

if grep -q 'onclick="createAccountWithFirebase()"' KPN_System_Workbook.html; then
    echo "✅ Create account button onclick handler found"
else
    echo "❌ Create account button onclick handler missing"
    exit 1
fi

# Test 4: Check if Firebase SDK is loaded
if grep -q "firebase-app-compat.js" KPN_System_Workbook.html; then
    echo "✅ Firebase app SDK loaded"
else
    echo "❌ Firebase app SDK not loaded"
    exit 1
fi

if grep -q "firebase-auth-compat.js" KPN_System_Workbook.html; then
    echo "✅ Firebase auth SDK loaded"
else
    echo "❌ Firebase auth SDK not loaded"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Firebase authentication buttons should be functional."
echo "   Functions are defined in global scope and accessible to onclick handlers."
echo ""
echo "Manual Testing:"
echo "1. Open KPN_System_Workbook.html in a browser"
echo "2. Enter email and password in the authentication form"
echo "3. Click 'Sign In with Firebase' - should show success message"
echo "4. Click 'Create New Account' - should show success message"
echo ""
echo "Note: Full Firebase integration requires network access to Firebase services."