// Main Application Logic - Firebase Integration (CDN Version)
import { authMethods, initializeFirebase } from './auth.js';
import { dbMethods } from './db.js';

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
    // Wait for mock Firebase to load
    await waitForMockFirebase();
    initializeFirebase();
    setupAuthListener();
    setupEventListeners();
});

// Utility function to wait for mock Firebase to load
function waitForMockFirebase() {
    return new Promise((resolve) => {
        if (window.mockFirebase) {
            resolve();
        } else {
            const interval = setInterval(() => {
                if (window.mockFirebase) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50); // Check every 50ms
        }
    });
}
// Setup authentication state listener
function setupAuthListener() {
    authMethods.onAuthStateChanged((user) => {
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

// Show login form
function showLoginUI() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('login-error').style.display = 'none';
}

// Show main application
function showAuthenticatedUI() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    // Update user info display
    if (currentUser) {
        document.getElementById('user-email').textContent = currentUser.email;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Component form
    document.getElementById('component-form').addEventListener('submit', handleComponentSubmit);
    
    // Assembly form  
    document.getElementById('assembly-form').addEventListener('submit', handleAssemblySubmit);
    
    // System form
    document.getElementById('system-form').addEventListener('submit', handleSystemSubmit);
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showLoginError('Please enter both email and password.');
        return;
    }
    
    const result = await authMethods.signIn(email, password);
    
    if (result.success) {
        // Authentication successful - UI will update via onAuthStateChanged
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    } else {
        showLoginError(result.error);
    }
}

// Handle logout
async function handleLogout() {
    const result = await authMethods.signOut();
    if (!result.success) {
        console.error('Logout failed:', result.error);
    }
}

// Show login error message
function showLoginError(message) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Load user data from Firestore
async function loadUserData() {
    if (!currentUser) return;
    
    try {
        // Load components
        const componentsResult = await dbMethods.getComponents(currentUser.uid);
        if (componentsResult.success) {
            data.components = componentsResult.data;
        }
        
        // Load assemblies
        const assembliesResult = await dbMethods.getAssemblies(currentUser.uid);
        if (assembliesResult.success) {
            data.assemblies = assembliesResult.data;
        }
        
        // Load systems
        const systemsResult = await dbMethods.getSystems(currentUser.uid);
        if (systemsResult.success) {
            data.systems = systemsResult.data;
        }
        
        // Load user preferences
        const prefsResult = await dbMethods.getUserPreferences(currentUser.uid);
        if (prefsResult.success) {
            data.vendors = prefsResult.data.vendors || data.vendors;
        }
        
        // Update UI
        renderAll();
        updateStats();
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Switch between tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Handle component form submission
async function handleComponentSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const formData = new FormData(e.target);
    const componentData = {};
    
    // Extract form data
    for (let [key, value] of formData.entries()) {
        componentData[key] = value;
    }
    
    // Generate KPN if not editing
    if (!editingComponent) {
        componentData.kpn = generateKPN('components', componentData.category);
    }
    
    try {
        if (editingComponent) {
            // Update existing component
            const result = await dbMethods.updateComponent(currentUser.uid, editingComponent.id, componentData);
            if (result.success) {
                editingComponent = null;
                document.getElementById('component-form').reset();
                loadUserData(); // Refresh data
            } else {
                alert('Error updating component: ' + result.error);
            }
        } else {
            // Add new component
            const result = await dbMethods.addComponent(currentUser.uid, componentData);
            if (result.success) {
                document.getElementById('component-form').reset();
                loadUserData(); // Refresh data
            } else {
                alert('Error adding component: ' + result.error);
            }
        }
    } catch (error) {
        alert('Error saving component: ' + error.message);
    }
}

// Handle assembly form submission
async function handleAssemblySubmit(e) {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const formData = new FormData(e.target);
    const assemblyData = {};
    
    // Extract form data
    for (let [key, value] of formData.entries()) {
        assemblyData[key] = value;
    }
    
    // Generate KPN if not editing
    if (!editingAssembly) {
        assemblyData.kpn = generateKPN('assemblies', 'PCB');
    }
    
    try {
        if (editingAssembly) {
            // Update existing assembly
            const result = await dbMethods.updateAssembly(currentUser.uid, editingAssembly.id, assemblyData);
            if (result.success) {
                editingAssembly = null;
                document.getElementById('assembly-form').reset();
                loadUserData(); // Refresh data
            } else {
                alert('Error updating assembly: ' + result.error);
            }
        } else {
            // Add new assembly
            const result = await dbMethods.addAssembly(currentUser.uid, assemblyData);
            if (result.success) {
                document.getElementById('assembly-form').reset();
                loadUserData(); // Refresh data
            } else {
                alert('Error adding assembly: ' + result.error);
            }
        }
    } catch (error) {
        alert('Error saving assembly: ' + error.message);
    }
}

// Handle system form submission
async function handleSystemSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const formData = new FormData(e.target);
    const systemData = {};
    
    // Extract form data
    for (let [key, value] of formData.entries()) {
        systemData[key] = value;
    }
    
    // Generate KPN if not editing
    if (!editingSystem) {
        systemData.kpn = generateKPN('systems', 'SYS');
    }
    
    try {
        if (editingSystem) {
            // Update existing system
            const result = await dbMethods.updateSystem(currentUser.uid, editingSystem.id, systemData);
            if (result.success) {
                editingSystem = null;
                document.getElementById('system-form').reset();
                loadUserData(); // Refresh data
            } else {
                alert('Error updating system: ' + result.error);
            }
        } else {
            // Add new system
            const result = await dbMethods.addSystem(currentUser.uid, systemData);
            if (result.success) {
                document.getElementById('system-form').reset();
                loadUserData(); // Refresh data
            } else {
                alert('Error adding system: ' + result.error);
            }
        }
    } catch (error) {
        alert('Error saving system: ' + error.message);
    }
}

// Generate KPN (keeping existing logic)
function generateKPN(type, category) {
    let prefix = '';
    let items = [];
    
    switch (type) {
        case 'components':
            const categoryConfigs = {
                'resistors': 'RES',
                'capacitors': 'CAP',
                'inductors': 'IND',
                'ics': 'IC',
                'diodes': 'DIO',
                'transistors': 'TRA',
                'connectors': 'CON',
                'switches': 'SW'
            };
            prefix = categoryConfigs[category] || 'CMP';
            items = data.components;
            break;
        case 'assemblies':
            prefix = 'PCB';
            items = data.assemblies;
            break;
        case 'systems':
            prefix = 'SYS';
            items = data.systems;
            break;
    }
    
    // Find highest existing number for this prefix
    let maxNum = 0;
    items.forEach(item => {
        if (item.kpn && item.kpn.startsWith(prefix)) {
            const num = parseInt(item.kpn.split('-').pop());
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });
    
    return `${prefix}-${String(maxNum + 1).padStart(3, '0')}`;
}

// Render all data tables
function renderAll() {
    renderComponents();
    renderAssemblies();
    renderSystems();
}

// Render components table
function renderComponents() {
    const tbody = document.getElementById('components-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.components.forEach(component => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${component.kpn || ''}</td>
            <td>${component.category || ''}</td>
            <td>${component.subcategory || ''}</td>
            <td>${component.value || component['manufacturer-pn'] || ''}</td>
            <td>${component.package || ''}</td>
            <td>${component['preferred-vendor'] || ''}</td>
            <td>
                <button onclick="editComponent('${component.id}')" class="btn btn-sm">Edit</button>
                <button onclick="deleteComponent('${component.id}')" class="btn btn-sm btn-danger">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render assemblies table
function renderAssemblies() {
    const tbody = document.getElementById('assemblies-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.assemblies.forEach(assembly => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${assembly.kpn || ''}</td>
            <td>${assembly.name || ''}</td>
            <td>${assembly.version || ''}</td>
            <td>${assembly.description || ''}</td>
            <td>
                <button onclick="editAssembly('${assembly.id}')" class="btn btn-sm">Edit</button>
                <button onclick="deleteAssembly('${assembly.id}')" class="btn btn-sm btn-danger">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render systems table
function renderSystems() {
    const tbody = document.getElementById('systems-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.systems.forEach(system => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${system.kpn || ''}</td>
            <td>${system.name || ''}</td>
            <td>${system.version || ''}</td>
            <td>${system.description || ''}</td>
            <td>
                <button onclick="editSystem('${system.id}')" class="btn btn-sm">Edit</button>
                <button onclick="deleteSystem('${system.id}')" class="btn btn-sm btn-danger">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update statistics
function updateStats() {
    const statsElements = {
        'components-count': data.components.length,
        'assemblies-count': data.assemblies.length,
        'systems-count': data.systems.length
    };
    
    for (const [id, count] of Object.entries(statsElements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = count;
        }
    }
}

// Edit functions (global scope for onclick handlers)
window.editComponent = async function(id) {
    const component = data.components.find(c => c.id === id);
    if (component) {
        editingComponent = component;
        // Populate form with component data
        const form = document.getElementById('component-form');
        for (const [key, value] of Object.entries(component)) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        }
        switchTab('components');
    }
};

window.deleteComponent = async function(id) {
    if (confirm('Are you sure you want to delete this component?')) {
        const result = await dbMethods.deleteComponent(currentUser.uid, id);
        if (result.success) {
            loadUserData();
        } else {
            alert('Error deleting component: ' + result.error);
        }
    }
};

window.editAssembly = async function(id) {
    const assembly = data.assemblies.find(a => a.id === id);
    if (assembly) {
        editingAssembly = assembly;
        // Populate form with assembly data
        const form = document.getElementById('assembly-form');
        for (const [key, value] of Object.entries(assembly)) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        }
        switchTab('assemblies');
    }
};

window.deleteAssembly = async function(id) {
    if (confirm('Are you sure you want to delete this assembly?')) {
        const result = await dbMethods.deleteAssembly(currentUser.uid, id);
        if (result.success) {
            loadUserData();
        } else {
            alert('Error deleting assembly: ' + result.error);
        }
    }
};

window.editSystem = async function(id) {
    const system = data.systems.find(s => s.id === id);
    if (system) {
        editingSystem = system;
        // Populate form with system data
        const form = document.getElementById('system-form');
        for (const [key, value] of Object.entries(system)) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        }
        switchTab('systems');
    }
};

window.deleteSystem = async function(id) {
    if (confirm('Are you sure you want to delete this system?')) {
        const result = await dbMethods.deleteSystem(currentUser.uid, id);
        if (result.success) {
            loadUserData();
        } else {
            alert('Error deleting system: ' + result.error);
        }
    }
};