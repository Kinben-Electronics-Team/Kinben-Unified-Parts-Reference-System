interface TabNavigationProps {
  activeSheet: string;
  onSheetChange: (sheet: string) => void;
}

export function TabNavigation({ activeSheet, onSheetChange }: TabNavigationProps) {
  const tabs = [
    { id: 'landing', label: '📊 Dashboard' },
    { id: 'systems', label: '🏗️ SYSTEMS', color: 'border-l-4 border-green-600' },
    { id: 'assemblies', label: '🔧 ASSEMBLIES', color: 'border-l-4 border-green-600' },
    { id: 'pcbs', label: '🟩 PCBs', color: 'border-l-4 border-green-600' },
    { id: '3d-parts', label: '🖨️ 3D PARTS', color: 'border-l-4 border-green-600' },
    { id: 'cable-assemblies', label: '🔗 CABLE ASSY', color: 'border-l-4 border-green-600' },
    { id: 'add-component', label: '➕ Add Component', color: '' },
    { id: 'bulk-import', label: '📥 Bulk Import', color: '' },
    { id: 'capacitors', label: '🔋 CAPACITORS', color: '' },
    { id: 'resistors', label: '⚡ RESISTORS', color: '' },
    { id: 'inductors', label: '🌀 INDUCTORS', color: '' },
    { id: 'diodes', label: '💡 DIODES', color: '' },
    { id: 'transistors', label: '🔧 TRANSISTORS', color: '' },
    { id: 'ics', label: '🖥️ ICs', color: '' },
    { id: 'connectors', label: '🔌 CONNECTORS', color: '' },
    { id: 'crystals', label: '🔮 CRYSTALS', color: '' },
    { id: 'fuses', label: '🛡️ FUSES', color: '' },
    { id: 'switches', label: '🔘 SWITCHES', color: '' },
    { id: 'relays', label: '🔄 RELAYS', color: '' },
    { id: 'optocouplers', label: '💡 OPTOCOUPLERS', color: '' },
    { id: 'sensors', label: '📡 SENSORS', color: '' },
    { id: 'mechanical', label: '⚙️ MECHANICAL', color: '' },
    { id: 'hardware', label: '🔩 HARDWARE', color: '' },
    { id: 'cables', label: '🔗 CABLES', color: '' },
  ];

  return (
    <div className="sheet-tabs">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${activeSheet === tab.id ? 'active' : ''} ${tab.color}`}
          onClick={() => onSheetChange(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}