# Firebase Setup Guide for Google Authentication

This guide explains how to configure Firebase Authentication and Firestore for the KPN System.

## 🔧 Firebase Console Setup

### 1. Create/Configure Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your existing project: `the-clever-studio-f3b16`
3. Or create a new project if needed

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **Google** provider
3. Click **Enable**
4. Add your authorized domains:
   - `the-clever-studio-f3b16.web.app`
   - `localhost` (for development)
5. Save changes

### 3. Enable Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for initial setup)
4. Select your preferred location
5. Click **Done**

### 4. Configure Security Rules

In **Firestore Database** → **Rules**, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read their own data
    // Only admins can write user data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web app** (</> icon)
4. Copy the `firebaseConfig` object

## 🔑 Update Application Configuration

Replace the placeholder config in `KPN_System_Workbook.html`:

```javascript
// Replace this section (around line 892)
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "the-clever-studio-f3b16.firebaseapp.com",
    projectId: "the-clever-studio-f3b16",
    storageBucket: "the-clever-studio-f3b16.appspot.com",
    messagingSenderId: "your-actual-sender-id",
    appId: "your-actual-app-id"
};
```

## 👥 Initial Admin Setup

After deployment, the first user to sign in will have no role. To create the first admin:

### Option 1: Firestore Console (Recommended)

1. Go to **Firestore Database** → **Data**
2. Find the `users` collection
3. Click on your user document
4. Edit the `role` field to `admin`
5. Save changes

### Option 2: Temporary Admin Creation

Temporarily add this code after line 943 (after Firebase initialization):

```javascript
// TEMPORARY: Create first admin - REMOVE AFTER USE
async function createFirstAdmin() {
    const user = auth.currentUser;
    const firstAdminEmail = process.env.FIRST_ADMIN_EMAIL;
    if (!firstAdminEmail) {
        console.warn('Environment variable FIRST_ADMIN_EMAIL is not set. Admin creation skipped.');
        return;
    }
    if (user && user.email === firstAdminEmail) {
        await db.collection('users').doc(user.uid).update({role: 'admin'});
        console.log('First admin created!');
    }
}
// Call this function after signing in, then remove this code
```

## 🚀 Testing the Setup

1. Deploy the updated application
2. Sign in with Google
3. Check Firestore for user document creation
4. Assign admin role to first user
5. Test user management interface

## 🔒 Security Best Practices

1. **Firestore Rules**: Always use strict security rules in production
2. **Admin Assignment**: Only assign admin roles to trusted users
3. **Regular Audits**: Periodically review user roles and access
4. **Backup Strategy**: Regular Firestore backups recommended

## 🐛 Troubleshooting

### Common Issues:

**Error: Firebase not defined**
- Check that Firebase CDN URLs are accessible
- Verify firebaseConfig is correct

**Sign-in popup blocked**
- Ensure popups are allowed for your domain
- Try using redirect instead of popup method

**Permission denied**
- Check Firestore security rules
- Verify user has correct role assignment

**No users showing in management**
- Ensure user has admin role
- Check browser console for errors

## 📊 User Role System

- **None**: Default for new users - no system access
- **Team**: Can create/edit/archive components, PCBs, systems  
- **Admin**: All team permissions + delete components + manage users

The system maintains backward compatibility with all existing role-based permissions.