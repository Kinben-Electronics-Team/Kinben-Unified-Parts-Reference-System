@echo off
REM Deploy Kinben Parts Reference System to Raspberry Pi
echo.
echo ====================================================
echo Deploying Kinben Parts Reference System to RPi...
echo ====================================================
echo.

REM Change to project directory
cd /d "%~dp0"

REM Check if SSH key exists
if not exist "..\Kinben ERP Setup\raspberry_pi_key" (
    echo ERROR: SSH key not found!
    echo Please ensure raspberry_pi_key exists in the Kinben ERP Setup folder
    pause
    exit /b 1
)

echo [1/5] Committing local changes...
git add -A
git commit -m "Auto-deploy: %date% %time%" 2>nul

echo [2/5] Pushing to GitHub...
git push origin master

echo [3/5] Transferring files to Raspberry Pi...
scp -i "..\Kinben ERP Setup\raspberry_pi_key" -r * kinben@192.168.1.25:/home/kinben/web-apps/Kinben-Unified-Parts-Reference-System/

echo [4/5] Restarting service on RPi...
ssh -i "..\Kinben ERP Setup\raspberry_pi_key" kinben@192.168.1.25 "sudo systemctl restart kinben-parts-system.service"

echo [5/5] Checking deployment status...
ssh -i "..\Kinben ERP Setup\raspberry_pi_key" kinben@192.168.1.25 "sudo systemctl is-active kinben-parts-system.service && curl -s http://127.0.0.1:3000 | head -3"

echo.
echo ====================================================
echo Deployment completed successfully!
echo.
echo Access your application at:
echo - http://192.168.1.25:3000 (Main network)
echo - http://192.168.4.1:3000 (Wi-Fi hotspot)
echo ====================================================
pause