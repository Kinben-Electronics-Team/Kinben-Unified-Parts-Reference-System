// Sample test data for various form types

export const sampleTestData = {
  systems: {
    systemName: 'Test Environmental Monitoring System',
    systemType: 'Electronic',
    systemVersion: '2.1',
    systemOwner: 'Test Engineer',
    systemDescription: 'Complete environmental monitoring solution with sensors, data logging, and cloud connectivity for automated testing'
  },

  assemblies: {
    assemblyName: 'Main Controller Assembly',
    assemblyType: 'PCBA',
    assemblyVersion: '1.3',
    assemblyDescription: 'Primary control board assembly with microcontroller, power management, and communication interfaces'
  },

  pcbs: {
    pcbName: 'Sensor Interface PCB',
    pcbType: 'Rigid',
    pcbLayers: '4',
    pcbSize: '75x50',
    pcbThickness: '1.6',
    pcbDescription: 'Four-layer PCB for sensor signal conditioning and analog-to-digital conversion'
  },

  'cable-assemblies': {
    cableName: 'Power Distribution Cable',
    cableType: 'Power',
    cableLength: '300mm',
    cableConnectors: 'JST-XH 6-pin to Terminal Block 6-way',
    cableDescription: 'Custom power distribution cable for multi-voltage supply routing with strain relief'
  },

  '3d-parts': {
    partName: 'Sensor Housing',
    partType: 'Enclosure', 
    material: 'PETG',
    partDescription: '3D printed protective housing for environmental sensors with IP65 rating compatibility'
  },

  components: {
    // Sample component data for different categories
    capacitors: {
      partNumber: 'C0805C104K5RACTU',
      manufacturer: 'KEMET',
      value: '100nF',
      voltage: '50V',
      tolerance: '±10%',
      package: '0805',
      mounting: 'SMD'
    },

    resistors: {
      partNumber: 'RC0805FR-074K7L',
      manufacturer: 'Yageo',
      value: '4.7kΩ',
      power: '1/8W',
      tolerance: '±1%',
      package: '0805',
      mounting: 'SMD'
    },

    connectors: {
      partNumber: 'JST-PH-6A',
      manufacturer: 'JST',
      type: 'Wire-to-Board',
      pins: '6',
      pitch: '2.0mm',
      mounting: 'THT'
    }
  }
};

export const expectedFormFields = {
  systems: [
    'systemName', 'name', 'systemType', 'type', 
    'systemVersion', 'version', 'systemOwner', 'owner', 
    'systemDescription', 'description'
  ],

  assemblies: [
    'assemblyName', 'name', 'assemblyType', 'type',
    'assemblyVersion', 'version', 'assemblyDescription', 'description'
  ],

  pcbs: [
    'pcbName', 'name', 'pcbType', 'type', 
    'pcbLayers', 'layers', 'pcbSize', 'size',
    'pcbThickness', 'thickness', 'pcbDescription', 'description'
  ],

  'cable-assemblies': [
    'cableName', 'name', 'cableType', 'type',
    'cableLength', 'length', 'cableConnectors', 'connectors',
    'cableDescription', 'description'
  ],

  '3d-parts': [
    'partName', 'name', 'partType', 'type',
    'material', 'partDescription', 'description'
  ]
};

export const tabDisplayNames = {
  'dashboard': '📊 Dashboard',
  'systems': '🏗️ SYSTEMS',
  'assemblies': '🔧 ASSEMBLIES', 
  'pcbs': '🟩 PCBs',
  '3d-parts': '🖨️ 3D PARTS',
  'cable-assemblies': '🔗 CABLE ASSY',
  'add-component': '➕ Add Component',
  'bulk-import': '📥 Bulk Import',
  'capacitors': '🔋 CAPACITORS',
  'resistors': '⚡ RESISTORS',
  'inductors': '🌀 INDUCTORS',
  'diodes': '💡 DIODES',
  'transistors': '🔧 TRANSISTORS',
  'ics': '🖥️ ICs',
  'connectors': '🔌 CONNECTORS',
  'crystals': '🔮 CRYSTALS',
  'fuses': '🛡️ FUSES',
  'switches': '🔘 SWITCHES',
  'relays': '🔄 RELAYS',
  'optocouplers': '💡 OPTOCOUPLERS',
  'sensors': '📡 SENSORS',
  'mechanical': '⚙️ MECHANICAL',
  'hardware': '🔩 HARDWARE',
  'cables': '🔌 CABLES'
};