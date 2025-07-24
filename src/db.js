// Firestore Database Helpers
import { 
    collection, 
    doc, 
    getDocs, 
    getDoc,
    addDoc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot,
    orderBy,
    query 
} from 'firebase/firestore';
import { db } from './auth.js';

// Database helper methods
export const dbMethods = {
    // Get all components for a user
    async getComponents(uid) {
        try {
            const componentsRef = collection(db, 'users', uid, 'components');
            const querySnapshot = await getDocs(query(componentsRef, orderBy('kpn')));
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
            const componentsRef = collection(db, 'users', uid, 'components');
            const docRef = await addDoc(componentsRef, {
                ...componentData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update a component
    async updateComponent(uid, componentId, componentData) {
        try {
            const componentRef = doc(db, 'users', uid, 'components', componentId);
            await updateDoc(componentRef, {
                ...componentData,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete a component
    async deleteComponent(uid, componentId) {
        try {
            const componentRef = doc(db, 'users', uid, 'components', componentId);
            await deleteDoc(componentRef);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get all assemblies for a user
    async getAssemblies(uid) {
        try {
            const assembliesRef = collection(db, 'users', uid, 'assemblies');
            const querySnapshot = await getDocs(query(assembliesRef, orderBy('kpn')));
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
            const assembliesRef = collection(db, 'users', uid, 'assemblies');
            const docRef = await addDoc(assembliesRef, {
                ...assemblyData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update an assembly
    async updateAssembly(uid, assemblyId, assemblyData) {
        try {
            const assemblyRef = doc(db, 'users', uid, 'assemblies', assemblyId);
            await updateDoc(assemblyRef, {
                ...assemblyData,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete an assembly
    async deleteAssembly(uid, assemblyId) {
        try {
            const assemblyRef = doc(db, 'users', uid, 'assemblies', assemblyId);
            await deleteDoc(assemblyRef);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get all systems for a user
    async getSystems(uid) {
        try {
            const systemsRef = collection(db, 'users', uid, 'systems');
            const querySnapshot = await getDocs(query(systemsRef, orderBy('kpn')));
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
            const systemsRef = collection(db, 'users', uid, 'systems');
            const docRef = await addDoc(systemsRef, {
                ...systemData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update a system
    async updateSystem(uid, systemId, systemData) {
        try {
            const systemRef = doc(db, 'users', uid, 'systems', systemId);
            await updateDoc(systemRef, {
                ...systemData,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete a system
    async deleteSystem(uid, systemId) {
        try {
            const systemRef = doc(db, 'users', uid, 'systems', systemId);
            await deleteDoc(systemRef);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get user preferences
    async getUserPreferences(uid) {
        try {
            const userRef = doc(db, 'users', uid, 'settings', 'preferences');
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
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
            const userRef = doc(db, 'users', uid, 'settings', 'preferences');
            await updateDoc(userRef, {
                ...preferences,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Listen for real-time updates to components
    onComponentsSnapshot(uid, callback) {
        const componentsRef = collection(db, 'users', uid, 'components');
        return onSnapshot(query(componentsRef, orderBy('kpn')), (snapshot) => {
            const components = [];
            snapshot.forEach((doc) => {
                components.push({ id: doc.id, ...doc.data() });
            });
            callback(components);
        });
    },

    // Listen for real-time updates to assemblies
    onAssembliesSnapshot(uid, callback) {
        const assembliesRef = collection(db, 'users', uid, 'assemblies');
        return onSnapshot(query(assembliesRef, orderBy('kpn')), (snapshot) => {
            const assemblies = [];
            snapshot.forEach((doc) => {
                assemblies.push({ id: doc.id, ...doc.data() });
            });
            callback(assemblies);
        });
    },

    // Listen for real-time updates to systems
    onSystemsSnapshot(uid, callback) {
        const systemsRef = collection(db, 'users', uid, 'systems');
        return onSnapshot(query(systemsRef, orderBy('kpn')), (snapshot) => {
            const systems = [];
            snapshot.forEach((doc) => {
                systems.push({ id: doc.id, ...doc.data() });
            });
            callback(systems);
        });
    }
};