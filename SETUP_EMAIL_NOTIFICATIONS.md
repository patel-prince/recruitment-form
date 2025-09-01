# Email Notifications Setup Guide

This guide will help you set up email notifications for your recruitment form using Firebase Cloud Functions.

## Prerequisites

1. Firebase CLI installed: `npm install -g firebase-tools`
2. Your Firebase project set up
3. An email account (Gmail recommended for testing)

## Step 1: Configure Email Settings

### For Gmail (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update the configuration** in `functions/src/config.ts`:
   ```typescript
   export const emailConfig = {
     service: 'gmail',
     auth: {
       user: 'your-actual-email@gmail.com', // Your Gmail address
       pass: 'your-16-character-app-password' // The app password you generated
     }
   };

   export const CLIENT_EMAIL = 'client@example.com'; // Where to send notifications
   ```

### For Other Email Services

Update `functions/src/config.ts` with your SMTP settings:

```typescript
export const emailConfig = {
  host: 'smtp.your-provider.com', // e.g., smtp.outlook.com
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@domain.com',
    pass: 'your-password'
  }
};
```

## Step 2: Deploy Firebase Functions

1. **Install dependencies**:
   ```bash
   cd functions
   npm install
   ```

2. **Login to Firebase** (if not already logged in):
   ```bash
   firebase login
   ```

3. **Initialize Firebase Functions** (if not already done):
   ```bash
   firebase init functions
   ```

4. **Deploy the functions**:
   ```bash
   firebase deploy --only functions
   ```

## Step 3: Test the Setup

### Option 1: Test with a real form submission
1. Fill out and submit your recruitment form
2. Check the client email for the notification

### Option 2: Test with the test endpoint
1. After deployment, you'll get a URL like: `https://us-central1-your-project.cloudfunctions.net/sendTestEmail`
2. Visit this URL in your browser to send a test email

## Step 4: Monitor Function Logs

To see if emails are being sent successfully:

```bash
firebase functions:log
```

## Troubleshooting

### Common Issues

1. **"Invalid login" error**:
   - Make sure you're using an App Password for Gmail, not your regular password
   - Ensure 2FA is enabled on your Gmail account

2. **"Function not found" error**:
   - Make sure you've deployed the functions: `firebase deploy --only functions`
   - Check that your Firebase project is correctly configured

3. **Emails not being sent**:
   - Check the Firebase Functions logs: `firebase functions:log`
   - Verify your email configuration in `functions/src/config.ts`
   - Make sure the CLIENT_EMAIL is correct

### Email Service Providers

| Provider | SMTP Settings |
|----------|---------------|
| Gmail | service: 'gmail' |
| Outlook | host: 'smtp-mail.outlook.com', port: 587 |
| Yahoo | host: 'smtp.mail.yahoo.com', port: 587 |
| Custom | Use your provider's SMTP settings |

## Security Notes

- Never commit your email credentials to version control
- Use environment variables for production:
  ```typescript
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
  ```
- Consider using Firebase's built-in email service for production

## Customization

You can customize the email template by editing the `formatFormDataToHTML` function in `functions/src/index.ts`. The current template includes:

- Professional HTML formatting
- All form fields organized in sections
- Clickable links for LinkedIn, GitHub, and portfolio
- Resume download link
- Responsive design

## Cost Considerations

- Firebase Functions have a free tier (2M invocations/month)
- Email sending is free with most email providers
- Monitor your usage in the Firebase Console
