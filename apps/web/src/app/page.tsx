'use client';

import { useState } from 'react';
import { ComponentCategoryType } from '@kinben/shared-types';
import { ComponentDataManager } from '@kinben/data-model';
import { WorkbookHeader } from '@/components/WorkbookHeader';
import { TabNavigation } from '@/components/TabNavigation';
import { Dashboard } from '@/components/Dashboard';
import { ComponentSheet } from '@/components/ComponentSheet';

const componentDataManager = new ComponentDataManager();

export default function Home() {
  const [activeSheet, setActiveSheet] = useState<string>('landing');

  const renderActiveSheet = () => {
    switch (activeSheet) {
      case 'landing':
        return <Dashboard />;
      case 'capacitors':
        return <ComponentSheet 
          category="capacitors" 
          title="🔋 CAPACITORS - Category Code: CAP"
          dataManager={componentDataManager}
        />;
      case 'resistors':
        return <ComponentSheet 
          category="resistors" 
          title="⚡ RESISTORS - Category Code: RES"
          dataManager={componentDataManager}
        />;
      case 'inductors':
        return <ComponentSheet 
          category="inductors" 
          title="🌀 INDUCTORS - Category Code: IND"
          dataManager={componentDataManager}
        />;
      case 'diodes':
        return <ComponentSheet 
          category="diodes" 
          title="💡 DIODES - Category Code: DIO"
          dataManager={componentDataManager}
        />;
      case 'transistors':
        return <ComponentSheet 
          category="transistors" 
          title="🔧 TRANSISTORS - Category Code: TRN"
          dataManager={componentDataManager}
        />;
      case 'ics':
        return <ComponentSheet 
          category="ics" 
          title="🖥️ ICs - Category Code: IC"
          dataManager={componentDataManager}
        />;
      case 'connectors':
        return <ComponentSheet 
          category="connectors" 
          title="🔌 CONNECTORS - Category Code: CON"
          dataManager={componentDataManager}
        />;
      case 'crystals':
        return <ComponentSheet 
          category="crystals" 
          title="🔮 CRYSTALS - Category Code: XTL"
          dataManager={componentDataManager}
        />;
      case 'fuses':
        return <ComponentSheet 
          category="fuses" 
          title="🛡️ FUSES - Category Code: FUS"
          dataManager={componentDataManager}
        />;
      case 'switches':
        return <ComponentSheet 
          category="switches" 
          title="🔘 SWITCHES - Category Code: SW"
          dataManager={componentDataManager}
        />;
      case 'relays':
        return <ComponentSheet 
          category="relays" 
          title="🔄 RELAYS - Category Code: RLY"
          dataManager={componentDataManager}
        />;
      case 'optocouplers':
        return <ComponentSheet 
          category="optocouplers" 
          title="💡 OPTOCOUPLERS - Category Code: OPT"
          dataManager={componentDataManager}
        />;
      case 'sensors':
        return <ComponentSheet 
          category="sensors" 
          title="📡 SENSORS - Category Code: SEN"
          dataManager={componentDataManager}
        />;
      case 'mechanical':
        return <ComponentSheet 
          category="mechanical" 
          title="⚙️ MECHANICAL - Category Code: MEC"
          dataManager={componentDataManager}
        />;
      case 'hardware':
        return <ComponentSheet 
          category="hardware" 
          title="🔩 HARDWARE - Category Code: HW"
          dataManager={componentDataManager}
        />;
      case 'cables':
        return <ComponentSheet 
          category="cables" 
          title="🔗 CABLES - Category Code: CBL"
          dataManager={componentDataManager}
        />;
      default:
        return <div>Sheet not found</div>;
    }
  };

  return (
    <div className="workbook-container">
      <WorkbookHeader />
      <TabNavigation activeSheet={activeSheet} onSheetChange={setActiveSheet} />
      {renderActiveSheet()}
    </div>
  );
}