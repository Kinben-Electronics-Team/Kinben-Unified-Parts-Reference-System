# 🚀 Quick Start - Development & Deployment

## ⚡ 30-Second Start Guide

### Local Development
```bash
# Start local server
dev-server.bat
# Open: http://localhost:8080
```

### Deploy to Firebase 🔥
```bash
# Deploy to Firebase (Global Access)
deploy-to-firebase.bat
# Access: https://theclever.studio/KPS
```

### Deploy to RPi
```bash
# Deploy to Raspberry Pi (Local Access)
deploy-to-rpi.bat
# Access: http://192.168.1.25:3000
```

### Auto-Sync Development
```bash
# Start file watcher (auto-deploy on save)
python watch-and-sync.py
# Edit files → Auto-sync to RPi in 2 seconds
```

## 🔧 Development Environment

### What You Have:
✅ **Local Development Server** - `dev-server.bat`  
✅ **Auto-Deploy Script** - `deploy-to-rpi.bat`  
✅ **File Watcher** - `watch-and-sync.py`  
✅ **GitHub Copilot Ready** - Full VS Code integration  
✅ **RPi Live Deployment** - http://192.168.1.25:3000  
✅ **Health Monitoring** - Auto-recovery included  

### GitHub Copilot Tips:
- Open in VS Code for full Copilot integration
- Copilot excels at JavaScript/HTML for this project
- Ask Copilot to help with KPN generation logic
- Use Copilot for responsive CSS improvements
- Get help with search/filter algorithms

## 🌐 Access Points

| Location | URL | Purpose |
|----------|-----|---------|
| **🌍 Global** | https://theclever.studio/KPS | Worldwide access |
| **💻 Local Dev** | http://localhost:8080 | Development & testing |
| **🥧 RPi Main** | http://192.168.1.25:3000 | Internal company access |
| **📶 RPi Hotspot** | http://192.168.4.1:3000 | Wi-Fi hotspot access |
| **📁 File Server** | http://192.168.1.25 | Main landing page |

## 📁 Key Files to Edit

### Core Application:
- **`KPN_System_Workbook.html`** - Main interactive app
- **`index.html`** - Landing page
- **`serve.py`** - Development server

### Data Files:
- **`KPN Master Reference Sheet/CSV_Files/*.csv`** - Component data
- **`package.json`** - NPM scripts

## 🔄 Development Workflow Options

### Option 1: Manual Deploy
1. Edit files in VS Code with Copilot
2. Test locally: `dev-server.bat`
3. Deploy to RPi: `deploy-to-rpi.bat`

### Option 2: Auto-Sync (Recommended)
1. Start watcher: `python watch-and-sync.py`
2. Edit files in VS Code with Copilot
3. Save → Auto-deploy to RPi (2 sec delay)

### Option 3: GitHub Workflow
1. Edit & commit to GitHub
2. On RPi: `./update-from-github.sh`

## 🛠️ Development Commands

```bash
# Local Development
dev-server.bat                 # Start local server

# Deployment
deploy-to-rpi.bat             # Deploy to RPi
npm run deploy                # NPM deploy script

# Auto-Sync
python watch-and-sync.py      # File watcher
npm run watch                 # NPM watch script

# RPi Updates
./update-from-github.sh       # Pull from GitHub (on RPi)
```

## 🚀 Ready to Code!

Your development environment is fully configured:

1. **Edit** files with VS Code + GitHub Copilot
2. **Test** locally at http://localhost:8080
3. **Deploy** with `deploy-to-rpi.bat` or auto-sync
4. **Access** production at http://192.168.1.25:3000

**Happy coding! 🎉**