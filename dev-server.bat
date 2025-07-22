@echo off
REM Local Development Server for Kinben Parts Reference System
echo.
echo ====================================================
echo Starting Kinben Parts Reference System - Dev Server
echo ====================================================
echo.
echo Features available:
echo   - Interactive web interface
echo   - Real-time component management
echo   - Auto-reload on file changes
echo   - GitHub Copilot integration ready
echo.

REM Change to project directory
cd /d "%~dp0"

echo Local development URLs:
echo   Landing Page: http://localhost:8080
echo   Direct App:   http://localhost:8080/KPN_System_Workbook.html
echo.
echo Press Ctrl+C to stop the server
echo ====================================================
echo.

REM Start Python development server
python serve.py

echo.
echo Development server stopped.
pause