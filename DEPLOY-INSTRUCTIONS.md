# 🚀 Deploy to theclever.studio/KPS - Step by Step

## 📋 Prerequisites
- ✅ Firebase CLI installed (Done)
- ✅ Build scripts created (Done)
- ✅ Project configured (Done)

## 🔥 Firebase Setup (One-time only)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "**Create a project**"
3. **Project name**: `kinben-parts-system`
4. **Google Analytics**: Enable (recommended)
5. Click "**Create project**"

### Step 2: Initialize Firebase
```bash
# Run in your project directory
npx firebase login
npx firebase init hosting
```

**When prompted, select:**
- **Existing project**: Choose `kinben-parts-system`
- **Public directory**: `dist` ✅
- **Single-page app**: `No` ✅
- **Automatic builds**: `No` ✅
- **Overwrite files**: `No` ✅

### Step 3: First Deployment
```bash
# Build and deploy
deploy-to-firebase.bat
```

## 🌐 Custom Domain Setup

### Step 1: Add Custom Domain
1. In **Firebase Console** → **Hosting**
2. Click "**Add custom domain**"
3. Enter: `theclever.studio`
4. Click "**Continue**"

### Step 2: Verify Domain Ownership
Firebase will provide a **TXT record**:
```dns
TXT  theclever.studio  firebase=kinben-parts-system
```

**Add this to your domain DNS settings** (your domain provider).

### Step 3: Configure DNS
Once verified, add these **A records**:
```dns
A  theclever.studio  151.101.1.195
A  theclever.studio  151.101.65.195
```

**Or use CNAME** (alternative):
```dns
CNAME  theclever.studio  kinben-parts-system.web.app
```

### Step 4: Wait for SSL
- **SSL Certificate**: Auto-provisioned (may take up to 24 hours)
- **Status**: Check in Firebase Console

## 🎯 Final Result

After setup, your application will be live at:

### 🌍 **https://theclever.studio/KPS**

**Features:**
- ✅ Global CDN (fast worldwide)
- ✅ Automatic HTTPS/SSL
- ✅ Professional branded URL
- ✅ Mobile responsive
- ✅ 99.99% uptime
- ✅ Zero maintenance

## 🔄 Development Workflow

### Daily Workflow:
1. **Edit** files in VS Code with GitHub Copilot
2. **Test** locally: `python serve.py`
3. **Deploy** globally: `deploy-to-firebase.bat`

### Commands:
```bash
# Local development
python serve.py
# → http://localhost:8080

# Global deployment  
deploy-to-firebase.bat
# → https://theclever.studio/KPS

# RPi deployment (optional)
deploy-to-rpi.bat
# → http://192.168.1.25:3000
```

## ⚡ Quick Commands

```bash
# Build only
npm run build

# Deploy only (after build)
npx firebase deploy --only hosting

# Build + Deploy
npm run deploy
# OR
deploy-to-firebase.bat

# Check deployment
npx firebase hosting:channel:list
```

## 🎉 You're Ready!

**Next steps:**
1. Run `deploy-to-firebase.bat`
2. Follow the Firebase setup prompts
3. Configure your domain DNS
4. Your KPS will be live at `theclever.studio/KPS`

**Need help?** Check `FIREBASE-SETUP.md` for detailed troubleshooting.