// Mock Firebase Implementation for Testing
// This simulates Firebase Authentication and Firestore for development/demo purposes

// Mock Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEb-vJyJthW4xZ042Ay_8EDm-RhGBhLxU",
    authDomain: "kinbenpartssystem.firebaseapp.com",
    projectId: "kinbenpartssystem",
    storageBucket: "kinbenpartssystem.firebasestorage.app",
    messagingSenderId: "896608745742",
    appId: "1:896608745742:web:2c84cda1dafbc2519fff5f"
};

// Mock user database (in production this would be Firebase Auth)
const mockUsers = {
    'test@kinben.com': {
        uid: 'user-123',
        email: 'test@kinben.com',
        password: 'test123' // In production, this would be handled by Firebase Auth
    },
    'admin@kinben.com': {
        uid: 'admin-456',
        email: 'admin@kinben.com',
        password: 'admin123'
    }
};

// Mock Firestore database (in production this would be Firestore)
const mockFirestore = {
    users: {}
};

// Current authenticated user
let currentMockUser = null;
let authStateListeners = [];

// Mock Firebase Auth
const mockAuth = {
    signInWithEmailAndPassword: async (email, password) => {
        const user = mockUsers[email];
        if (user && user.password === password) {
            currentMockUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.email.split('@')[0]
            };
            
            // Trigger auth state change
            authStateListeners.forEach(callback => callback(currentMockUser));
            
            return { user: currentMockUser };
        } else {
            throw new Error('Invalid email or password');
        }
    },
    
    signOut: async () => {
        currentMockUser = null;
        authStateListeners.forEach(callback => callback(null));
        return true;
    },
    
    createUserWithEmailAndPassword: async (email, password) => {
        if (mockUsers[email]) {
            throw new Error('User already exists');
        }
        
        const uid = 'user-' + Date.now();
        mockUsers[email] = { uid, email, password };
        
        currentMockUser = {
            uid: uid,
            email: email,
            displayName: email.split('@')[0]
        };
        
        // Initialize user data in Firestore
        mockFirestore.users[uid] = {
            components: {},
            assemblies: {},
            systems: {},
            settings: {
                preferences: {
                    vendors: ['Mouser', 'Digi-Key', 'Arrow', 'Newark', 'Farnell', 'RS Components', 'Avnet', 'Future Electronics']
                }
            }
        };
        
        authStateListeners.forEach(callback => callback(currentMockUser));
        return { user: currentMockUser };
    },
    
    onAuthStateChanged: (callback) => {
        authStateListeners.push(callback);
        // Immediately call with current state
        callback(currentMockUser);
        
        // Return unsubscribe function
        return () => {
            authStateListeners = authStateListeners.filter(cb => cb !== callback);
        };
    },
    
    get currentUser() {
        return currentMockUser;
    }
};

// Mock Firestore
const mockFirestoreHelpers = {
    collection: (path) => ({
        doc: (docId) => ({
            collection: (subPath) => mockFirestoreHelpers.collection(`${path}/${docId}/${subPath}`),
            get: async () => {
                const pathParts = path.split('/');
                let data = mockFirestore;
                
                for (const part of pathParts) {
                    if (data[part] === undefined) {
                        return { exists: false };
                    }
                    data = data[part];
                }
                
                if (data[docId] === undefined) {
                    return { exists: false };
                }
                
                return {
                    exists: true,
                    data: () => data[docId],
                    id: docId
                };
            },
            set: async (docData, options = {}) => {
                const pathParts = path.split('/');
                let data = mockFirestore;
                
                for (const part of pathParts) {
                    if (data[part] === undefined) {
                        data[part] = {};
                    }
                    data = data[part];
                }
                
                if (options.merge) {
                    data[docId] = { ...data[docId], ...docData };
                } else {
                    data[docId] = docData;
                }
                
                return { id: docId };
            },
            update: async (updateData) => {
                const pathParts = path.split('/');
                let data = mockFirestore;
                
                for (const part of pathParts) {
                    if (data[part] === undefined) {
                        data[part] = {};
                    }
                    data = data[part];
                }
                
                data[docId] = { ...data[docId], ...updateData };
                return { id: docId };
            },
            delete: async () => {
                const pathParts = path.split('/');
                let data = mockFirestore;
                
                for (const part of pathParts) {
                    if (data[part] === undefined) {
                        return;
                    }
                    data = data[part];
                }
                
                delete data[docId];
            }
        }),
        add: async (docData) => {
            const docId = 'doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            const pathParts = path.split('/');
            let data = mockFirestore;
            
            for (const part of pathParts) {
                if (data[part] === undefined) {
                    data[part] = {};
                }
                data = data[part];
            }
            
            data[docId] = { ...docData, createdAt: new Date(), updatedAt: new Date() };
            return { id: docId };
        },
        orderBy: (field) => ({
            get: async () => {
                const pathParts = path.split('/');
                let data = mockFirestore;
                
                for (const part of pathParts) {
                    if (data[part] === undefined) {
                        data[part] = {};
                    }
                    data = data[part];
                }
                
                const docs = Object.keys(data).map(id => ({
                    id,
                    data: () => data[id]
                }));
                
                // Simple sorting by field
                docs.sort((a, b) => {
                    const aVal = a.data()[field] || '';
                    const bVal = b.data()[field] || '';
                    return aVal.localeCompare(bVal);
                });
                
                return {
                    forEach: (callback) => docs.forEach(callback)
                };
            },
            onSnapshot: (callback) => {
                // For demo purposes, just call immediately
                mockFirestoreHelpers.collection(path).orderBy(field).get().then(snapshot => {
                    callback(snapshot);
                });
                
                // Return unsubscribe function
                return () => {};
            }
        })
    })
};

// Mock FieldValue
const mockFieldValue = {
    serverTimestamp: () => new Date()
};

// Initialize mock user data if not exists
function initializeMockUserData(uid) {
    if (!mockFirestore.users[uid]) {
        mockFirestore.users[uid] = {
            components: {},
            assemblies: {},
            systems: {},
            settings: {
                preferences: {
                    vendors: ['Mouser', 'Digi-Key', 'Arrow', 'Newark', 'Farnell', 'RS Components', 'Avnet', 'Future Electronics']
                }
            }
        };
    }
}

// Export mock Firebase for use in other modules
window.mockFirebase = {
    auth: mockAuth,
    firestore: mockFirestoreHelpers,
    FieldValue: mockFieldValue,
    initializeMockUserData
};

console.log('Mock Firebase initialized for testing');
console.log('Test users available:');
console.log('- test@kinben.com / test123');
console.log('- admin@kinben.com / admin123');