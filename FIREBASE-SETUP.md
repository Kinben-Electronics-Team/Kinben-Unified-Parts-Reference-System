# 🔥 Firebase Setup Guide - theclever.studio/KPS

## 🚀 Quick Deployment

### Step 1: Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or use existing project
3. **Project Name**: `kinben-parts-system` (or your choice)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Initialize Hosting
```bash
# In your project directory
npx firebase login
npx firebase init hosting
```

**Configuration answers:**
- **Select project**: Choose your Firebase project
- **Public directory**: `dist`
- **Single-page app**: `No`
- **Automatic builds**: `No`
- **Overwrite index.html**: `No`

### Step 3: Deploy
```bash
# Build and deploy in one command
npm run build
npm run deploy

# Or use the batch file
deploy-to-firebase.bat
```

## 🌐 Custom Domain Setup (theclever.studio/KPS)

### Step 1: Add Custom Domain
1. In Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter: `theclever.studio`
4. Follow verification steps

### Step 2: DNS Configuration
Add these DNS records to your domain provider:

```dns
# A Records (Firebase IP addresses)
A    theclever.studio    151.101.1.195
A    theclever.studio    151.101.65.195

# Or CNAME (alternative)
CNAME    theclever.studio    kinben-parts-system.web.app
```

### Step 3: Subdirectory Setup
The `/KPS` path is already configured in:
- `firebase.json` - Rewrite rules
- `build-for-firebase.js` - Build process
- All files will be accessible at `theclever.studio/KPS`

## 📁 Project Structure After Build

```
dist/
├── index.html              # Root redirect to /KPS
└── KPS/
    ├── index.html          # Landing page
    ├── KPN_System_Workbook.html
    ├── KPN Master Reference Sheet/
    ├── Kinben Basic Kicad Library/
    └── Project Templates/
```

## 🔧 Development Workflow

### Local Development
```bash
python serve.py              # Test locally
# Access: http://localhost:8080
```

### Firebase Deployment
```bash
npm run build               # Build for Firebase
npm run deploy              # Deploy to Firebase
# Access: https://theclever.studio/KPS
```

### Combined Workflow
```bash
# 1. Edit files in VS Code
# 2. Test locally
python serve.py

# 3. Deploy to Firebase
npm run build && npm run deploy

# 4. Also deploy to RPi (optional)
deploy-to-rpi.bat
```

## 🌐 Access Points After Setup

| Location | URL | Purpose |
|----------|-----|---------|
| **🌍 Global** | https://theclever.studio/KPS | Worldwide access |
| **🔥 Firebase** | https://kinben-parts-system.web.app | Firebase subdomain |
| **💻 Local Dev** | http://localhost:8080 | Development testing |
| **🥧 RPi Internal** | http://192.168.1.25:3000 | Company internal |
| **📶 RPi Hotspot** | http://192.168.4.1:3000 | Offline access |

## 🛠️ Firebase Commands

```bash
# Authentication
npx firebase login
npx firebase logout

# Project management
npx firebase projects:list
npx firebase use <project-id>

# Hosting
npx firebase deploy --only hosting
npx firebase hosting:channel:list
npx firebase hosting:sites:list

# Local preview
npx firebase serve --only hosting
npx firebase hosting:channel:deploy preview
```

## 📊 Firebase Console Features

### Hosting Dashboard
- **Traffic**: View page visits and bandwidth
- **Performance**: Page load speeds
- **Deployments**: Version history and rollbacks

### Analytics (Optional)
- **User tracking**: Visitor analytics
- **Usage patterns**: Most accessed features
- **Geographic data**: User locations

### Custom Domain Status
- **SSL Certificate**: Auto-provisioned
- **Domain verification**: Status check
- **CDN**: Global content delivery

## 🔐 Security & Performance

### Automatic Features
- ✅ **HTTPS/SSL**: Automatic certificate
- ✅ **Global CDN**: Fast worldwide loading
- ✅ **Gzip Compression**: Optimized delivery
- ✅ **Cache Headers**: Browser caching

### Security Headers
```json
{
  "headers": [
    {
      "source": "/KPS/**",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## 🚀 Going Live Checklist

- [ ] Firebase project created
- [ ] Domain `theclever.studio` verified
- [ ] DNS records configured
- [ ] First deployment completed
- [ ] SSL certificate active
- [ ] `/KPS` subdirectory working
- [ ] All components accessible
- [ ] Mobile responsiveness verified

## 🎯 Final Result

**Your Kinben Parts Reference System will be accessible at:**

### Primary URL: `https://theclever.studio/KPS`

- ✅ Professional branded URL
- ✅ Fast global CDN delivery
- ✅ Automatic HTTPS/SSL
- ✅ Mobile-optimized interface
- ✅ Zero server maintenance
- ✅ 99.99% uptime guarantee

**Ready to deploy to Firebase? Run:** `deploy-to-firebase.bat` 🚀