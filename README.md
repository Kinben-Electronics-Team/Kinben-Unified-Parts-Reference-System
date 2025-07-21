# Kinben Unified Parts Reference System

Centralized EDA library and parts management system for all Kinben component libraries, KPN (Kinben Part Number) registry, project templates, and design resources.

## 🚀 Interactive KPN Management System

**Access the system**: Open `KPN_System_Workbook.html` in your browser for a full-featured component management interface.

### ✨ Features
- **📊 Real-time Dashboard** - Live statistics and component overview
- **➕ Interactive Component Addition** - Easy-to-use forms with auto-KPN generation
- **🔍 Search & Filter** - Find components across all categories
- **💾 Export Functionality** - CSV/JSON exports for individual categories or all data
- **📱 Mobile Responsive** - Works on all devices
- **🖥️ Excel Compatible** - Open HTML file directly in Excel with preserved formatting

### 🎯 Quick Start
1. Open `KPN_System_Workbook.html` in your browser
2. Click "Add Component" to add new parts with auto-generated KPNs
3. Browse categories to view existing components
4. Export data as CSV or JSON for external use

## Repository Structure

```
Kinben-Unified-Parts-Reference-System/
├── KPN_System_Workbook.html      # Interactive web-based KPN management system ⭐
├── KPN Master Reference Sheet/   # Master KPN component database
│   └── CSV_Files/               # CSV data files organized by category
│       ├── kpn_master.csv       # Original master registry
│       ├── CAPACITORS.csv       # Component category files
│       ├── RESISTORS.csv
│       └── ... (16 categories)
├── Kinben Basic KiCad Library/   # Complete KiCad library files
│   ├── 3d_models/               # 3D component models (.step, .stp)
│   ├── lib_fp/                  # PCB footprints (.pretty folders with .kicad_mod)
│   └── lib_sym/                 # Schematic symbols (.kicad_sym files)
├── Project Templates/            # Design templates and standards
│   └── kicad_bom_format.csv     # Standardized BOM export template
└── tools/                       # Utility scripts and automation tools
```

## KPN Management System

### Overview
The Kinben Part Number (KPN) system ensures standardized component usage across all projects through a centralized registry and approval workflow.

### Mandatory Usage Policy
- **All designs MUST use only approved KPN components** from the master reference sheet
- **No exceptions** - if a component isn't in the registry, it cannot be used in production designs
- All approved KPNs have corresponding schematic symbols, footprints, and 3D models in the KiCad library

### Adding New Components

#### Method 1: Interactive Web Interface (Recommended)
1. **Open KPN_System_Workbook.html** in your browser
2. **Click "Add Component"** tab or category-specific "Add" buttons
3. **Fill the form**: Select category/subcategory, KPN auto-generates
4. **Complete specifications**: Add all component details and supplier info
5. **Submit**: Component is added with proper formatting and validation

#### Method 2: Direct CSV/PR Method
1. **Submit PR** with component details in appropriate CSV file in `CSV_Files/`
2. **Include library files**: Add corresponding schematic symbol, footprint, and 3D model
3. **Complete documentation**: Provide supplier information, technical specs, and sourcing details
4. **Engineering approval**: PR requires team review and approval before merge
5. **KPN assignment**: Once approved, component receives official KPN and becomes available for use

### KPN Registry Fields
- **Kinben_PN**: Official Kinben part number
- **Value, Voltage, Package**: Component specifications
- **Type, Mounting**: Component category and mounting type
- **Manufacturer, Manufacturer_PN**: Original manufacturer details
- **Supplier information**: Preferred supplier, Mouser/DigiKey part numbers
- **Library references**: Links to schematic symbols, footprints, and 3D models
- **Notes**: Special handling or application notes

### Library Organization
- **Symbols**: Organized by component category in `lib_sym/`
- **Footprints**: Grouped in `.pretty` folders by component type in `lib_fp/`
- **3D Models**: Corresponding STEP/STP files in `3d_models/`
- **Version Control**: All library files are tracked and versioned with the registry

### Usage Guidelines
- Use project templates for consistent BOM formatting
- Reference KPN registry for all component selections
- Submit new component requests via PR process
- Maintain library synchronization between KPN registry and KiCad files
- Regular audits ensure compliance and remove obsolete components