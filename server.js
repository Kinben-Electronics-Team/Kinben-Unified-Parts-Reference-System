const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// CSV Files Directory
const CSV_DIR = path.join(__dirname, 'KPN Master Reference Sheet', 'CSV_Files');

// Component Categories Configuration
const CATEGORIES = {
  'CAPACITORS': {
    code: 'CAP',
    file: 'CAPACITORS.csv',
    subcategories: ['CER', 'ELE', 'TAN', 'FIL']
  },
  'RESISTORS': {
    code: 'RES',
    file: 'RESISTORS.csv',
    subcategories: ['STD', 'PRE', 'VAR', 'NET']
  },
  'INDUCTORS': {
    code: 'IND',
    file: 'INDUCTORS.csv',
    subcategories: ['PWR', 'CHK', 'FER']
  },
  'DIODES': {
    code: 'DIO',
    file: 'DIODES.csv',
    subcategories: ['STD', 'LED', 'ZEN', 'SCH']
  },
  'TRANSISTORS': {
    code: 'TRA',
    file: 'TRANSISTORS.csv',
    subcategories: ['BJT', 'FET', 'MOS']
  },
  'INTEGRATED_CIRCUITS': {
    code: 'IC',
    file: 'INTEGRATED_CIRCUITS.csv',
    subcategories: ['MCU', 'ANA', 'DIG', 'PWR']
  },
  'CONNECTORS': {
    code: 'CON',
    file: 'CONNECTORS.csv',
    subcategories: ['HDR', 'JST', 'USB', 'RJ45']
  },
  'CRYSTALS_OSCILLATORS': {
    code: 'CRY',
    file: 'CRYSTALS_OSCILLATORS.csv',
    subcategories: ['XTL', 'OSC', 'RES']
  },
  'FUSES': {
    code: 'FUS',
    file: 'FUSES.csv',
    subcategories: ['STD', 'RST', 'PTC']
  },
  'SWITCHES': {
    code: 'SWI',
    file: 'SWITCHES.csv',
    subcategories: ['TAC', 'DIP', 'ROT', 'SLI']
  },
  'RELAYS': {
    code: 'REL',
    file: 'RELAYS.csv',
    subcategories: ['EMR', 'SSR']
  },
  'OPTOCOUPLERS': {
    code: 'OPT',
    file: 'OPTOCOUPLERS.csv',
    subcategories: ['STD', 'HIS', 'DAR']
  },
  'SENSORS': {
    code: 'SEN',
    file: 'SENSORS.csv',
    subcategories: ['TMP', 'PRE', 'ACC', 'GYR']
  },
  'MECHANICAL': {
    code: 'MEC',
    file: 'MECHANICAL.csv',
    subcategories: ['ENC', 'FAN', 'HEA', 'SPK']
  },
  'HARDWARE': {
    code: 'HWR',
    file: 'HARDWARE.csv',
    subcategories: ['SCR', 'NUT', 'WSH', 'SPC']
  },
  'LEDS': {
    code: 'LED',
    file: 'LEDS.csv',
    subcategories: ['STD', 'RGB', 'HPW', 'SPE']
  }
};

// Utility Functions
const ensureCSVFileExists = async (filePath) => {
  if (!(await fs.pathExists(filePath))) {
    // Create file with headers if it doesn't exist
    const headers = [
      'Kinben_PN', 'Value', 'Voltage_Rating', 'Current_Rating', 'Power_Rating', 'Tolerance',
      'Package', 'Mounting', 'Temperature_Range', 'Manufacturer', 'Manufacturer_PN',
      'Description', 'Preferred_Supplier', 'Mouser_PN', 'DigiKey_PN', 'Unit_Cost', 'MOQ',
      'Lead_Time', 'Stock_Level', 'Reorder_Point', 'Symbol_File', 'Footprint_File',
      '3D_Model_File', 'Datasheet_URL', 'Status', 'Created_Date', 'Created_By',
      'Last_Modified', 'Modified_By', 'Approval_Status', 'Approved_By', 'Approval_Date', 'Notes'
    ];
    
    const csvWriter = createCsvWriter({
      path: filePath,
      header: headers.map(h => ({ id: h, title: h }))
    });
    
    await csvWriter.writeRecords([]);
  }
};

const readCSVFile = async (filePath) => {
  await ensureCSVFileExists(filePath);
  
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

const writeCSVFile = async (filePath, data) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.log('No data to write');
    return;
  }

  // Get headers from the first record
  const headers = Object.keys(data[0]).map(key => ({ id: key, title: key }));
  
  const csvWriter = createCsvWriter({
    path: filePath,
    header: headers
  });
  
  await csvWriter.writeRecords(data);
};

const generateKPN = async (category, subcategory) => {
  const categoryInfo = CATEGORIES[category];
  if (!categoryInfo) {
    throw new Error(`Unknown category: ${category}`);
  }
  
  const filePath = path.join(CSV_DIR, categoryInfo.file);
  const existingData = await readCSVFile(filePath);
  
  // Find the highest sequence number for this subcategory
  const prefix = `KPN-${categoryInfo.code}-${subcategory}-`;
  const existingKPNs = existingData
    .filter(item => item.Kinben_PN && item.Kinben_PN.startsWith(prefix))
    .map(item => {
      const match = item.Kinben_PN.match(new RegExp(`${prefix}(\\d+)`));
      return match ? parseInt(match[1], 10) : 0;
    });
  
  const nextSequence = Math.max(0, ...existingKPNs) + 1;
  return `${prefix}${nextSequence.toString().padStart(4, '0')}`;
};

// API Routes

// Get all categories configuration
app.get('/api/categories', (req, res) => {
  res.json(CATEGORIES);
});

// Get components for a specific category
app.get('/api/components/:category', async (req, res) => {
  try {
    const category = req.params.category.toUpperCase();
    const categoryInfo = CATEGORIES[category];
    
    if (!categoryInfo) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const filePath = path.join(CSV_DIR, categoryInfo.file);
    const components = await readCSVFile(filePath);
    
    res.json({
      category,
      components,
      count: components.length
    });
  } catch (error) {
    console.error('Error reading components:', error);
    res.status(500).json({ error: 'Failed to read components' });
  }
});

// Add a new component
app.post('/api/components/:category', async (req, res) => {
  try {
    const category = req.params.category.toUpperCase();
    const categoryInfo = CATEGORIES[category];
    
    if (!categoryInfo) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const filePath = path.join(CSV_DIR, categoryInfo.file);
    const existingComponents = await readCSVFile(filePath);
    
    // Generate KPN if not provided
    let kpn = req.body.Kinben_PN;
    if (!kpn && req.body.subcategory) {
      kpn = await generateKPN(category, req.body.subcategory);
    }
    
    // Prepare component data
    const newComponent = {
      Kinben_PN: kpn,
      Value: req.body.Value || '',
      Voltage_Rating: req.body.Voltage_Rating || '',
      Current_Rating: req.body.Current_Rating || '',
      Power_Rating: req.body.Power_Rating || '',
      Tolerance: req.body.Tolerance || '',
      Package: req.body.Package || '',
      Mounting: req.body.Mounting || '',
      Temperature_Range: req.body.Temperature_Range || '',
      Manufacturer: req.body.Manufacturer || '',
      Manufacturer_PN: req.body.Manufacturer_PN || '',
      Description: req.body.Description || '',
      Preferred_Supplier: req.body.Preferred_Supplier || '',
      Mouser_PN: req.body.Mouser_PN || '',
      DigiKey_PN: req.body.DigiKey_PN || '',
      Unit_Cost: req.body.Unit_Cost || '',
      MOQ: req.body.MOQ || '',
      Lead_Time: req.body.Lead_Time || '',
      Stock_Level: req.body.Stock_Level || '',
      Reorder_Point: req.body.Reorder_Point || '',
      Symbol_File: req.body.Symbol_File || '',
      Footprint_File: req.body.Footprint_File || '',
      '3D_Model_File': req.body['3D_Model_File'] || '',
      Datasheet_URL: req.body.Datasheet_URL || '',
      Status: req.body.Status || 'Active',
      Created_Date: new Date().toISOString().split('T')[0],
      Created_By: req.body.Created_By || 'System',
      Last_Modified: new Date().toISOString().split('T')[0],
      Modified_By: req.body.Modified_By || 'System',
      Approval_Status: req.body.Approval_Status || 'Pending',
      Approved_By: req.body.Approved_By || '',
      Approval_Date: req.body.Approval_Date || '',
      Notes: req.body.Notes || ''
    };
    
    // Add to existing components
    const updatedComponents = [...existingComponents, newComponent];
    
    // Write back to CSV
    await writeCSVFile(filePath, updatedComponents);
    
    res.status(201).json({
      success: true,
      component: newComponent,
      message: 'Component added successfully'
    });
    
  } catch (error) {
    console.error('Error adding component:', error);
    res.status(500).json({ error: 'Failed to add component' });
  }
});

// Generate next KPN for category/subcategory
app.get('/api/kpn/:category/:subcategory', async (req, res) => {
  try {
    const category = req.params.category.toUpperCase();
    const subcategory = req.params.subcategory.toUpperCase();
    
    const kpn = await generateKPN(category, subcategory);
    res.json({ kpn });
  } catch (error) {
    console.error('Error generating KPN:', error);
    res.status(500).json({ error: 'Failed to generate KPN' });
  }
});

// Get all components across all categories
app.get('/api/components', async (req, res) => {
  try {
    const allComponents = [];
    
    for (const [categoryName, categoryInfo] of Object.entries(CATEGORIES)) {
      const filePath = path.join(CSV_DIR, categoryInfo.file);
      const components = await readCSVFile(filePath);
      
      allComponents.push({
        category: categoryName,
        code: categoryInfo.code,
        components: components,
        count: components.length
      });
    }
    
    res.json({
      categories: allComponents,
      totalComponents: allComponents.reduce((sum, cat) => sum + cat.count, 0)
    });
  } catch (error) {
    console.error('Error reading all components:', error);
    res.status(500).json({ error: 'Failed to read components' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    csv_directory: CSV_DIR,
    categories_count: Object.keys(CATEGORIES).length
  });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'KPN_System_Workbook.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 KPN System Server running on http://localhost:${PORT}`);
  console.log(`📁 CSV Directory: ${CSV_DIR}`);
  console.log(`📋 Categories: ${Object.keys(CATEGORIES).length}`);
  
  // Ensure CSV directory exists
  fs.ensureDirSync(CSV_DIR);
  console.log(`✅ CSV directory confirmed: ${CSV_DIR}`);
});

module.exports = app;