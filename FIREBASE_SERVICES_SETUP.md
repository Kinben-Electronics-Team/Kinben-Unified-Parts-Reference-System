# Firebase Services Setup Guide

## 🔥 Enable Required Firebase Services

Since we're encountering authentication issues with Firebase CLI, please follow these manual steps to enable the required services in your Firebase Console.

### 1. Access Firebase Console
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project: **kinbenpartssystem**

### 2. Enable Authentication

#### Step 2.1: Enable Authentication Service
1. In the left sidebar, click on **"Authentication"**
2. Click **"Get started"** if this is the first time
3. Go to the **"Sign-in method"** tab

#### Step 2.2: Enable Email/Password Authentication
1. Click on **"Email/Password"** provider
2. **Enable** the first option (Email/Password)
3. You can leave the second option (Email link) disabled for now
4. Click **"Save"**

### 3. Enable Firestore Database

#### Step 3.1: Create Firestore Database
1. In the left sidebar, click on **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll set up proper rules later)
4. Select a location (choose closest to your users, e.g., `us-central1`)
5. Click **"Done"**

#### Step 3.2: Configure Firestore Rules (Optional - for Production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write components
    match /components/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write PCBs
    match /pcbs/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write systems
    match /systems/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Test Users for Development

Create test users in Authentication:
1. Go to **Authentication > Users**
2. Click **"Add user"**
3. Create these test accounts:
   - **Email**: `admin@kinben.local` | **Password**: `admin123`
   - **Email**: `team@kinben.local` | **Password**: `team123`

### 5. Verify Configuration

Your Firebase configuration in the app should match:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDEb-vJyJthW4xZ042Ay_8EDm-RhGBhLxU",
    authDomain: "kinbenpartssystem.firebaseapp.com",
    projectId: "kinbenpartssystem",
    storageBucket: "kinbenpartssystem.firebasestorage.app",
    messagingSenderId: "896608745742",
    appId: "1:896608745742:web:2c84cda1dafbc2519fff5f"
};
```

### 6. Local Testing Alternative

Since Firebase CLI authentication is having issues, you can:

1. **Open the built app directly**: Open `dist/index.html` in your browser
2. **Use a local server**: 
   ```bash
   # Using Python (if installed)
   cd dist
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```
3. **Test Firebase Integration**: Try logging in with the test accounts created above

### 7. Deploy When Ready

Once Firebase services are enabled and tested:
1. Fix Firebase CLI authentication issues
2. Run: `firebase deploy --only hosting`
3. Your app will be live at: https://kinbenpartssystem.web.app/

## 🚨 Current Status

- ✅ **App Built**: Firebase-ready distribution in `dist/` folder
- ✅ **Firebase SDK**: Properly integrated in application  
- ✅ **Configuration**: Firebase project config is correct
- ❌ **CLI Auth**: Firebase CLI authentication needs fixing
- ⏳ **Services**: Need manual setup in Firebase Console
- ⏳ **Testing**: Awaiting service enablement for testing

## Next Steps

1. **You**: Enable Authentication and Firestore in Firebase Console (steps above)
2. **You**: Create test users for development
3. **Claude**: Attempt deployment once services are enabled
4. **Both**: Test the live application functionality

---

**Firebase Project**: kinbenpartssystem  
**Built App Location**: `./dist/`  
**Configuration Status**: ✅ Ready  
**Services Status**: ⏳ Awaiting manual setup  
**Test Push**: 2025-07-24 - Testing deployment workflow trigger