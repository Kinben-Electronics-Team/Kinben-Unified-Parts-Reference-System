# KPN System - CSV Database Working Project

## 🚀 **WORKING PROJECT** - Not a POC anymore!

This is now a **fully functional KPN (Kinben Part Number) management system** using CSV files as the database backend.

## Quick Start

### 1. Start the Server
```bash
npm install
npm start
```
Server runs on http://localhost:3000

### 2. Use the API

#### Add a Component
```bash
curl -X POST http://localhost:3000/api/components/CAPACITORS \
  -H "Content-Type: application/json" \
  -d '{
    "Value": "100nF",
    "Voltage_Rating": "50V", 
    "Package": "0603",
    "Mounting": "SMD",
    "Manufacturer": "Murata",
    "Description": "Ceramic Capacitor 100nF 50V X7R 0603 SMD",
    "Status": "Active",
    "subcategory": "CER"
  }'
```

#### Get Components
```bash
curl http://localhost:3000/api/components/CAPACITORS
```

#### Generate Next KPN
```bash
curl http://localhost:3000/api/kpn/CAPACITORS/CER
```

### 3. Access Web Interface
Open http://localhost:3000 in your browser

## Features Working

✅ **CSV Database Backend**
- Real file persistence to CSV files
- 16 component categories supported
- Auto-generated KPN sequences
- Professional CSV structure (33 fields)

✅ **REST API**
- Full CRUD operations
- Error handling
- Data validation
- Sequential KPN generation

✅ **Production Ready**
- Proper file system operations
- Backup/restore capability  
- Excel compatibility
- Git version control

## CSV Files Location
```
KPN Master Reference Sheet/CSV_Files/
├── CAPACITORS.csv
├── RESISTORS.csv  
├── INTEGRATED_CIRCUITS.csv
└── ... (13 more categories)
```

## Example Working Data
```csv
Kinben_PN,Value,Voltage_Rating,Package,Mounting,Manufacturer,Description,Status
KPN-CAP-CER-0001,100nF,50V,0603,SMD,Murata,Ceramic Capacitor 100nF 50V X7R 0603 SMD,Active
KPN-RES-STD-0001,10K,,0603,SMD,Vishay,Resistor 10K Ohm 5% 0603 SMD,Active  
KPN-IC-MCU-0001,STM32F103,,LQFP48,SMD,STMicroelectronics,32-bit ARM Cortex-M3 Microcontroller,Active
```

## Architecture

**Backend**: Node.js + Express + CSV file operations  
**Database**: CSV files (one per component category)  
**Frontend**: HTML + JavaScript + API integration  
**KPN Format**: `KPN-[CATEGORY]-[SUBCATEGORY]-[SEQUENCE]`  

## Status: WORKING PROJECT ✅

This system now provides:
- Real data persistence 
- Professional CSV database
- Production-ready API
- Scalable architecture
- Excel integration
- Version control support

**No longer a POC - This is a working project ready for production use!**