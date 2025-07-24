# Kinben Unified Parts Reference System - Deployment Guide

## 🚀 Live Deployment

This system is deployed and accessible at multiple locations:

### Firebase Hosting (Primary Production)
- **URL**: https://kinbenpartssystem.web.app/
- **Status**: 🚨 **BROKEN** - Auto-deployment not working
- **Features**: Outdated content (deployment automation failed)
- **Update Method**: ❌ **ISSUE**: GitHub Actions workflow not triggering

### GitHub Pages (Secondary)
- **URL**: https://manasdeore.github.io/Kinben-Unified-Parts-Reference-System/
- **Status**: ✅ Active
- **Features**: Full application with demo data

### Local Development
- Open `index.html` in any modern web browser
- No server required - runs entirely client-side
- All data stored in browser localStorage

## 📦 Automatic Deployment Options

### 🔥 Firebase (Recommended for Production)
**🚨 CURRENTLY BROKEN - Automatic deployment not working**

> ⚠️ **ISSUE**: GitHub Actions workflow exists but not triggering on push events. See Issue #6 for Copilot resolution.
> 
> 🔑 **Setup Complete**: Firebase Service Account is configured, but workflow triggering mechanism is broken.

```bash
# BROKEN: This should work but doesn't trigger deployment
git add .
git commit -m "Deploy updates"  
git push origin main  # ❌ Does not trigger GitHub Actions workflow
```

## 🚨 **CURRENT DEPLOYMENT PROBLEMS**

### Issue #6: GitHub Actions Workflow Not Triggering
- **Problem**: Deploy KPN System Workbook workflow exists but never runs
- **Evidence**: No workflow executions despite successful pushes to master
- **Impact**: Firebase site shows outdated content
- **Status**: Assigned to @copilot for resolution
- **Created**: 2025-07-24

### Workaround (Manual)
Currently no reliable workaround available. Waiting for workflow triggering fix.

**GitHub Actions Workflow:**
- Validates HTML and JavaScript
- Builds Firebase-ready distribution
- Deploys to Firebase hosting automatically
- Updates Firebase hosting with latest changes

### 1. GitHub Pages (Fallback)
```bash
# Already configured - just push to main branch
git add .
git commit -m "Deploy KPN System Workbook"
git push origin main
```

### 2. Netlify Deploy
```bash
# Drag and drop the entire folder to Netlify
# Or connect GitHub repository for auto-deployment
```

### 3. Vercel Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel --prod
```

### 4. Static Hosting
Upload the following files to any web server:
- `index.html` (Landing page)
- `KPN_System_Workbook.html` (Main application)

## 🔧 System Requirements

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Features
- 📱 Responsive design (works on mobile)
- 💾 Offline functionality
- 🖼️ Image upload support
- 📄 CSV/JSON export
- 🔍 Real-time search
- 📊 Live statistics

## 📚 Demo Content Included

### Systems (3)
- IoT Environmental Sensor Hub (Production)
- Smart Home Gateway (Prototype)
- Motor Control Evaluation Board (Evaluation)

### PCBs (7)
- 2L, 4L, 6L layer counts
- Flex, Rigid-Flex types
- Various sizes and applications

### 3D Parts (9)
- Enclosures (ABS, PC, PLA)
- Brackets (PETG, Nylon)
- Connectors (TPU)

### Cable Assemblies (8)
- Power, Data, RF, Control types
- Detailed connector specifications
- Component breakdowns

## 🛠️ Customization

### Branding
Edit the following in both files:
- Company name: "Kinben Electronics"
- Color scheme: CSS variables
- Logo: Replace favicon and header

### Categories
Modify `categoryConfigs` and `systemConfigs` objects in:
`KPN_System_Workbook.html` (lines 20-45)

### Part Number Format
Update the `generateSystemKN()` function to change:
- Prefixes (SKN, AKN, PKN, 3PN, CAN)
- Sequence numbering
- Subcategory codes

## 🔐 Data Management

### Backup
- Data stored in browser localStorage
- Export functions available for CSV/JSON
- No server-side database required

### Migration
- Import/export functionality included
- JSON format preserves all relationships
- CSV format for spreadsheet compatibility

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized forms for mobile input
- Swipe gestures for navigation

## 🔄 Updates

To update the deployment:
1. Modify files locally
2. Test in browser
3. Commit changes
4. Push to GitHub (auto-deploys via Pages)

## 🆘 Support

For issues or customization requests:
- Check browser console for errors
- Verify localStorage permissions
- Ensure JavaScript is enabled
- Test in incognito mode for clean slate

---

**Version**: 3.1.0  
**Last Updated**: July 24, 2025  
**Status**: Production Ready ✅
