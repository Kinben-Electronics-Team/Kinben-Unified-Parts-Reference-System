# 📁 Local CSV Usage Guide - KPN System

## 🎯 Overview

The **KPN_System_Local.html** provides direct integration with CSV files stored locally on your computer. This allows you to work with component data stored in CSV format while maintaining full ERP functionality.

## 🚀 Quick Start

### 1. **Open the Application**
- Open `KPN_System_Local.html` in your web browser
- No installation required - works offline

### 2. **Connect to CSV Files**
- Click **"📁 Select CSV Files Directory"**
- Navigate to your repository folder
- Select the root folder containing `KPN Master Reference Sheet/CSV_Files/`
- Grant folder access permission

### 3. **Automatic Setup**
- App automatically finds the `CSV_Files` subdirectory
- Loads existing component data from CSV files
- Creates missing CSV files with proper headers if needed

## 📊 CSV File Structure

### **Unified Schema (24 Fields)**
All CSV files use the same standardized format:

```csv
Kinben_PN,Category,Subcategory,Value,Package,Manufacturer,Manufacturer_PN,Description,Voltage_Rating,Current_Rating,Tolerance,Mounting,Preferred_Supplier,Mouser_PN,DigiKey_PN,Unit_Cost,Stock_Level,Symbol_File,Footprint_File,3D_Model_File,Datasheet_URL,Status,Created_Date,Notes
```

### **Supported CSV Files**
- `RESISTORS.csv` - Resistor components
- `CAPACITORS.csv` - Capacitor components  
- `INDUCTORS.csv` - Inductor components
- `DIODES.csv` - Diode components
- `TRANSISTORS.csv` - Transistor components
- `INTEGRATED_CIRCUITS.csv` - IC components
- `CONNECTORS.csv` - Connector components
- `SWITCHES.csv` - Switch components
- `CRYSTALS_OSCILLATORS.csv` - Crystal/oscillator components
- `LEDS.csv` - LED components
- `FUSES.csv` - Fuse components
- `RELAYS.csv` - Relay components  
- `SENSORS.csv` - Sensor components
- `OPTOCOUPLERS.csv` - Optocoupler components
- `HARDWARE.csv` - Hardware components
- `MECHANICAL.csv` - Mechanical components
- `kpn_master.csv` - Master component list (optional)

## 🔄 How It Works

### **Real-time Synchronization**
- **Add Component**: Automatically written to appropriate CSV file
- **Edit Component**: Updates CSV file immediately
- **Archive/Delete**: Reflects in CSV files instantly

### **Data Flow**
1. **Startup**: Load all CSV files → Display in app
2. **User Action**: Add/edit component in app
3. **Auto-sync**: Component saved to localStorage + CSV file
4. **Status Update**: "✅ X components synced to Y CSV files"

### **Browser Compatibility**
- **Chrome/Edge 88+**: Full CSV file access ✅
- **Safari 15.2+**: Full CSV file access ✅
- **Firefox**: Automatic fallback to localStorage + manual export
- **Older Browsers**: localStorage only

## 🛠️ Features

### **Directory Management**
- **Change Directory**: Switch to different CSV folder
- **Reload Data**: Refresh from current CSV files  
- **Empty Directory Handling**: Auto-create blank CSV files

### **Data Safety**
- **Dual Storage**: CSV files + localStorage backup
- **Real-time Sync**: Changes written immediately
- **Error Handling**: Fallback to localStorage if CSV write fails

### **Status Indicators**
- 🟢 **"✅ Connected to CSV files"** - Full CSV functionality
- 🟡 **"🔄 Syncing to CSV files..."** - Write operation in progress  
- 🔴 **"❌ CSV access failed"** - Using localStorage fallback
- 🟠 **"⚠️ CSV sync failed"** - Data saved to localStorage only

## 📋 Usage Examples

### **Example 1: New Project Setup**
1. Create new folder for your project
2. Open `KPN_System_Local.html`
3. Click "Select CSV Files Directory" → choose your folder
4. App asks: "Create blank CSV files?" → Click OK
5. Start adding components - they're automatically saved to CSV files

### **Example 2: Existing Data**
1. Point app to folder with existing CSV files
2. App automatically loads all component data
3. Edit components - changes sync to CSV files immediately
4. Use "Change Directory" to switch between projects

### **Example 3: Collaboration**
1. Store CSV files in shared folder (Dropbox, OneDrive, etc.)
2. Team members point their local apps to shared folder
3. Changes from each user sync to shared CSV files
4. Real-time collaboration on component database

## 🔧 Troubleshooting

### **Common Issues**

**"Must be handling a user gesture" Error**
- **Cause**: Trying to access files without user interaction
- **Solution**: Click buttons directly, don't use browser back/forward

**"No CSV files found" Dialog**
- **Options**: Create blank files OR select different directory
- **Tip**: Click Cancel to go back to directory selection

**Components Not Syncing**
- **Check**: Browser console for error messages
- **Solution**: Try "Reload CSV Files" button
- **Backup**: Data always saved to localStorage

**Browser Not Supported**
- **Chrome/Edge**: Update to version 88 or higher
- **Safari**: Update to version 15.2 or higher  
- **Firefox**: Use localStorage mode + manual CSV export

## 🎯 Best Practices

### **File Organization**
```
Project Root/
├── KPN_System_Local.html
└── KPN Master Reference Sheet/
    └── CSV_Files/
        ├── RESISTORS.csv
        ├── CAPACITORS.csv
        └── [other component files...]
```

### **Data Management**
- **Regular Backups**: CSV files are your primary data store
- **Version Control**: Consider using Git for CSV file tracking
- **Team Coordination**: Use shared folders for collaboration
- **Testing**: Use empty folder to test new component structures

### **Performance Tips**
- **Large Datasets**: App handles 1000+ components efficiently
- **File Size**: Each CSV file can contain hundreds of components
- **Memory Usage**: Data cached in browser for fast access
- **Sync Speed**: Real-time writes typically complete in <100ms

## 📞 Support

### **Getting Help**
- **Browser Console**: Check for error messages (F12 → Console)
- **Status Messages**: Watch CSV status indicator for feedback
- **Fallback Mode**: App always works with localStorage if CSV fails

### **File Format Issues**
- **Encoding**: CSV files should be UTF-8 encoded
- **Line Endings**: Both Windows (CRLF) and Unix (LF) supported
- **Quotes**: Commas and quotes in data are automatically escaped

---

**Last Updated**: July 29, 2025  
**Version**: Local CSV Edition v1.0  
**Compatibility**: Chrome 88+, Safari 15.2+, Firefox (fallback mode)