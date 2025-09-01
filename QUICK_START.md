# Quick Start Guide - Email Notifications

## 🚀 Get Email Notifications Working in 5 Minutes

### Step 1: Configure Your Email (2 minutes)

1. **Open** `functions/src/config.ts`
2. **Replace** the placeholder values:
   ```typescript
   export const emailConfig = {
     service: 'gmail',
     auth: {
       user: 'your-actual-email@gmail.com', // Your Gmail
       pass: 'your-app-password' // Gmail App Password (see below)
     }
   };

   export const CLIENT_EMAIL = 'client@example.com'; // Where to send notifications
   ```

### Step 2: Get Gmail App Password (1 minute)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Go to **App passwords** → **Mail** → **Generate**
4. Copy the 16-character password
5. Paste it in `functions/src/config.ts` as the `pass` value

### Step 3: Deploy Functions (2 minutes)

**Option A: Using the script (Windows)**
```bash
deploy-functions.bat
```

**Option B: Using the script (Mac/Linux)**
```bash
chmod +x deploy-functions.sh
./deploy-functions.sh
```

**Option C: Manual deployment**
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

### Step 4: Test It! (30 seconds)

1. **Submit your recruitment form**
2. **Check the client email** - you should receive a beautifully formatted email with all the form data!

### 🎉 That's it!

Your form now automatically sends email notifications whenever someone submits it.

## 🔧 Troubleshooting

**No email received?**
- Check `firebase functions:log` for errors
- Verify your Gmail App Password is correct
- Make sure the CLIENT_EMAIL is valid

**Need help?**
- Check the full setup guide: `SETUP_EMAIL_NOTIFICATIONS.md`
- Review Firebase Functions logs: `firebase functions:log`

## 📧 Email Features

✅ **Professional HTML formatting**  
✅ **All form data included**  
✅ **Clickable links** (LinkedIn, GitHub, Portfolio)  
✅ **Resume download link**  
✅ **Mobile-friendly design**  
✅ **Automatic triggering** on form submission  

## 🔒 Security

- Uses Gmail App Passwords (secure)
- No credentials stored in your code
- Firebase handles the server-side processing
