# Kinben KPN Component Libraries

Centralized repository for all Kinben component libraries, schematics, footprints, 3D models, and approved KPN (Kinben Part Number) components.

## Repository Structure

```
kinben-kpn-libs/
├── schematics/           # Schematic symbols (.lib, .kicad_sym)
│   ├── passives/
│   ├── semiconductors/
│   ├── connectors/
│   └── modules/
├── footprints/           # PCB footprints (.pretty, .kicad_mod)
│   ├── passives/
│   ├── semiconductors/
│   ├── connectors/
│   └── modules/
├── 3d_models/           # 3D component models (.step, .wrl)
│   ├── passives/
│   ├── semiconductors/
│   ├── connectors/
│   └── modules/
└── kpn_registry/        # Approved KPN component database
    └── kpn_master.csv
```

## KPN Policy

### Mandatory Usage
- **All designs MUST use only approved KPN components** from the master registry
- **No exceptions** - if a component isn't in the registry, it cannot be used
- All KPNs must have corresponding schematic symbol, footprint, and 3D model

### Adding New Components
1. Create PR with component details in `kpn_registry/kpn_master.csv`
2. Include schematic symbol, footprint, and 3D model files
3. Provide complete supplier information and technical specifications
4. PR requires engineering team approval before merge
5. Once approved, component receives official KPN and becomes available for use

### Library Maintenance
- Keep all symbols, footprints, and 3D models synchronized with KPN registry
- Version control all library files
- Regular audits to ensure compliance and remove obsolete components