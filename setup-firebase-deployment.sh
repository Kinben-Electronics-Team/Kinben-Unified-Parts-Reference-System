#!/bin/bash

# Firebase Deployment Setup Script
# This script helps setup automatic Firebase deployment for GitHub Actions

echo "🔥 Firebase Deployment Setup for GitHub Actions"
echo "==============================================="

# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check Firebase login
echo "🔐 Checking Firebase authentication..."
if firebase projects:list &> /dev/null; then
    echo "✅ Firebase CLI authenticated"
else
    echo "❌ Firebase CLI not authenticated. Please run: firebase login"
    exit 1
fi

# Verify project exists
echo "🏗️  Verifying Firebase project..."
if firebase projects:list | grep -q "the-clever-studio-f3b16"; then
    echo "✅ Firebase project 'the-clever-studio-f3b16' found"
else
    echo "❌ Firebase project 'the-clever-studio-f3b16' not found"
    echo "Available projects:"
    firebase projects:list
    exit 1
fi

# Generate service account key
echo "🔑 Generating service account for GitHub Actions..."
echo ""
echo "To complete GitHub Actions setup, you need to:"
echo "1. Go to Firebase Console: https://console.firebase.google.com/"
echo "2. Select project 'the-clever-studio-f3b16'"
echo "3. Go to Project Settings > Service Accounts"
echo "4. Click 'Generate Private Key' and download the JSON file"
echo "5. In GitHub repository settings, go to Secrets and variables > Actions"
echo "6. Create a new repository secret named 'FIREBASE_SERVICE_ACCOUNT'"
echo "7. Paste the entire contents of the downloaded JSON file"
echo ""
echo "Alternative automatic setup (requires Firebase CLI v11.0.0+):"
echo "firebase init hosting:github"
echo ""

# Test build process
echo "🔨 Testing build process..."
npm run build

if [ -d "dist/KPS" ]; then
    echo "✅ Build successful - dist/KPS directory created"
    echo "📁 Files ready for deployment:"
    ls -la dist/KPS/
else
    echo "❌ Build failed - dist/KPS directory not found"
    exit 1
fi

echo ""
echo "🎉 Setup completed!"
echo "Once you've added the FIREBASE_SERVICE_ACCOUNT secret to GitHub,"
echo "deployments will happen automatically on every push to master/main branch."
echo ""
echo "🌐 Your site will be available at: https://the-clever-studio-f3b16.web.app/KPS/"