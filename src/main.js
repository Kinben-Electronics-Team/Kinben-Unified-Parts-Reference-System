// Main Application Logic - Firebase Integration (CDN Version)

// Application state
let currentUser = null;
let data = {
    components: [],
    assemblies: [],
    systems: [],
    vendors: ['Mouser', 'Digi-Key', 'Arrow', 'Newark', 'Farnell', 'RS Components', 'Avnet', 'Future Electronics']
};

// UI state management
let editingComponent = null;
let editingAssembly = null;
let editingSystem = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for Firebase to load
    await waitForFirebase();
    setupAuthListener();
    setupEventListeners();
});

// Utility function to wait for Firebase to load
function waitForFirebase() {
    return new Promise((resolve) => {
        if (window.firebaseAuth) {
            resolve();
        } else {
            const interval = setInterval(() => {
                if (window.firebaseAuth) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50); // Check every 50ms
        }
    });
}

// Setup authentication state listener
function setupAuthListener() {
    window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            showAuthenticatedUI();
            loadUserData();
        } else {
            // User is signed out
            currentUser = null;
            showLoginUI();
        }
    });
}

// Show login UI
function showLoginUI() {
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
}

// Show authenticated UI
function showAuthenticatedUI() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    document.getElementById('user-email').textContent = currentUser.email;
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            await window.firebaseSignInWithEmailAndPassword(window.firebaseAuth, email, password);
            document.getElementById('login-error').style.display = 'none';
        } catch (error) {
            document.getElementById('login-error').textContent = error.message;
            document.getElementById('login-error').style.display = 'block';
        }
    });

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', async () => {
        try {
            await window.firebaseSignOut(window.firebaseAuth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetTab = e.target.dataset.tab;
            switchTab(targetTab);
        });
    });

    // Component form
    const componentForm = document.getElementById('component-form');
    if (componentForm) {
        componentForm.addEventListener('submit', handleComponentSubmit);
    }
    
    const cancelComponentEdit = document.getElementById('cancel-component-edit');
    if (cancelComponentEdit) {
        cancelComponentEdit.addEventListener('click', cancelComponentEdit);
    }
    
    // Assembly form
    const assemblyForm = document.getElementById('assembly-form');
    if (assemblyForm) {
        assemblyForm.addEventListener('submit', handleAssemblySubmit);
    }
    
    const cancelAssemblyEdit = document.getElementById('cancel-assembly-edit');
    if (cancelAssemblyEdit) {
        cancelAssemblyEdit.addEventListener('click', cancelAssemblyEdit);
    }
    
    // System form
    const systemForm = document.getElementById('system-form');
    if (systemForm) {
        systemForm.addEventListener('submit', handleSystemSubmit);
    }
    
    const cancelSystemEdit = document.getElementById('cancel-system-edit');
    if (cancelSystemEdit) {
        cancelSystemEdit.addEventListener('click', cancelSystemEdit);
    }

    // Category change
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', handleCategoryChange);
    }
}

// Load user data from Firestore
async function loadUserData() {
    try {
        // Load components
        const componentsQuery = window.firebaseQuery(
            window.firebaseCollection(window.firebaseDb, 'components'),
            window.firebaseWhere('userId', '==', currentUser.uid)
        );
        const componentsSnapshot = await window.firebaseGetDocs(componentsQuery);
        data.components = componentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Load assemblies
        const assembliesQuery = window.firebaseQuery(
            window.firebaseCollection(window.firebaseDb, 'assemblies'),
            window.firebaseWhere('userId', '==', currentUser.uid)
        );
        const assembliesSnapshot = await window.firebaseGetDocs(assembliesQuery);
        data.assemblies = assembliesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Load systems
        const systemsQuery = window.firebaseQuery(
            window.firebaseCollection(window.firebaseDb, 'systems'),
            window.firebaseWhere('userId', '==', currentUser.uid)
        );
        const systemsSnapshot = await window.firebaseGetDocs(systemsQuery);
        data.systems = systemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Load vendors
        const vendorsQuery = window.firebaseQuery(
            window.firebaseCollection(window.firebaseDb, 'vendors'),
            window.firebaseWhere('userId', '==', currentUser.uid)
        );
        const vendorsSnapshot = await window.firebaseGetDocs(vendorsQuery);
        if (!vendorsSnapshot.empty) {
            const vendorDoc = vendorsSnapshot.docs[0];
            data.vendors = vendorDoc.data().vendors || data.vendors;
        }

        // Refresh UI
        renderComponents();
        renderAssemblies();
        renderSystems();
        renderVendorsList();
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Component management functions
async function handleComponentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const componentData = {
        userId: currentUser.uid,
        kpn: formData.get('kpn'),
        category: formData.get('category'),
        subcategory: formData.get('subcategory'),
        value: formData.get('value'),
        package: formData.get('package'),
        tolerance: formData.get('tolerance'),
        tempRating: formData.get('tempRating'),
        preferredVendor: formData.get('preferredVendor'),
        createdAt: new Date()
    };

    try {
        if (editingComponent) {
            // Update existing component
            await window.firebaseUpdateDoc(
                window.firebaseDoc(window.firebaseDb, 'components', editingComponent.id),
                { ...componentData, updatedAt: new Date() }
            );
            
            // Update local data
            const index = data.components.findIndex(c => c.id === editingComponent.id);
            if (index !== -1) {
                data.components[index] = { id: editingComponent.id, ...componentData };
            }
            
            editingComponent = null;
            const cancelBtn = document.getElementById('cancel-component-edit');
            if (cancelBtn) cancelBtn.style.display = 'none';
        } else {
            // Add new component
            const docRef = await window.firebaseAddDoc(
                window.firebaseCollection(window.firebaseDb, 'components'),
                componentData
            );
            
            // Add to local data
            data.components.push({ id: docRef.id, ...componentData });
        }
        
        e.target.reset();
        renderComponents();
        
    } catch (error) {
        console.error('Error saving component:', error);
        alert('Error saving component: ' + error.message);
    }
}

// Tab switching function
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) activeTab.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const activeContent = document.getElementById(`${tabName}-tab`);
    if (activeContent) activeContent.classList.add('active');
}

// Component category handling
function handleCategoryChange() {
    const categorySelect = document.getElementById('category');
    if (!categorySelect) return;
    
    const category = categorySelect.value;
    const dynamicFields = document.getElementById('dynamic-fields');
    if (!dynamicFields) return;
    
    // Clear existing dynamic fields
    dynamicFields.innerHTML = '';
    
    if (category === 'Resistor') {
        dynamicFields.innerHTML = `
            <div class="form-group">
                <label>Value *</label>
                <input type="text" name="value" required>
            </div>
            <div class="form-group">
                <label>Package *</label>
                <input type="text" name="package" required>
            </div>
            <div class="form-group">
                <label>Tolerance</label>
                <input type="text" name="tolerance">
            </div>
            <div class="form-group">
                <label>Temperature Rating</label>
                <input type="text" name="tempRating">
            </div>
        `;
    } else if (category === 'Capacitor') {
        dynamicFields.innerHTML = `
            <div class="form-group">
                <label>Value *</label>
                <input type="text" name="value" required>
            </div>
            <div class="form-group">
                <label>Package *</label>
                <input type="text" name="package" required>
            </div>
            <div class="form-group">
                <label>Tolerance</label>
                <input type="text" name="tolerance">
            </div>
            <div class="form-group">
                <label>Voltage Rating</label>
                <input type="text" name="voltage">
            </div>
            <div class="form-group">
                <label>Dielectric (X7R/X5R)</label>
                <input type="text" name="dielectric">
            </div>
        `;
    }
    // Add more categories as needed
}

// Render components table
function renderComponents() {
    const tbody = document.getElementById('components-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.components.forEach(component => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${component.kpn}</td>
            <td>${component.category}</td>
            <td>${component.subcategory || ''}</td>
            <td>${component.value || ''}</td>
            <td>${component.package || ''}</td>
            <td>${component.preferredVendor || ''}</td>
            <td>
                <button onclick="editComponent('${component.id}')" class="btn btn-warning btn-sm">Edit</button>
                <button onclick="deleteComponent('${component.id}')" class="btn btn-danger btn-sm">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Component editing functions
function editComponent(id) {
    const component = data.components.find(c => c.id === id);
    if (!component) return;
    
    editingComponent = component;
    
    // Fill form with component data
    const kpnField = document.getElementById('kpn');
    const categoryField = document.getElementById('category');
    const subcategoryField = document.getElementById('subcategory');
    
    if (kpnField) kpnField.value = component.kpn || '';
    if (categoryField) categoryField.value = component.category || '';
    if (subcategoryField) subcategoryField.value = component.subcategory || '';
    
    // Trigger category change to show dynamic fields
    handleCategoryChange();
    
    // Fill dynamic fields
    setTimeout(() => {
        const valueField = document.querySelector('input[name="value"]');
        const packageField = document.querySelector('input[name="package"]');
        const toleranceField = document.querySelector('input[name="tolerance"]');
        const tempRatingField = document.querySelector('input[name="tempRating"]');
        const preferredVendorField = document.getElementById('preferredVendor');
        
        if (valueField) valueField.value = component.value || '';
        if (packageField) packageField.value = component.package || '';
        if (toleranceField) toleranceField.value = component.tolerance || '';
        if (tempRatingField) tempRatingField.value = component.tempRating || '';
        if (preferredVendorField) preferredVendorField.value = component.preferredVendor || '';
    }, 100);
    
    const cancelBtn = document.getElementById('cancel-component-edit');
    if (cancelBtn) cancelBtn.style.display = 'inline-block';
    switchTab('components');
}

function cancelComponentEdit() {
    editingComponent = null;
    const form = document.getElementById('component-form');
    if (form) form.reset();
    const cancelBtn = document.getElementById('cancel-component-edit');
    if (cancelBtn) cancelBtn.style.display = 'none';
    const dynamicFields = document.getElementById('dynamic-fields');
    if (dynamicFields) dynamicFields.innerHTML = '';
}

async function deleteComponent(id) {
    if (!confirm('Are you sure you want to delete this component?')) return;
    
    try {
        await window.firebaseDeleteDoc(window.firebaseDoc(window.firebaseDb, 'components', id));
        data.components = data.components.filter(c => c.id !== id);
        renderComponents();
    } catch (error) {
        console.error('Error deleting component:', error);
        alert('Error deleting component: ' + error.message);
    }
}

// Assembly management (placeholder functions)
async function handleAssemblySubmit(e) {
    e.preventDefault();
    // Implementation similar to components
}

function cancelAssemblyEdit() {
    editingAssembly = null;
    const form = document.getElementById('assembly-form');
    if (form) form.reset();
}

function renderAssemblies() {
    const tbody = document.getElementById('assemblies-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    // Implementation similar to components
}

// System management (placeholder functions)
async function handleSystemSubmit(e) {
    e.preventDefault();
    // Implementation similar to components
}

function cancelSystemEdit() {
    editingSystem = null;
    const form = document.getElementById('system-form');
    if (form) form.reset();
}

function renderSystems() {
    const tbody = document.getElementById('systems-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    // Implementation similar to components
}

// Vendor management
function renderVendorsList() {
    const vendorsList = document.getElementById('vendors-list');
    if (!vendorsList) return;
    
    vendorsList.innerHTML = '';
    data.vendors.forEach(vendor => {
        const vendorItem = document.createElement('div');
        vendorItem.className = 'vendor-item';
        vendorItem.innerHTML = `
            <span>${vendor}</span>
            <button onclick="removeVendor('${vendor}')" class="btn btn-danger btn-sm">×</button>
        `;
        vendorsList.appendChild(vendorItem);
    });
    
    // Update vendor dropdowns
    updateVendorDropdowns();
}

function updateVendorDropdowns() {
    const dropdowns = document.querySelectorAll('select[name="preferredVendor"]');
    dropdowns.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Vendor</option>';
        data.vendors.forEach(vendor => {
            const option = document.createElement('option');
            option.value = vendor;
            option.textContent = vendor;
            if (vendor === currentValue) option.selected = true;
            select.appendChild(option);
        });
    });
}

async function addVendor() {
    const vendorField = document.getElementById('new-vendor');
    if (!vendorField) return;
    
    const vendorName = vendorField.value.trim();
    if (!vendorName || data.vendors.includes(vendorName)) return;
    
    data.vendors.push(vendorName);
    data.vendors.sort();
    
    try {
        // Save to Firestore
        const vendorsQuery = window.firebaseQuery(
            window.firebaseCollection(window.firebaseDb, 'vendors'),
            window.firebaseWhere('userId', '==', currentUser.uid)
        );
        const vendorsSnapshot = await window.firebaseGetDocs(vendorsQuery);
        
        if (vendorsSnapshot.empty) {
            await window.firebaseAddDoc(window.firebaseCollection(window.firebaseDb, 'vendors'), {
                userId: currentUser.uid,
                vendors: data.vendors
            });
        } else {
            const vendorDoc = vendorsSnapshot.docs[0];
            await window.firebaseUpdateDoc(vendorDoc.ref, { vendors: data.vendors });
        }
        
        vendorField.value = '';
        renderVendorsList();
        
    } catch (error) {
        console.error('Error saving vendors:', error);
    }
}

async function removeVendor(vendorName) {
    data.vendors = data.vendors.filter(v => v !== vendorName);
    
    try {
        // Save to Firestore
        const vendorsQuery = window.firebaseQuery(
            window.firebaseCollection(window.firebaseDb, 'vendors'),
            window.firebaseWhere('userId', '==', currentUser.uid)
        );
        const vendorsSnapshot = await window.firebaseGetDocs(vendorsQuery);
        
        if (!vendorsSnapshot.empty) {
            const vendorDoc = vendorsSnapshot.docs[0];
            await window.firebaseUpdateDoc(vendorDoc.ref, { vendors: data.vendors });
        }
        
        renderVendorsList();
        
    } catch (error) {
        console.error('Error saving vendors:', error);
    }
}

// Make functions globally accessible
window.editComponent = editComponent;
window.deleteComponent = deleteComponent;
window.addVendor = addVendor;
window.removeVendor = removeVendor;