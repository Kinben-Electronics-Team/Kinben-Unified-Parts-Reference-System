// Firebase Authentication Module
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEb-vJyJthW4xZ042Ay_8EDm-RhGBhLxU",
    authDomain: "kinbenpartssystem.firebaseapp.com",
    projectId: "kinbenpartssystem",
    storageBucket: "kinbenpartssystem.firebasestorage.app",
    messagingSenderId: "896608745742",
    appId: "1:896608745742:web:2c84cda1dafbc2519fff5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export initialized instances
export { auth, db };

// Authentication methods
export const authMethods = {
    // Sign in with email and password
    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Sign out current user
    async signOut() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Create new user account
    async createUser(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Listen for authentication state changes
    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    }
};