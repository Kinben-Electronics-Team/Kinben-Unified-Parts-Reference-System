// Firebase Authentication Module - Mock Version for Testing
// In production, replace this with real Firebase implementation

// Firebase configuration (same as production)
const firebaseConfig = {
    apiKey: "AIzaSyDEb-vJyJthW4xZ042Ay_8EDm-RhGBhLxU",
    authDomain: "kinbenpartssystem.firebaseapp.com",
    projectId: "kinbenpartssystem",
    storageBucket: "kinbenpartssystem.firebasestorage.app",
    messagingSenderId: "896608745742",
    appId: "1:896608745742:web:2c84cda1dafbc2519fff5f"
};

// Use mock Firebase for testing
let auth = null;
let db = null;

// Initialize Firebase when mock is loaded
function initializeFirebase() {
    auth = window.mockFirebase.auth;
    db = window.mockFirebase.firestore;
    console.log('Mock Firebase initialized');
}

// Authentication methods
export const authMethods = {
    // Sign in with email and password
    async signIn(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Sign out current user
    async signOut() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Create new user account
    async createUser(email, password) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Listen for authentication state changes
    onAuthStateChanged(callback) {
        return auth.onAuthStateChanged(callback);
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    }
};

// Export Firebase instances
export { auth, db, initializeFirebase };