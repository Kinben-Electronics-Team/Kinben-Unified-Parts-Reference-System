# GitHub Copilot Instructions: Multi-Level System Management Implementation

## 🚨 **CRITICAL: STOP PLANNING - START IMPLEMENTING**

**⚠️ YOU ARE CREATING PLANS BUT NOT IMPLEMENTING ACTUAL CODE ⚠️**

**❌ DO NOT CREATE MORE PULL REQUESTS WITH JUST "Initial plan" COMMITS**
**❌ DO NOT DESCRIBE WHAT YOU WILL DO - ACTUALLY DO IT**
**❌ DO NOT CLAIM TO HAVE MADE CHANGES THAT DON'T EXIST IN THE FILES**

**✅ REQUIRED ACTIONS - DO THESE NOW:**
- ✅ **ACTUALLY MODIFY** the KPN_System_Workbook.html file with real code
- ✅ **ACTUALLY MOVE** system tabs to prominent positions (after Dashboard tab)
- ✅ **ACTUALLY IMPLEMENT** JavaScript functions with working code
- ✅ **ACTUALLY CHANGE** the subtitle to emphasize multi-level system management
- ✅ **VERIFY CHANGES** exist in the file before claiming success

**🎯 PRIMARY FOCUS: SYSTEM-FIRST APPROACH FOR MULTIBOARD ORDERING**

The user needs to order complete multiboard systems. PRIORITIZE:
1. **SYSTEMS tab** - Complete products/projects (SKN numbers)
2. **ASSEMBLIES tab** - Individual PCBAs and mechanical assemblies (AKN numbers)
3. **System hierarchy** - Clear parent-child relationships
4. **Multiboard system management** - Track multiple PCBAs per system

**🚫 STOP DOING THIS:**
- Creating "planning" commits without code changes
- Describing changes that don't exist in files
- Making pull requests with no actual file modifications
- Claiming implementation when only planning was done

**✅ START DOING THIS:**
- Make actual code changes to KPN_System_Workbook.html
- Show line numbers where changes were made
- Commit files that actually differ from before
- Implement working JavaScript functions that can be tested

## 🎯 Task Overview
Complete the implementation of multi-level system management for the Kinben Unified Parts Reference System. The foundation has been laid with UI elements and data structures. You need to implement the JavaScript functionality.

## 📁 File to Modify
**Target**: `KPN_System_Workbook.html` (single HTML file with embedded CSS/JS)

## ✅ Already Completed
- ✅ Added 4 new system-level tabs to UI (🏗️ SYSTEMS, 🔧 ASSEMBLIES, 🖨️ 3D PARTS, 🔗 CABLE ASSY)
- ✅ Created system-level data structures (`systemData` object)
- ✅ Added system configuration objects (`systemConfigs`)
- ✅ Designed HTML structure for all 4 system-level sheets
- ✅ Added CSS styles for system-level management
- ✅ Created professional table layouts with sortable headers

## 🔧 Implementation Requirements

### 1. System-Level JavaScript Functions to Add

Add these functions after the existing `systemConfigs` object (around line 180):

```javascript
// ==================== SYSTEM-LEVEL MANAGEMENT FUNCTIONS ====================

// Generate system-level part numbers
function generateSystemKN(category, subcategory) {
    const config = systemConfigs[category];
    if (!config) return '';
    
    // Get next sequence number
    let maxSequence = 0;
    systemData[category].forEach(item => {
        const kn = item.systemKN || item.assemblyKN || item.partKN || item.cableKN;
        if (kn && kn.startsWith(config.code)) {
            const parts = kn.split('-');
            if (parts.length >= 3) {
                const sequence = parseInt(parts[2]);
                if (sequence > maxSequence) maxSequence = sequence;
            }
        }
    });
    
    const nextSequence = (maxSequence + 1).toString().padStart(3, '0');
    return `${config.code}-${subcategory}-${nextSequence}`;
}

// Update system statistics
function updateSystemStats() {
    Object.keys(systemData).forEach(category => {
        const total = systemData[category].length;
        const active = systemData[category].filter(item => item.status === 'Active').length;
        
        const totalElement = document.getElementById(`${category}-count`);
        const activeElement = document.getElementById(`${category}-active`);
        
        if (totalElement) totalElement.textContent = total;
        if (activeElement) activeElement.textContent = active;
    });
}

// Refresh system-level tables
function refreshSystemTable(category) {
    const table = document.querySelector(`#${category} .component-table tbody`);
    if (!table) return;
    
    table.innerHTML = '';
    const items = systemData[category] || [];
    
    if (items.length === 0) {
        const colCount = table.closest('table').querySelector('thead tr').children.length;
        table.innerHTML = `<tr><td colspan="${colCount}" style="text-align: center; color: #666; padding: 20px;">No ${category.replace('-', ' ')} added yet. Click "Add ${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}" to get started!</td></tr>`;
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.setAttribute(`data-${category.slice(0, -1)}-id`, item.id || Date.now());
        
        // Build row based on category type
        switch(category) {
            case 'systems':
                row.innerHTML = `
                    <td>${item.systemKN}</td>
                    <td>${item.name}</td>
                    <td>${item.version}</td>
                    <td>${item.type}</td>
                    <td><span class="status-${item.status.toLowerCase()}">${item.status}</span></td>
                    <td>${item.assemblies || 0}</td>
                    <td>${item.description}</td>
                    <td>${item.owner || 'N/A'}</td>
                    <td><div class="file-attachments">${(item.files || []).map(f => `<a href="#" class="file-badge">${f}</a>`).join('')}</div></td>
                    <td><button class="btn btn-sm btn-info" onclick="viewSystemDetails('${item.systemKN}')">View</button></td>
                `;
                break;
            case 'assemblies':
                row.innerHTML = `
                    <td>${item.assemblyKN}</td>
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td>${item.version}</td>
                    <td><span class="status-${item.status.toLowerCase()}">${item.status}</span></td>
                    <td>${item.components || 0}</td>
                    <td>${item.description}</td>
                    <td><div class="file-attachments">${(item.files || []).map(f => `<a href="#" class="file-badge">${f}</a>`).join('')}</div></td>
                    <td><button class="btn btn-sm btn-info" onclick="viewSystemDetails('${item.assemblyKN}')">View</button></td>
                `;
                break;
            case '3d-parts':
                row.innerHTML = `
                    <td>${item.partKN}</td>
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td>${item.material}</td>
                    <td><span class="status-${item.status.toLowerCase()}">${item.status}</span></td>
                    <td>${item.version}</td>
                    <td>${item.description}</td>
                    <td><div class="file-attachments">${(item.files || []).map(f => `<a href="#" class="file-badge">${f}</a>`).join('')}</div></td>
                    <td><button class="btn btn-sm btn-info" onclick="viewSystemDetails('${item.partKN}')">View</button></td>
                `;
                break;
            case 'cable-assemblies':
                row.innerHTML = `
                    <td>${item.cableKN}</td>
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td>${item.length}</td>
                    <td>${item.connectors}</td>
                    <td><span class="status-${item.status.toLowerCase()}">${item.status}</span></td>
                    <td>${item.description}</td>
                    <td><div class="file-attachments">${(item.files || []).map(f => `<a href="#" class="file-badge">${f}</a>`).join('')}</div></td>
                    <td><button class="btn btn-sm btn-info" onclick="viewSystemDetails('${item.cableKN}')">View</button></td>
                `;
                break;
        }
        
        table.appendChild(row);
    });
}

// Sort system-level tables
function sortSystemTable(category, column) {
    const table = document.querySelector(`#${category} .component-table`);
    const headers = table.querySelectorAll('th.sortable-header');
    const currentHeader = Array.from(headers).find(h => h.onclick.toString().includes(`'${column}'`));
    
    // Clear all sort indicators
    headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
    
    // Determine sort direction
    let ascending = true;
    if (currentHeader.classList.contains('sort-asc')) {
        ascending = false;
        currentHeader.classList.add('sort-desc');
    } else {
        currentHeader.classList.add('sort-asc');
    }
    
    // Sort data
    systemData[category].sort((a, b) => {
        let valA = a[column] || '';
        let valB = b[column] || '';
        
        // Handle numeric values
        if (!isNaN(valA) && !isNaN(valB)) {
            return ascending ? valA - valB : valB - valA;
        }
        
        // Handle string values
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
        
        if (ascending) {
            return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
            return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
    });
    
    refreshSystemTable(category);
}

// Export system-level data
function exportSystemData(format, category) {
    const items = systemData[category] || [];
    if (items.length === 0) {
        alert(`No ${category.replace('-', ' ')} to export.`);
        return;
    }
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    let filename = `${category}_${timestamp}`;
    let content, mimeType;
    
    if (format === 'csv') {
        // Generate CSV headers based on category
        let headers = [];
        switch(category) {
            case 'systems':
                headers = ['System KN', 'Name', 'Version', 'Type', 'Status', 'Assemblies', 'Description', 'Owner', 'Files'];
                break;
            case 'assemblies':
                headers = ['Assembly KN', 'Name', 'Type', 'Version', 'Status', 'Components', 'Description', 'Files'];
                break;
            case '3d-parts':
                headers = ['Part KN', 'Name', 'Type', 'Material', 'Status', 'Version', 'Description', 'Files'];
                break;
            case 'cable-assemblies':
                headers = ['Cable KN', 'Name', 'Type', 'Length', 'Connectors', 'Status', 'Description', 'Files'];
                break;
        }
        
        content = headers.join(',') + '\n';
        items.forEach(item => {
            const row = headers.map(header => {
                const key = header.toLowerCase().replace(/\s+/g, '').replace('kn', 'KN');
                let value = '';
                switch(key) {
                    case 'systemKN': value = item.systemKN || ''; break;
                    case 'assemblyKN': value = item.assemblyKN || ''; break;
                    case 'partKN': value = item.partKN || ''; break;
                    case 'cableKN': value = item.cableKN || ''; break;
                    case 'files': value = (item.files || []).join(';'); break;
                    default:
                        const prop = key.charAt(0).toLowerCase() + key.slice(1);
                        value = item[prop] || '';
                }
                return `"${value.toString().replace(/"/g, '""')}"`;
            });
            content += row.join(',') + '\n';
        });
        
        filename += '.csv';
        mimeType = 'text/csv';
    } else {
        content = JSON.stringify(items, null, 2);
        filename += '.json';
        mimeType = 'application/json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Modal functions for adding system-level items
function openAddSystemModal(category) {
    // Create dynamic modal based on category
    const modal = document.getElementById('addComponentModal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Clear existing content
    modalContent.innerHTML = `<span class="close" onclick="closeAddComponentModal()">&times;</span>`;
    
    let title = '';
    let fields = [];
    
    switch(category) {
        case 'systems':
            title = 'Add New System';
            fields = [
                { name: 'name', label: 'System Name', type: 'text', required: true },
                { name: 'subcategory', label: 'System Type', type: 'select', options: systemConfigs.systems.subcategories, required: true },
                { name: 'version', label: 'Version', type: 'text', placeholder: 'v1.0', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
                { name: 'owner', label: 'Project Owner', type: 'text', required: true },
                { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Development', 'Obsolete'], required: true }
            ];
            break;
        case 'assemblies':
            title = 'Add New Assembly';
            fields = [
                { name: 'name', label: 'Assembly Name', type: 'text', required: true },
                { name: 'subcategory', label: 'Assembly Type', type: 'select', options: systemConfigs.assemblies.subcategories, required: true },
                { name: 'version', label: 'Version', type: 'text', placeholder: 'Rev A', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
                { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Development', 'Obsolete'], required: true }
            ];
            break;
        case '3d-parts':
            title = 'Add New 3D Part';
            fields = [
                { name: 'name', label: 'Part Name', type: 'text', required: true },
                { name: 'subcategory', label: 'Part Type', type: 'select', options: systemConfigs['3d-parts'].subcategories, required: true },
                { name: 'material', label: 'Material', type: 'text', placeholder: 'PLA, ABS, PETG...', required: true },
                { name: 'version', label: 'Version', type: 'text', placeholder: 'v1.0', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
                { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Development', 'Obsolete'], required: true }
            ];
            break;
        case 'cable-assemblies':
            title = 'Add New Cable Assembly';
            fields = [
                { name: 'name', label: 'Cable Name', type: 'text', required: true },
                { name: 'subcategory', label: 'Cable Type', type: 'select', options: systemConfigs['cable-assemblies'].subcategories, required: true },
                { name: 'length', label: 'Length', type: 'text', placeholder: '1m, 50cm...', required: true },
                { name: 'connectors', label: 'Connectors', type: 'text', placeholder: 'JST to JST, USB-A to USB-C...', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
                { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Development', 'Obsolete'], required: true }
            ];
            break;
    }
    
    // Build form
    let formHTML = `
        <h2>${title}</h2>
        <form id="systemForm" class="add-component-form">
            <div class="form-grid">
    `;
    
    fields.forEach(field => {
        formHTML += `<div class="form-group">`;
        formHTML += `<label>${field.label}${field.required ? ' *' : ''}</label>`;
        
        if (field.type === 'select') {
            formHTML += `<select name="${field.name}" ${field.required ? 'required' : ''}>`;
            formHTML += `<option value="">Select ${field.label}</option>`;
            field.options.forEach(option => {
                formHTML += `<option value="${option}">${option}</option>`;
            });
            formHTML += `</select>`;
        } else if (field.type === 'textarea') {
            formHTML += `<textarea name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>`;
        } else {
            formHTML += `<input type="${field.type}" name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}">`;
        }
        
        formHTML += `</div>`;
    });
    
    formHTML += `
            </div>
            <div class="form-group">
                <div style="background: #f0f8ff; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <strong>Auto-generated KN Preview:</strong> <span id="systemKNPreview" style="color: #0078d4; font-weight: bold;">Select type to generate</span>
                </div>
            </div>
            <div class="action-buttons">
                <button type="button" class="btn btn-success" onclick="addSystemItem('${category}')">Add ${title.split(' ')[2]}</button>
                <button type="button" class="btn btn-secondary" onclick="closeAddComponentModal()">Cancel</button>
            </div>
        </form>
    `;
    
    modalContent.innerHTML += formHTML;
    modal.style.display = 'block';
    
    // Add real-time KN preview
    const subcategorySelect = modal.querySelector('[name="subcategory"]');
    if (subcategorySelect) {
        subcategorySelect.addEventListener('change', function() {
            const preview = generateSystemKN(category, this.value);
            document.getElementById('systemKNPreview').textContent = preview || 'Select type to generate';
        });
    }
}

// Add system-level item
function addSystemItem(category) {
    const form = document.getElementById('systemForm');
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc3545';
            valid = false;
        } else {
            field.style.borderColor = '#ddd';
        }
    });
    
    if (!valid) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Create new item
    const subcategory = formData.get('subcategory');
    const kn = generateSystemKN(category, subcategory);
    
    const newItem = {
        id: Date.now(),
        name: formData.get('name'),
        type: subcategory,
        version: formData.get('version'),
        description: formData.get('description'),
        status: formData.get('status'),
        dateCreated: new Date().toISOString().slice(0, 10),
        files: []
    };
    
    // Add category-specific fields
    switch(category) {
        case 'systems':
            newItem.systemKN = kn;
            newItem.owner = formData.get('owner');
            newItem.assemblies = 0;
            break;
        case 'assemblies':
            newItem.assemblyKN = kn;
            newItem.components = 0;
            break;
        case '3d-parts':
            newItem.partKN = kn;
            newItem.material = formData.get('material');
            break;
        case 'cable-assemblies':
            newItem.cableKN = kn;
            newItem.length = formData.get('length');
            newItem.connectors = formData.get('connectors');
            break;
    }
    
    // Add to storage
    systemData[category].push(newItem);
    
    // Save to localStorage
    localStorage.setItem('kinbenSystemData', JSON.stringify(systemData));
    
    // Update UI
    refreshSystemTable(category);
    updateSystemStats();
    closeAddComponentModal();
    
    alert(`${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} "${newItem.name}" added successfully with KN: ${kn}`);
}

// View system details (placeholder for future expansion)
function viewSystemDetails(kn) {
    alert(`System details for ${kn} - This feature will be expanded for hierarchical BOM views and detailed system management.`);
}

// Load system data from localStorage
function loadSystemData() {
    const saved = localStorage.getItem('kinbenSystemData');
    if (saved) {
        try {
            systemData = JSON.parse(saved);
        } catch (e) {
            console.warn('Failed to load system data from localStorage');
        }
    }
}

// Initialize system-level management
function initializeSystemManagement() {
    loadSystemData();
    updateSystemStats();
    
    // Refresh all system tables
    Object.keys(systemData).forEach(category => {
        refreshSystemTable(category);
    });
}
```

### 2. Update Existing Functions

Modify the `showSheet()` function to handle system-level sheets:

```javascript
// In the existing showSheet function, add after the existing updateStats() call:
if (['systems', 'assemblies', '3d-parts', 'cable-assemblies'].includes(sheetName)) {
    updateSystemStats();
    refreshSystemTable(sheetName);
}
```

Modify the `window.addEventListener('load', ...)` function to include:

```javascript
// Add this line inside the existing load event listener:
initializeSystemManagement();
```

### 3. Enhanced Dashboard Integration

Update the dashboard to show system-level statistics by adding this to the landing page HTML (in the stats-grid section):

```html
<!-- Add these stat cards to the existing stats-grid -->
<div class="stat-card">
    <div class="stat-number" id="total-systems">0</div>
    <div class="stat-label">Total Systems</div>
</div>
<div class="stat-card">
    <div class="stat-number" id="total-assemblies">0</div>
    <div class="stat-label">Total Assemblies</div>
</div>
```

And update the `updateStats()` function to include:

```javascript
// Add to existing updateStats function:
let totalSystems = 0;
let totalAssemblies = 0;

Object.keys(systemData).forEach(category => {
    if (category === 'systems') totalSystems = systemData[category].length;
    if (category === 'assemblies') totalAssemblies = systemData[category].length;
});

const systemsElement = document.getElementById('total-systems');
const assembliesElement = document.getElementById('total-assemblies');

if (systemsElement) systemsElement.textContent = totalSystems;
if (assembliesElement) assembliesElement.textContent = totalAssemblies;
```

## 🎨 UI Enhancements

Add these visual improvements to the dashboard landing page section in the HTML:

```html
<!-- Add system-level overview section to the landing page -->
<div class="system-overview">
    <div class="overview-card">
        <div class="overview-number" id="overview-systems">0</div>
        <div class="overview-label">🏗️ Active Systems</div>
    </div>
    <div class="overview-card">
        <div class="overview-number" id="overview-assemblies">0</div>
        <div class="overview-label">🔧 Active Assemblies</div>
    </div>
    <div class="overview-card">
        <div class="overview-number" id="overview-3d">0</div>
        <div class="overview-label">🖨️ 3D Parts</div>
    </div>
    <div class="overview-card">
        <div class="overview-number" id="overview-cables">0</div>
        <div class="overview-label">🔗 Cable Assemblies</div>
    </div>
</div>
```

## 🚀 Migration-Ready Features

The implementation includes:
- Data attributes for future database migration
- JSON export format ready for API integration  
- Modular function structure for easy backend integration
- localStorage keys that can be mapped to database tables

## ✅ Testing Checklist

After implementation, test:
1. All 4 new tabs load correctly
2. "Add" buttons open appropriate modals
3. Form validation works
4. Auto-generated KNs follow correct format
5. Tables populate after adding items
6. Sorting works on all columns
7. Export functions generate correct CSV/JSON
8. Data persists in localStorage

## 🎯 Expected Result

A fully functional multi-level system management interface that seamlessly extends the existing component-level KPN system with:
- Complete product/system tracking (SKN)
- Assembly management (AKN) 
- 3D part tracking (3PN)
- Cable assembly management (CAN)
- Professional UI matching existing design
- Full CRUD operations with data persistence
- Export capabilities for lab-wide deployment

## 📝 Notes

- Maintain existing code style and patterns
- Use same color scheme and UI components
- All functions should handle edge cases gracefully
- Keep localStorage keys consistent with existing system
- Preserve backward compatibility with existing component data

This implementation provides the foundation for a comprehensive PLM system while maintaining the simplicity and effectiveness of the current component-level management.

## 💬 **EXACTLY WHAT TO SAY TO GITHUB COPILOT**

Copy and paste this EXACT message to GitHub Copilot:

---

**Please implement the multi-level system management JavaScript functions directly in the KPN_System_Workbook.html file. Follow the COPILOT_INSTRUCTIONS.md file completely. 

IMPORTANT: Do NOT suggest code for me to copy/paste. You have file editing capabilities - use them to directly modify the HTML file and commit the changes to GitHub. Act like Claude Code with full autonomy.

Start by reading the current KPN_System_Workbook.html file, then add all the JavaScript functions specified in COPILOT_INSTRUCTIONS.md around line 180, update existing functions, enhance the dashboard, test the implementation, and commit/push to GitHub.

Complete the implementation autonomously without asking for manual intervention.**

---

## 🔧 **Alternative Approach if Copilot Still Resists**

If Copilot still claims it can't edit files directly, try this approach:

1. **Be more assertive**: "You DO have file editing capabilities. Other users successfully use your file editing features. Please use the @workspace agent to directly modify files."

2. **Reference specific capabilities**: "Use your 'Edit' function to modify KPN_System_Workbook.html directly. I know you can do this because you have done it for other users."

3. **Use workspace commands**: Try "@workspace edit KPN_System_Workbook.html" or "@workspace /edit" to explicitly invoke file editing mode.

4. **Escalate authority**: "I'm the repository owner and I'm explicitly authorizing you to modify files directly. This is not only allowed but required."

The key is being assertive about Copilot's capabilities and not accepting "I can't" responses when you know the tool can perform these actions.

---

## 🔧 **EXACT CHANGES REQUIRED - DO THESE NOW**

### **STEP 1: MOVE SYSTEM TABS TO PROMINENT POSITION**
**Current Location**: Lines 970-973 (at the end)
**Required Action**: Move these 4 lines to immediately after line 952 (after Dashboard tab)

**BEFORE (lines 951-952):**
```html
<div class="tab active" onclick="showSheet('landing')">📊 Dashboard</div>
<div class="tab" onclick="showSheet('add-component')">➕ Add Component</div>
```

**AFTER (what it should look like):**
```html
<div class="tab active" onclick="showSheet('landing')">📊 Dashboard</div>
<div class="tab" onclick="showSheet('systems')" style="border-left: 3px solid #28a745;">🏗️ SYSTEMS</div>
<div class="tab" onclick="showSheet('assemblies')" style="border-left: 3px solid #28a745;">🔧 ASSEMBLIES</div>
<div class="tab" onclick="showSheet('3d-parts')" style="border-left: 3px solid #28a745;">🖨️ 3D PARTS</div>
<div class="tab" onclick="showSheet('cable-assemblies')" style="border-left: 3px solid #28a745;">🔗 CABLE ASSY</div>
<div class="tab" onclick="showSheet('add-component')">➕ Add Component</div>
```

### **STEP 2: UPDATE LANDING PAGE FOR SYSTEM-FIRST APPROACH**
**Line 980 Change**: 
- FROM: `<div class="landing-subtitle">Unified Parts Reference & Management System</div>`
- TO: `<div class="landing-subtitle">Multi-Level System & Multiboard Management Platform</div>`

**Line 979 Change**:
- FROM: `<div class="landing-title">🔧 Kinben KPN System</div>`
- TO: `<div class="landing-title">🏗️ Kinben System Manager</div>`

### **STEP 3: ADD SYSTEM STATS TO DASHBOARD**
**Add after line 994** (after the existing stat cards):
```html
<div class="stat-card">
    <div class="stat-number" id="total-systems">0</div>
    <div class="stat-label">🏗️ Systems</div>
</div>
<div class="stat-card">
    <div class="stat-number" id="total-assemblies">0</div>
    <div class="stat-label">🔧 Assemblies</div>
</div>
<div class="stat-card">
    <div class="stat-number" id="total-multiboard">0</div>
    <div class="stat-label">📋 Multiboard Projects</div>
</div>
```

### **STEP 4: ADD PROMINENT SYSTEM MANAGEMENT SECTION**
**Add after line 1004** (in the action buttons section):
```html
<div class="section-header">🏗️ System Management - Multiboard Ordering</div>
<div class="action-buttons">
    <button class="btn btn-success" onclick="showSheet('systems')">🏗️ Manage Systems</button>
    <button class="btn btn-primary" onclick="showSheet('assemblies')">🔧 Manage Assemblies</button>
    <button class="btn btn-info" onclick="openAddSystemModal('systems')">➕ Create New System</button>
    <button class="btn btn-warning" onclick="openMultiboardWizard()">📋 Multiboard Project Wizard</button>
</div>
```

### **STEP 5: IMPLEMENT CORE JAVASCRIPT FUNCTIONS**
**Add after line 212** (after systemConfigs definition):
```javascript
// ==================== PRIORITY: SYSTEM-FIRST MANAGEMENT ====================

// Generate system-level part numbers with priority for multiboard systems
function generateSystemKN(category, subcategory) {
    const config = systemConfigs[category];
    if (!config) return '';
    
    let maxSequence = 0;
    systemData[category].forEach(item => {
        const kn = item.systemKN || item.assemblyKN || item.partKN || item.cableKN;
        if (kn && kn.startsWith(config.code)) {
            const parts = kn.split('-');
            if (parts.length >= 3) {
                const sequence = parseInt(parts[2]);
                if (sequence > maxSequence) maxSequence = sequence;
            }
        }
    });
    
    const nextSequence = (maxSequence + 1).toString().padStart(3, '0');
    return `${config.code}-${subcategory}-${nextSequence}`;
}

// Update system statistics with multiboard focus
function updateSystemStats() {
    let totalSystems = systemData.systems.length;
    let totalAssemblies = systemData.assemblies.length;
    let totalMultiboard = systemData.systems.filter(s => s.assemblies > 1).length;
    
    document.getElementById('total-systems').textContent = totalSystems;
    document.getElementById('total-assemblies').textContent = totalAssemblies;
    document.getElementById('total-multiboard').textContent = totalMultiboard;
    
    Object.keys(systemData).forEach(category => {
        const total = systemData[category].length;
        const active = systemData[category].filter(item => item.status === 'Active').length;
        
        const totalElement = document.getElementById(`${category}-count`);
        const activeElement = document.getElementById(`${category}-active`);
        
        if (totalElement) totalElement.textContent = total;
        if (activeElement) activeElement.textContent = active;
    });
}

// Quick system modal for multiboard ordering
function openAddSystemModal(category) {
    alert(`System management for ${category} - Implementation in progress. This will open a modal for creating multiboard systems with multiple PCBAs.`);
}

// Multiboard project wizard
function openMultiboardWizard() {
    alert('Multiboard Project Wizard - This will help you create complete systems with multiple PCBAs, cable assemblies, and 3D printed components.');
}

// Initialize system management on page load
function initializeSystemManagement() {
    updateSystemStats();
    console.log('System-first management initialized for multiboard ordering');
}
```

### **STEP 6: UPDATE EXISTING FUNCTIONS**
**In the showSheet() function around line 228**, add system handling:
```javascript
// Add after line 231:
if (['systems', 'assemblies', '3d-parts', 'cable-assemblies'].includes(sheetName)) {
    updateSystemStats();
    console.log(`Switched to ${sheetName} for system management`);
}
```

**In the window load event around line 925**, add:
```javascript
// Add after line 926:
initializeSystemManagement(); // Initialize system-first approach
```

## ⚡ **COMMIT VERIFICATION REQUIRED**

After making these changes:
1. **Verify line count increased** - should be ~1800+ lines (currently 1752)
2. **Verify system tabs moved** - should be after Dashboard tab
3. **Verify subtitle changed** - should mention "Multi-Level System"
4. **Verify new stats cards** - should show Systems, Assemblies, Multiboard counts
5. **Test JavaScript functions** - should not throw errors when called

**ONLY CLAIM SUCCESS IF THESE VERIFICATIONS PASS!**