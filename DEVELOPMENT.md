# 💻 Development Workflow Guide

## 🚀 Quick Start - Development Setup

### Option 1: Local Development with Manual Sync
```bash
# Start local development server
dev-server.bat
# OR
python serve.py

# Access at: http://localhost:8080
```

### Option 2: Auto-Sync Development (Recommended)
```bash
# Start auto-sync file watcher
python watch-and-sync.py
# OR
npm run watch

# Changes automatically sync to RPi after 2 seconds
```

### Option 3: Manual Deploy
```bash
# Deploy manually to RPi
deploy-to-rpi.bat
# OR
npm run deploy
```

## 🔧 Development Modes

### 1. **Local Development Only**
- Edit files with VS Code + GitHub Copilot
- Run `dev-server.bat` for local testing
- Access: http://localhost:8080

### 2. **Local + RPi Auto-Sync**
- Edit files with VS Code + GitHub Copilot  
- Run `watch-and-sync.py` in background
- Changes sync automatically to RPi
- Test locally: http://localhost:8080
- Test on RPi: http://192.168.1.25:3000

### 3. **GitHub + RPi Workflow**
- Edit files with VS Code + GitHub Copilot
- Commit & push to GitHub
- Run `deploy-to-rpi.bat` for manual sync
- RPi pulls latest from your commits

## 🔄 Auto-Sync Features

### File Watcher Monitors:
- ✅ HTML files (index.html, KPN_System_Workbook.html)
- ✅ JavaScript code
- ✅ CSS styles  
- ✅ JSON data files
- ✅ Python scripts
- ✅ CSV component data
- ✅ Markdown documentation

### Sync Process:
1. **File Change Detected** → 📝 Log change
2. **Wait 2 seconds** → ⏱️ Batch multiple changes
3. **Auto-commit** → 🔄 Git commit with timestamp
4. **Push to GitHub** → 📤 Backup to remote
5. **Transfer to RPi** → 🚀 SCP file transfer
6. **Restart Service** → ♻️ Reload application
7. **Verify Deploy** → ✅ Check service status

## 🛠️ GitHub Copilot Integration

### Perfect for:
- ✨ **Component Database Logic** - Auto-complete KPN generation
- 🔍 **Search & Filter Functions** - Complex JavaScript queries  
- 📊 **Data Export Features** - CSV/JSON formatting
- 🎨 **UI Components** - HTML/CSS responsive design
- 📱 **Mobile Optimization** - Touch-friendly interfaces
- 🔧 **Form Validation** - Input sanitization & checks

### Copilot Tips:
```javascript
// Example: Copilot can help generate KPN validation
function validateKPN(kpn) {
    // Copilot will suggest: regex patterns, format checking
}

// Example: Auto-complete component search
function searchComponents(query, category, filters) {
    // Copilot suggests: filtering logic, fuzzy search
}
```

## 📁 Key Development Files

### Core Application:
- **`KPN_System_Workbook.html`** - Main interactive application
- **`index.html`** - Landing page
- **`serve.py`** - Development server

### Development Tools:
- **`dev-server.bat`** - Local development server
- **`deploy-to-rpi.bat`** - Manual deployment script  
- **`watch-and-sync.py`** - Auto-sync file watcher
- **`package.json`** - NPM scripts configuration

### Data & Libraries:
- **`KPN Master Reference Sheet/CSV_Files/`** - Component database
- **`Kinben Basic Kicad Library/`** - PCB design libraries
- **`Project Templates/`** - Design standards

## 🔐 Workflow Security

### SSH Key Management:
- ✅ Uses passwordless SSH key authentication
- ✅ Keys stored in `../Kinben ERP Setup/raspberry_pi_key`
- ✅ Secure file transfer with SCP protocol

### Version Control:
- ✅ Auto-commits with timestamps
- ✅ GitHub backup for all changes
- ✅ Roll-back capability via Git history

## 🚀 Deployment Targets

### Development:
- **Local**: http://localhost:8080
- **RPi Dev**: http://192.168.1.25:3000

### Production:
- **Main Network**: http://192.168.1.25:3000
- **Wi-Fi Hotspot**: http://192.168.4.1:3000
- **GitHub Pages**: https://kinben-electronics-team.github.io/Kinben-Unified-Parts-Reference-System/

## 📊 Development Commands

```bash
# Local Development
python serve.py                    # Start local server
dev-server.bat                     # Windows local server

# Auto-Sync Development  
python watch-and-sync.py           # Start file watcher
npm run watch                      # NPM script version

# Manual Deployment
deploy-to-rpi.bat                  # Deploy to RPi
npm run deploy                     # NPM script version

# Git Operations
git add -A && git commit -m "msg"  # Manual commit
git push origin master             # Push to GitHub

# Service Management (on RPi)
sudo systemctl status kinben-parts-system.service
sudo systemctl restart kinben-parts-system.service
```

## 🔍 Troubleshooting

### Local Server Won't Start:
- Check if port 8080 is in use
- Verify Python 3 is installed
- Run from project root directory

### Auto-Sync Not Working:
- Install watchdog: `pip install watchdog`
- Check SSH key permissions
- Verify RPi network connectivity
- Check file paths in scripts

### RPi Service Issues:
- Check service status: `sudo systemctl status kinben-parts-system.service`
- View logs: `sudo journalctl -u kinben-parts-system.service -f`
- Restart service: `sudo systemctl restart kinben-parts-system.service`

### GitHub Sync Issues:
- Check Git remote: `git remote -v`
- Verify GitHub credentials
- Test push: `git push origin master`

## 🎯 Best Practices

### Development Workflow:
1. **Start Auto-Sync** → `python watch-and-sync.py`
2. **Open VS Code** → Edit files with Copilot
3. **Test Locally** → http://localhost:8080
4. **Auto-Deploy** → Changes sync to RPi automatically
5. **Test Production** → http://192.168.1.25:3000

### Code Organization:
- Keep HTML, CSS, JS in single file for simplicity
- Use semantic HTML5 elements
- Implement responsive design principles
- Follow KPN naming conventions
- Document component categories

### Testing Strategy:
- ✅ Test locally first
- ✅ Verify on RPi deployment
- ✅ Check mobile responsiveness
- ✅ Validate data export/import
- ✅ Test search functionality

---

## 🎉 Ready to Code!

Your development environment is now fully configured for:
- **Local development** with GitHub Copilot
- **Automatic synchronization** to Raspberry Pi
- **Version control** with Git/GitHub integration
- **Production deployment** on dual networks

**Happy coding! 🚀**