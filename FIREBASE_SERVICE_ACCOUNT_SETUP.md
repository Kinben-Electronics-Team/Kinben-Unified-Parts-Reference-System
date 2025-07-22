# 🔑 Firebase Service Account Setup for GitHub Actions

This guide explains how to set up automatic Firebase deployment using GitHub Actions.

## 🎯 Current Status

✅ **GitHub Actions workflow configured**  
❓ **Firebase Service Account needed for authentication**  
🎯 **Goal**: Auto-deploy to https://the-clever-studio-f3b16.web.app/KPS on every push

## 🔧 Setup Instructions

### Method 1: Manual Service Account Setup

#### Step 1: Generate Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project **`the-clever-studio-f3b16`**
3. Click the ⚙️ gear icon → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate Private Key**
6. Download the JSON file (keep it secure!)

#### Step 2: Add Secret to GitHub
1. Go to GitHub repository: [Settings → Secrets and variables → Actions](https://github.com/Kinben-Electronics-Team/Kinben-Unified-Parts-Reference-System/settings/secrets/actions)
2. Click **New repository secret**
3. Name: `FIREBASE_SERVICE_ACCOUNT`
4. Value: Paste the **entire contents** of the downloaded JSON file
5. Click **Add secret**

### Method 2: Automatic Setup (Recommended)

#### Option A: Using Firebase CLI
```bash
# Must be run by repository owner
firebase init hosting:github

# Follow prompts:
# - Select existing project: the-clever-studio-f3b16
# - Setup GitHub Action: Yes
# - Repository: Kinben-Electronics-Team/Kinben-Unified-Parts-Reference-System
# - Deploy on merge: Yes
# - Deploy with PR previews: Optional
```

#### Option B: Using gh CLI (if available)
```bash
# Generate and add secret automatically
firebase apps:sdks:config --project=the-clever-studio-f3b16 | gh secret set FIREBASE_SERVICE_ACCOUNT
```

## 🧪 Testing the Setup

### 1. Verify Secret is Added
- Go to [Repository Secrets](https://github.com/Kinben-Electronics-Team/Kinben-Unified-Parts-Reference-System/settings/secrets/actions)
- Confirm `FIREBASE_SERVICE_ACCOUNT` secret exists

### 2. Test Deployment
```bash
# Make a small change and push
echo "<!-- Test deployment $(date) -->" >> index.html
git add .
git commit -m "Test automatic Firebase deployment"
git push origin main
```

### 3. Monitor GitHub Actions
- Go to [Actions tab](https://github.com/Kinben-Electronics-Team/Kinben-Unified-Parts-Reference-System/actions)
- Watch the deployment workflow
- Check for ✅ success on both GitHub Pages and Firebase steps

### 4. Verify Live Site
- Check: https://the-clever-studio-f3b16.web.app/KPS/
- Confirm changes are live
- Test launch button and file upload functionality

## 🐛 Troubleshooting

### Common Issues

#### ❌ "Error: HTTP Error: 403, Request had insufficient authentication scopes"
- **Solution**: Regenerate service account key with full permissions
- Go to Firebase Console → IAM & Admin → Service Accounts
- Create new key for Firebase Admin SDK service account

#### ❌ "Error: Firebase project not found"
- **Solution**: Verify project ID in `.firebaserc` and workflow files
- Current project ID: `the-clever-studio-f3b16`

#### ❌ "Error: Invalid service account"
- **Solution**: Ensure JSON is copied completely without formatting changes
- Validate JSON syntax using [JSONLint](https://jsonlint.com/)

#### ❌ Deployment succeeds but site not updated
- **Solution**: Check browser cache, try incognito mode
- Firebase CDN may take 5-10 minutes to propagate globally

## 📊 Expected Results

### ✅ Successful Setup Indicators
- GitHub Actions workflow completes without errors
- Both GitHub Pages and Firebase deployments succeed
- Live site shows latest changes within minutes
- Launch button works correctly
- File upload/download functionality restored

### 🌐 Live URLs After Setup
- **Primary**: https://the-clever-studio-f3b16.web.app/KPS/
- **Secondary**: https://kinben-electronics-team.github.io/Kinben-Unified-Parts-Reference-System/

## 📋 Next Steps After Setup

1. **Test all functionality** on the live site
2. **Update issue status** to confirm deployment works
3. **Remove any old manual deployment processes**
4. **Document the new workflow** for team members

---

**Need Help?** Check the [GitHub Actions logs](https://github.com/Kinben-Electronics-Team/Kinben-Unified-Parts-Reference-System/actions) for detailed error messages.