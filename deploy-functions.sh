#!/bin/bash

# Deployment script for Firebase Functions
echo "🚀 Deploying Firebase Functions for Email Notifications..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase first:"
    firebase login
fi

# Navigate to functions directory
cd functions

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the functions
echo "🔨 Building functions..."
npm run build

# Deploy functions
echo "🚀 Deploying to Firebase..."
firebase deploy --only functions

echo "✅ Deployment complete!"
echo ""
echo "📧 Next steps:"
echo "1. Update your email configuration in functions/src/config.ts"
echo "2. Test the email functionality by submitting a form"
echo "3. Check Firebase Functions logs if needed: firebase functions:log"
