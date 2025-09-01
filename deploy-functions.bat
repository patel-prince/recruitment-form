@echo off
echo 🚀 Deploying Firebase Functions for Email Notifications...

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI is not installed. Please install it first:
    echo npm install -g firebase-tools
    pause
    exit /b 1
)

REM Check if user is logged in
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please login to Firebase first:
    firebase login
)

REM Navigate to functions directory
cd functions

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the functions
echo 🔨 Building functions...
npm run build

REM Deploy functions
echo 🚀 Deploying to Firebase...
firebase deploy --only functions

echo ✅ Deployment complete!
echo.
echo 📧 Next steps:
echo 1. Update your email configuration in functions/src/config.ts
echo 2. Test the email functionality by submitting a form
echo 3. Check Firebase Functions logs if needed: firebase functions:log
pause
