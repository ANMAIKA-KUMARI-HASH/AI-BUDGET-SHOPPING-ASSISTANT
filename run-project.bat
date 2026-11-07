@echo off
title AI Budget Shopping Assistant - Launcher
color 0A

echo ========================================================
echo    AI BUDGET SHOPPING ASSISTANT - LAUNCHER
echo ========================================================
echo.

:: Add common Node.js locations to PATH
if exist "%LOCALAPPDATA%\Programs\nodejs" (
    set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
)
if exist "%ProgramFiles%\nodejs" (
    set "PATH=%ProgramFiles%\nodejs;%PATH%"
)

echo [1/3] Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do echo       Node.js is detected! (Version: %%v)
echo.

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%Backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"

echo [2/3] Launching Express Backend Server (Port 5000)...
start "AI Shopping Backend (Port 5000)" /D "%BACKEND_DIR%" cmd /k "set \"PATH=%PATH%\" && node server.js"

echo [3/3] Launching Vite React Frontend (Port 3000)...
start "AI Shopping Frontend (Port 3000)" /D "%FRONTEND_DIR%" cmd /k "set \"PATH=%PATH%\" && npm run dev"

echo.
echo ========================================================
echo  Both Servers are starting!
echo  Backend API: http://localhost:5000
echo  Frontend UI: http://localhost:3000
echo ========================================================
echo.
echo Waiting 3 seconds for servers to initialize before opening browser...
timeout /t 3 >nul
start http://localhost:3000

echo.
echo Done! Please keep the two command windows open while using the app.
pause
