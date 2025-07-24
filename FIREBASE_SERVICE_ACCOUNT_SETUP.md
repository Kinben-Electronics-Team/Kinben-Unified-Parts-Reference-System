# 🔑 Firebase Service Account Setup for Automated Deployment

This guide shows you how to set up the `FIREBASE_SERVICE_ACCOUNT` secret needed for automated GitHub → Firebase deployment.

## 🎯 Overview

The repository is configured for automatic deployment to Firebase when you push to the main branch. However, it needs a Firebase service account key to authenticate with Firebase during deployment.

## 📋 Step-by-Step Setup

### Step 1: Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **`kinbenpartssystem`**
3. Click the gear icon (⚙️) → **Project settings**

### Step 2: Create Service Account

1. In Project settings, click the **Service accounts** tab
2. Click **Generate new private key**
3. In the dialog, click **Generate key**
4. A JSON file will download - **save this securely!**

> ⚠️ **Important**: This JSON file contains sensitive credentials. Never commit it to your repository or share it publicly.

### Step 3: Copy the JSON Content

1. Open the downloaded JSON file in a text editor
2. Copy the entire JSON content (including the outer `{ }` braces)
3. The content should look like this:

```json
{
  "type": "service_account",
  "project_id": "kinbenpartssystem",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@kinbenpartssystem.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40kinbenpartssystem.iam.gserviceaccount.com"
}
```

### Step 4: Add Secret to GitHub Repository

1. Go to your GitHub repository: `<YOUR_REPOSITORY_URL>`

> Replace `<YOUR_REPOSITORY_URL>` with the URL of your GitHub repository (e.g., `https://github.com/your-username/your-repository-name`).
2. Click **Settings** tab (in the repository, not your profile)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Set the secret:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT`
   - **Value**: Paste the entire JSON content you copied in Step 3
6. Click **Add secret**

### Step 5: Test the Deployment

1. Make a small change to any file (e.g., add a comment to `README.md`)
2. Commit and push to the main branch:
   ```bash
   git add .
   git commit -m "Test automated deployment"
   git push origin main
   ```
3. Go to **Actions** tab in your GitHub repository
4. Watch the "Deploy KPN System Workbook" workflow run
5. If successful, your changes will appear at: https://kinbenpartssystem.web.app/

## ✅ Verification

After setup, you should see:

1. **GitHub Actions**: The deploy workflow runs without the "FIREBASE_SERVICE_ACCOUNT secret is not set" error
2. **Live Site**: Changes appear automatically at https://kinbenpartssystem.web.app/
3. **No Manual Steps**: Push to main → automatic deployment

## 🔧 Troubleshooting

### "FIREBASE_SERVICE_ACCOUNT secret is not set"
- Double-check the secret name is exactly: `FIREBASE_SERVICE_ACCOUNT`
- Ensure you pasted the complete JSON (including `{ }` braces)
- Verify you're adding the secret to the correct repository

### "Permission denied" during deployment
- Make sure the Firebase project ID in the JSON matches `kinbenpartssystem`
- Verify your Firebase project has Firebase Hosting enabled
- Check that the service account has proper permissions

### "Invalid JSON" error
- Ensure the JSON is valid (no extra characters)
- Don't modify the JSON content - use exactly what Firebase generated
- Make sure there are no trailing spaces or newlines

## 🎉 Success!

Once configured correctly:
- Every push to `main` branch → Automatic deployment to Firebase
- Live site updates immediately: https://kinbenpartssystem.web.app/
- No manual deployment steps required
- Full CI/CD pipeline active

## 🔒 Security Notes

- The service account key is sensitive - never share it publicly
- GitHub encrypts secrets and only makes them available during workflow runs
- The key allows deployment access to your Firebase project
- Regularly review and rotate keys if needed

---

**Need Help?** If you encounter issues, check the GitHub Actions logs for detailed error messages, or review the Firebase Console for project settings.