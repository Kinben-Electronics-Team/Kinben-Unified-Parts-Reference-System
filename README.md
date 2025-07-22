# 🔧 Kinben Unified Parts Reference System

[![Deploy Status](https://github.com/Kinben-Electronics-Team/Kinben-Unified-Parts-Reference-System/workflows/Deploy%20KPN%20System%20Workbook/badge.svg)](https://github.com/Kinben-Electronics-Team/Kinben-Unified-Parts-Reference-System/actions)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://the-clever-studio-f3b16.web.app/KPS)
[![Version](https://img.shields.io/badge/Version-2.1-blue)](https://github.com/Kinben-Electronics-Team/Kinben-Unified-Parts-Reference-System/releases)

## 🚀 [**LAUNCH APPLICATION**](https://the-clever-studio-f3b16.web.app/KPS)

**🎯 SINGLE SOURCE OF TRUTH**: GitHub Repository → Automatic Firebase Deployment → Live Site

## 🌟 Live Production System

**Production URL**: [https://the-clever-studio-f3b16.web.app/KPS](https://the-clever-studio-f3b16.web.app/KPS)

**Deployment Flow**: 
- ✅ **Source**: This GitHub repository
- ✅ **Auto-Deploy**: Every push to `master` → Firebase
- ✅ **Live Site**: https://the-clever-studio-f3b16.web.app/KPS

The live demo includes:
- 🏗️ **3 Complete Systems** with full hierarchical breakdowns
- 🔧 **6 Assemblies** (PCBAs, mechanical, sensor modules)  
- 🟩 **7 PCBs** (2L-6L layer counts, flex, rigid-flex)
- 🖨️ **9 3D Parts** (various materials and applications)
- 🔗 **8 Cable Assemblies** (power, data, RF applications)

## 🌟 Project Overview

The **Kinben Unified Parts Reference System** is a centralized platform that consolidates all component libraries, part numbering systems, and design resources into a single, unified interface. It combines traditional KiCad library management with a modern, interactive web-based component management system.

### Key Features
- 🎯 **Centralized KPN Registry**: Unified part numbering system with 16+ component categories
- 🖥️ **Interactive Web Interface**: Modern browser-based management with real-time features
- 📚 **Complete KiCad Library**: 338+ library files including symbols, footprints, and 3D models
- 📊 **Real-time Analytics**: Live dashboards with component statistics and insights
- 🔍 **Advanced Search & Filter**: Full-text search across all component databases
- 💾 **Multi-format Export**: CSV/JSON export capabilities with Excel compatibility
- 📱 **Mobile Responsive**: Works seamlessly across all devices and platforms

## 🚀 Quick Start Guide

### 1. Access the System
Open `KPN_System_Workbook.html` in any modern web browser to access the interactive interface.

### 2. Main Capabilities
- **Dashboard**: View real-time statistics and system overview
- **Add Components**: Interactive forms with automatic KPN generation
- **Search System**: Global search across all component categories
- **Export Data**: Download component data in multiple formats
- **Category Management**: Browse and manage components by category

### 3. Excel Integration
The HTML file opens directly in Microsoft Excel while maintaining all interactive web features.

## 📁 Repository Structure

```
Kinben-Unified-Parts-Reference-System/
├── KPN_System_Workbook.html      # ⭐ Main interactive web interface
├── KPN Master Reference Sheet/   # Component database
│   └── CSV_Files/               # Organized by category (16 files)
│       ├── kpn_master.csv       # Master registry
│       ├── CAPACITORS.csv       # Individual category files
│       ├── RESISTORS.csv
│       ├── INDUCTORS.csv
│       ├── DIODES.csv
│       ├── TRANSISTORS.csv
│       ├── INTEGRATED_CIRCUITS.csv
│       ├── CONNECTORS.csv
│       ├── CRYSTALS_OSCILLATORS.csv
│       ├── SWITCHES.csv
│       ├── FUSES.csv
│       ├── RELAYS.csv
│       ├── OPTOCOUPLERS.csv
│       ├── SENSORS.csv
│       ├── MECHANICAL.csv
│       ├── HARDWARE.csv
│       └── LEDS.csv
├── Kinben Basic KiCad Library/   # Complete EDA library (338+ files)
│   ├── 3d_models/               # STEP/STP 3D component models
│   ├── lib_fp/                  # PCB footprints (.pretty folders)
│   └── lib_sym/                 # Schematic symbols (.kicad_sym)
├── Project Templates/            # Design standards and templates
│   └── kicad_bom_format.csv
├── tools/                       # Development utilities
├── CLAUDE.md                    # Development context and progress
└── README.md                    # This file
```

## 🔧 System Features

### Interactive Web Application (`KPN_System_Workbook.html`)

#### Dashboard Features
- **Real-time Statistics**: Live component counts and category breakdowns
- **Quick Actions**: Direct access to common tasks and functions
- **System Status**: Overview of database health and recent updates
- **Category Overview**: Visual representation of component distribution

#### Component Management
- **Auto-KPN Generation**: Automatic part number assignment following standardized format
- **Form Validation**: Comprehensive input validation and data integrity checks
- **Batch Operations**: Bulk component addition and modification capabilities
- **Status Tracking**: Component lifecycle management (Active/Pending/Obsolete)

#### Advanced Search System
- **Full-text Search**: Search across all component fields (KPN, manufacturer, description, etc.)
- **Category Filtering**: Filter results by component categories
- **Result Highlighting**: Visual highlighting of search terms in results
- **Export Search Results**: Download filtered search results in multiple formats

#### Category Page Features
- **Individual Filters**: Text search, manufacturer, status, package, and mounting filters
- **Active Filter Badges**: Visual indicators of applied filters with individual removal
- **Live Statistics**: Real-time counts showing visible/total components
- **Column Sorting**: Clickable headers with ascending/descending sort indicators
- **Smart Sorting**: Number, date, and string-aware sorting algorithms

### KPN Naming Convention
Format: `KPN-[CATEGORY]-[SUBCATEGORY]-[SEQUENCE]`

**Example**: `KPN-CAP-CER-001`, `KPN-RES-CHR-045`, `KPN-IC-MCU-012`

### Component Categories (16 Total)
1. **CAPACITORS** - Ceramic, Electrolytic, Tantalum, Film
2. **RESISTORS** - Chip, Current Sense, Precision, Power
3. **INDUCTORS** - Power, Signal, Ferrite Beads
4. **DIODES** - Switching, Zener, Schottky, LED
5. **TRANSISTORS** - BJT, MOSFET, FET variants
6. **INTEGRATED_CIRCUITS** - MCU, Analog, Digital, Power Management
7. **CONNECTORS** - Headers, JST, USB, Power, RF
8. **CRYSTALS_OSCILLATORS** - Crystals, Oscillators, Resonators
9. **SWITCHES** - Tactile, Toggle, DIP, Rotary
10. **FUSES** - PTC, Glass, Ceramic, Resettable
11. **RELAYS** - Electromechanical, Solid State
12. **OPTOCOUPLERS** - Digital, Analog, Gate Drive
13. **SENSORS** - Temperature, Pressure, Motion, Proximity
14. **MECHANICAL** - Heatsinks, Standoffs, Enclosures
15. **HARDWARE** - Screws, Nuts, Washers, Spacers
16. **LEDS** - Standard, RGB, High Power, Specialty

## 🎯 Usage Guidelines

### Component Addition Workflow
1. **Access Interface**: Open `KPN_System_Workbook.html`
2. **Select Category**: Choose appropriate component category
3. **Fill Details**: Complete all required technical specifications
4. **Auto-KPN**: System automatically generates sequential part number
5. **Validation**: Form validates data integrity and completeness
6. **Submit**: Component is added to local storage and ready for export

### Data Export & Integration
- **CSV Export**: Compatible with Excel, ERP systems, and databases
- **JSON Export**: For web applications and API integrations
- **Category-specific**: Export individual categories or complete database
- **Search Results**: Export filtered search results with applied criteria

### KiCad Library Integration
- **Symbol Files**: Located in `lib_sym/` organized by component type
- **Footprint Libraries**: `.pretty` folders in `lib_fp/` with `.kicad_mod` files
- **3D Models**: STEP/STP files in `3d_models/` for realistic rendering
- **Version Control**: All library files tracked and synchronized

## 🔒 Compliance & Standards

### Mandatory Usage Policy
- **All production designs MUST use only approved KPN components**
- **No exceptions** - unauthorized components cannot be used in production
- **Engineering approval required** for all new component additions
- **Library synchronization** maintained between KPN registry and KiCad files

### Quality Assurance
- **Data Validation**: Comprehensive input validation and integrity checks
- **Duplicate Prevention**: System prevents duplicate KPN assignments
- **Audit Trail**: Complete history of component additions and modifications
- **Regular Reviews**: Periodic audits to remove obsolete components

## 🛠️ Technical Implementation

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser localStorage for component persistence
- **Export**: Blob API for file generation and download
- **Responsive**: CSS Grid and Flexbox for mobile compatibility
- **Performance**: Optimized for large datasets with efficient DOM manipulation

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Development Features
- **No Dependencies**: Pure web technologies, no external libraries
- **Lightweight**: Single HTML file with embedded CSS/JS
- **Maintainable**: Clean, commented codebase with modular structure
- **Extensible**: Easy to add new categories and features

## 📈 System Statistics

- **Total Component Categories**: 16
- **KiCad Library Files**: 338+
- **3D Models**: 50+ STEP/STP files
- **Footprint Libraries**: 20+ organized collections
- **Symbol Libraries**: 15+ categorized symbol files
- **Project Templates**: Standardized BOM and design formats

## 🔄 Development & Maintenance

### Version Control
All changes are tracked through Git with comprehensive commit messages and regular pushes to maintain project continuity.

### Future Enhancements
- **Bulk Import**: CSV import functionality for existing component lists
- **API Integration**: Mouser/DigiKey integration for real-time pricing
- **User Management**: Role-based access and approval workflows
- **Advanced Analytics**: Component usage reporting and trend analysis

## 📞 Support & Contributing

For questions, issues, or contributions:
1. Check existing documentation in `CLAUDE.md`
2. Review component standards and guidelines
3. Submit pull requests with detailed descriptions
4. Ensure all new components include complete library files

## 📄 License & Usage Rights

This system is developed for Kinben Innovation Private Limited for internal component management and standardization across all engineering projects.

---

**Last Updated**: January 2025  
**System Version**: v2.0 (Interactive Web Application)  
**Status**: Production Ready - Fully Functional