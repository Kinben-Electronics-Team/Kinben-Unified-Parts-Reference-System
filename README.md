# Kinben Unified Parts Reference System

Centralized EDA library and parts management system for all Kinben component libraries, KPN (Kinben Part Number) registry, project templates, and design resources.

## Repository Structure

```
Kinben-Unified-Parts-Reference-System/
├── KPN Master Reference Sheet/    # Master KPN component database
│   └── kpn_master.csv            # Approved component registry with supplier info
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
1. **Submit PR** with component details in `KPN Master Reference Sheet/kpn_master.csv`
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