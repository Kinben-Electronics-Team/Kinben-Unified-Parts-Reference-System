/**
 * Secure Configuration Management
 * Safely loads environment variables and prevents secret exposure
 */

class SecureConfig {
    constructor() {
        this.config = {};
        this.loaded = false;
    }

    /**
     * Load configuration from environment variables or fallback to safe defaults
     */
    async loadConfig() {
        if (this.loaded) return this.config;

        // In browser environment, configuration must be injected during build
        // or loaded from a secure endpoint, never from localStorage
        this.config = {
            firebase: {
                apiKey: this.getEnvVar('FIREBASE_API_KEY', ''),
                authDomain: this.getEnvVar('FIREBASE_AUTH_DOMAIN', 'kinbenpartssystem.firebaseapp.com'),
                projectId: this.getEnvVar('FIREBASE_PROJECT_ID', 'kinbenpartssystem'),
                storageBucket: this.getEnvVar('FIREBASE_STORAGE_BUCKET', 'kinbenpartssystem.appspot.com'),
                messagingSenderId: this.getEnvVar('FIREBASE_MESSAGING_SENDER_ID', ''),
                appId: this.getEnvVar('FIREBASE_APP_ID', '')
            },
            security: {
                enableFirebaseAuth: this.getEnvVar('ENABLE_FIREBASE_AUTH', 'false') === 'true',
                defaultAuthMode: this.getEnvVar('DEFAULT_AUTH_MODE', 'local')
            }
        };

        // Validate configuration
        this.validateConfig();
        this.loaded = true;
        return this.config;
    }

    /**
     * Get environment variable with fallback
     * In browser context, this should be replaced during build process
     */
    getEnvVar(name, defaultValue = '') {
        // In Node.js environment
        if (typeof process !== 'undefined' && process.env) {
            return process.env[name] || defaultValue;
        }
        
        // In browser, env vars should be injected during build
        // Never expose secrets directly in client-side code
        if (typeof window !== 'undefined' && window.__ENV__) {
            return window.__ENV__[name] || defaultValue;
        }
        
        return defaultValue;
    }

    /**
     * Validate that required configuration is present
     */
    validateConfig() {
        if (this.config.security.enableFirebaseAuth) {
            const required = ['apiKey', 'projectId', 'messagingSenderId', 'appId'];
            const missing = required.filter(key => !this.config.firebase[key]);
            
            if (missing.length > 0) {
                console.error('❌ Missing required Firebase configuration:', missing);
                throw new Error(`Missing Firebase configuration: ${missing.join(', ')}`);
            }
        }
    }

    /**
     * Get Firebase configuration (safe for client use)
     */
    getFirebaseConfig() {
        if (!this.loaded) {
            throw new Error('Configuration not loaded. Call loadConfig() first.');
        }
        
        // Only return config if Firebase is enabled and properly configured
        if (this.config.security.enableFirebaseAuth) {
            return this.config.firebase;
        }
        
        return null;
    }

    /**
     * Check if Firebase authentication is enabled
     */
    isFirebaseEnabled() {
        return this.config.security.enableFirebaseAuth;
    }

    /**
     * Get authentication mode
     */
    getAuthMode() {
        return this.config.security.defaultAuthMode;
    }

    /**
     * Sanitized config for debugging (removes sensitive data)
     */
    getDebugConfig() {
        return {
            firebase: {
                authDomain: this.config.firebase.authDomain,
                projectId: this.config.firebase.projectId,
                storageBucket: this.config.firebase.storageBucket,
                apiKey: this.config.firebase.apiKey ? '***' + this.config.firebase.apiKey.slice(-4) : 'not set',
                messagingSenderId: this.config.firebase.messagingSenderId ? '***' + this.config.firebase.messagingSenderId.slice(-4) : 'not set',
                appId: this.config.firebase.appId ? '***' + this.config.firebase.appId.slice(-8) : 'not set'
            },
            security: this.config.security
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecureConfig;
} else if (typeof window !== 'undefined') {
    window.SecureConfig = SecureConfig;
}