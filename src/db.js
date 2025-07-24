// Firestore Database Helpers - Mock Version for Testing
import { db } from './auth.js';

// Database helper methods
export const dbMethods = {
    // Get all components for a user
    async getComponents(uid) {
        try {
            // Initialize user data if not exists
            window.mockFirebase.initializeMockUserData(uid);
            
            const componentsRef = db.collection('users').doc(uid).collection('components');
            const querySnapshot = await componentsRef.orderBy('kpn').get();
            const components = [];
            querySnapshot.forEach((doc) => {
                components.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: components };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Add a new component for a user
    async addComponent(uid, componentData) {
        try {
            window.mockFirebase.initializeMockUserData(uid);
            
            const componentsRef = db.collection('users').doc(uid).collection('components');
            const docRef = await componentsRef.add({
                ...componentData,
                createdAt: window.mockFirebase.FieldValue.serverTimestamp(),
                updatedAt: window.mockFirebase.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update a component
    async updateComponent(uid, componentId, componentData) {
        try {
            const componentRef = db.collection('users').doc(uid).collection('components').doc(componentId);
            await componentRef.update({
                ...componentData,
                updatedAt: window.mockFirebase.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete a component
    async deleteComponent(uid, componentId) {
        try {
            const componentRef = db.collection('users').doc(uid).collection('components').doc(componentId);
            await componentRef.delete();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get all assemblies for a user
    async getAssemblies(uid) {
        try {
            window.mockFirebase.initializeMockUserData(uid);
            
            const assembliesRef = db.collection('users').doc(uid).collection('assemblies');
            const querySnapshot = await assembliesRef.orderBy('kpn').get();
            const assemblies = [];
            querySnapshot.forEach((doc) => {
                assemblies.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: assemblies };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Add a new assembly for a user
    async addAssembly(uid, assemblyData) {
        try {
            window.mockFirebase.initializeMockUserData(uid);
            
            const assembliesRef = db.collection('users').doc(uid).collection('assemblies');
            const docRef = await assembliesRef.add({
                ...assemblyData,
                createdAt: window.mockFirebase.FieldValue.serverTimestamp(),
                updatedAt: window.mockFirebase.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update an assembly
    async updateAssembly(uid, assemblyId, assemblyData) {
        try {
            const assemblyRef = db.collection('users').doc(uid).collection('assemblies').doc(assemblyId);
            await assemblyRef.update({
                ...assemblyData,
                updatedAt: window.mockFirebase.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete an assembly
    async deleteAssembly(uid, assemblyId) {
        try {
            const assemblyRef = db.collection('users').doc(uid).collection('assemblies').doc(assemblyId);
            await assemblyRef.delete();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get all systems for a user
    async getSystems(uid) {
        try {
            window.mockFirebase.initializeMockUserData(uid);
            
            const systemsRef = db.collection('users').doc(uid).collection('systems');
            const querySnapshot = await systemsRef.orderBy('kpn').get();
            const systems = [];
            querySnapshot.forEach((doc) => {
                systems.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: systems };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Add a new system for a user
    async addSystem(uid, systemData) {
        try {
            window.mockFirebase.initializeMockUserData(uid);
            
            const systemsRef = db.collection('users').doc(uid).collection('systems');
            const docRef = await systemsRef.add({
                ...systemData,
                createdAt: window.mockFirebase.FieldValue.serverTimestamp(),
                updatedAt: window.mockFirebase.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update a system
    async updateSystem(uid, systemId, systemData) {
        try {
            const systemRef = db.collection('users').doc(uid).collection('systems').doc(systemId);
            await systemRef.update({
                ...systemData,
                updatedAt: window.mockFirebase.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete a system
    async deleteSystem(uid, systemId) {
        try {
            const systemRef = db.collection('users').doc(uid).collection('systems').doc(systemId);
            await systemRef.delete();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get user preferences
    async getUserPreferences(uid) {
        try {
            window.mockFirebase.initializeMockUserData(uid);
            
            const userRef = db.collection('users').doc(uid).collection('settings').doc('preferences');
            const docSnap = await userRef.get();
            if (docSnap.exists) {
                return { success: true, data: docSnap.data() };
            } else {
                // Return default preferences
                return { 
                    success: true, 
                    data: { 
                        vendors: ['Mouser', 'Digi-Key', 'Arrow', 'Newark', 'Farnell', 'RS Components', 'Avnet', 'Future Electronics'] 
                    } 
                };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update user preferences
    async updateUserPreferences(uid, preferences) {
        try {
            const userRef = db.collection('users').doc(uid).collection('settings').doc('preferences');
            await userRef.set({
                ...preferences,
                updatedAt: window.mockFirebase.FieldValue.serverTimestamp()
            }, { merge: true });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Listen for real-time updates to components
    onComponentsSnapshot(uid, callback) {
        const componentsRef = db.collection('users').doc(uid).collection('components');
        return componentsRef.orderBy('kpn').onSnapshot((snapshot) => {
            const components = [];
            snapshot.forEach((doc) => {
                components.push({ id: doc.id, ...doc.data() });
            });
            callback(components);
        });
    },

    // Listen for real-time updates to assemblies
    onAssembliesSnapshot(uid, callback) {
        const assembliesRef = db.collection('users').doc(uid).collection('assemblies');
        return assembliesRef.orderBy('kpn').onSnapshot((snapshot) => {
            const assemblies = [];
            snapshot.forEach((doc) => {
                assemblies.push({ id: doc.id, ...doc.data() });
            });
            callback(assemblies);
        });
    },

    // Listen for real-time updates to systems
    onSystemsSnapshot(uid, callback) {
        const systemsRef = db.collection('users').doc(uid).collection('systems');
        return systemsRef.orderBy('kpn').onSnapshot((snapshot) => {
            const systems = [];
            snapshot.forEach((doc) => {
                systems.push({ id: doc.id, ...doc.data() });
            });
            callback(systems);
        });
    }
};