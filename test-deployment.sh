#!/bin/bash

# Test Firebase Deployment Script
# Verifies that the live site is working correctly

echo "🔍 Testing Firebase Deployment"
echo "=============================="

# Test URLs
FIREBASE_URL="https://the-clever-studio-f3b16.web.app/KPS/"
GITHUB_PAGES_URL="https://kinben-electronics-team.github.io/Kinben-Unified-Parts-Reference-System/"

echo "📡 Testing Firebase site..."
if curl -s --head "$FIREBASE_URL" | head -n 1 | grep -q "200 OK"; then
    echo "✅ Firebase site is accessible"
else
    echo "❌ Firebase site is not accessible"
fi

echo "📡 Testing GitHub Pages site..."
if curl -s --head "$GITHUB_PAGES_URL" | head -n 1 | grep -q "200 OK"; then
    echo "✅ GitHub Pages site is accessible"
else
    echo "❌ GitHub Pages site is not accessible"
fi

echo ""
echo "🧪 Manual testing checklist:"
echo "- [ ] Open: $FIREBASE_URL"
echo "- [ ] Click 'Launch Application' button"
echo "- [ ] Test file upload functionality"
echo "- [ ] Test component addition"
echo "- [ ] Test search functionality"
echo "- [ ] Test export functions"
echo ""
echo "📊 Check build timestamp in page source for deployment verification"
echo "📋 View GitHub Actions: https://github.com/Kinben-Electronics-Team/Kinben-Unified-Parts-Reference-System/actions"