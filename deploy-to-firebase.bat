@echo off
REM Deploy Kinben Parts Reference System to Firebase
echo.
echo ====================================================
echo Deploying to Firebase: theclever.studio/KPS
echo ====================================================
echo.

REM Change to project directory
cd /d "%~dp0"

echo [1/4] Building for Firebase...
node build-for-firebase.js

echo [2/4] Checking Firebase login...
npx firebase login --no-localhost

echo [3/4] Deploying to Firebase...
npx firebase deploy --only hosting

echo [4/4] Deployment completed!
echo.
echo ====================================================
echo Your application is now live at:
echo https://theclever.studio/KPS
echo ====================================================
echo.
echo Firebase Project URL:
npx firebase hosting:channel:list

pause