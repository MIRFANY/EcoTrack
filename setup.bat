@echo off
REM EcoTrack Setup Script for Windows
REM Run this script to get started quickly

echo.
echo 🌍 Welcome to EcoTrack!
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✓ Node.js %NODE_VERSION% found
echo ✓ npm %NPM_VERSION% found
echo.

REM Check if MongoDB is available
echo Checking MongoDB...
where mongod >nul 2>&1
if not errorlevel 1 (
    echo ✓ MongoDB found locally
) else (
    echo ⚠️  Local MongoDB not found
    echo    Options:
    echo    1. Install MongoDB: https://docs.mongodb.com/manual/installation/
    echo    2. Use MongoDB Atlas: https://www.mongodb.com/cloud/atlas
)
echo.

REM Install dependencies
echo 📦 Installing dependencies...
echo    This may take a few minutes...
call npm run install-all

if errorlevel 1 (
    echo ❌ Installation failed!
    pause
    exit /b 1
)

echo.
echo ✅ Installation complete!
echo.
echo 📋 Next Steps:
echo    1. Edit server\.env with your MongoDB connection
echo    2. Run: npm run dev
echo    3. Open: http://localhost:3000
echo.
echo 📚 Documentation:
echo    - Quick start: QUICKSTART.md
echo    - Full guide: README.md
echo    - Project overview: PROJECT_SUMMARY.md
echo.
echo 🚀 Ready to start?
echo    Type: npm run dev
echo.
pause
