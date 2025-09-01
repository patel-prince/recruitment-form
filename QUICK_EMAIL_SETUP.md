# Quick Email Setup - Step by Step

## Why you're not receiving emails:
The email service is configured but needs your EmailJS credentials. Currently it's using placeholder values.

## 🚀 Quick Setup (5 minutes):

### Step 1: Create EmailJS Account
1. Go to **https://www.emailjs.com/**
2. Click **"Sign Up"** (it's free)
3. Use your Gmail: `quake.patel@gmail.com`
4. Verify your email

### Step 2: Add Gmail Service
1. In EmailJS dashboard, click **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"**
4. Click **"Connect Account"**
5. Sign in with your Gmail account
6. **Copy the Service ID** (looks like: `service_abc123`)

### Step 3: Create Email Template
1. Click **"Email Templates"**
2. Click **"Create New Template"**
3. **Subject:** `New Recruitment Form - {{from_name}}`
4. **Content:** Copy this exactly:

```
Hello,

You have received a new recruitment form submission:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Full Details:
{{message}}

Best regards,
Recruitment System
```

5. Click **"Save"**
6. **Copy the Template ID** (looks like: `template_xyz789`)

### Step 4: Get Public Key
1. Click **"Account"** → **"General"**
2. **Copy your Public Key** (looks like: `user_abc123def456`)

### Step 5: Update Your Code
Open `src/services/emailService.ts` and replace these 3 lines:

```typescript
const EMAILJS_SERVICE_ID = 'service_abc123'; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789'; // Replace with your Template ID  
const EMAILJS_PUBLIC_KEY = 'user_abc123def456'; // Replace with your Public Key
```

### Step 6: Test It!
1. Save the file
2. Submit your recruitment form
3. Check your email!

## 🔧 Alternative: Use Formspree (Even Easier)

If EmailJS seems complicated, try Formspree:

### Step 1: Go to Formspree
1. Visit **https://formspree.io/**
2. Sign up with your Gmail
3. Create a new form
4. **Copy the form URL** (looks like: `https://formspree.io/f/xpzgkqwe`)

### Step 2: Update Code
In `src/services/emailService.ts`, find this line:
```typescript
const webhookUrl = 'https://formspree.io/f/YOUR_FORM_ID';
```
Replace `YOUR_FORM_ID` with your actual form ID.

### Step 3: Use Webhook Method
In `src/firebase/formService.ts`, change this line:
```typescript
// Change from:
const emailResult = await sendFormSubmissionEmail(formData as EmailData);

// To:
const emailResult = await sendEmailViaWebhook(formData as EmailData);
```

## 🎯 Which option should you choose?

- **EmailJS**: More customizable, professional templates
- **Formspree**: Simpler setup, works immediately

Both are free and will work with your current setup!

## 🆘 Still having issues?

1. Check browser console for errors (F12 → Console)
2. Make sure you copied the IDs correctly
3. Try the Formspree option if EmailJS doesn't work

Your form is ready - it just needs the email service credentials!
