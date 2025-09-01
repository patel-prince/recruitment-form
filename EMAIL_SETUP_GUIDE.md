# Email Setup Guide - Simple Solution

Since Firebase Functions require a paid plan, here's a simpler solution using EmailJS (free) that will work immediately.

## Option 1: EmailJS (Recommended - Free)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email

### Step 2: Set Up Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Connect your Gmail account
5. Copy the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

**Subject:** `New Recruitment Form - {{from_name}}`

**Content:**
```
Hello,

You have received a new recruitment form submission:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Message:
{{message}}

Best regards,
Recruitment System
```

4. Save the template and copy the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `user_abc123def456`)

### Step 5: Update Configuration
Open `src/services/emailService.ts` and replace these values:

```typescript
const EMAILJS_SERVICE_ID = 'your_service_id'; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'your_template_id'; // Replace with your Template ID  
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // Replace with your Public Key
```

### Step 6: Test It!
1. Submit your recruitment form
2. Check your email for the notification

---

## Option 2: Formspree (Alternative - Free)

### Step 1: Create Formspree Account
1. Go to [Formspree.io](https://formspree.io/)
2. Sign up for a free account
3. Create a new form

### Step 2: Get Form ID
1. Copy your form endpoint URL (e.g., `https://formspree.io/f/xpzgkqwe`)

### Step 3: Update Configuration
In `src/services/emailService.ts`, replace the webhook URL:

```typescript
const webhookUrl = 'https://formspree.io/f/YOUR_FORM_ID'; // Replace with your form URL
```

### Step 4: Use Webhook Method
In your form submission, use the webhook method instead:

```typescript
// In formService.ts, replace the email call with:
const emailResult = await sendEmailViaWebhook(formData as EmailData);
```

---

## Option 3: Simple SMTP (Advanced)

If you have your own email server, you can use the SMTP configuration in the email service.

---

## Testing

1. **Submit your form** - The form data will be saved to Firebase
2. **Check your email** - You should receive a notification
3. **Check browser console** - Look for any error messages

## Troubleshooting

**No email received?**
- Check browser console for errors
- Verify your EmailJS/Formspree configuration
- Make sure the service is properly connected

**Form not submitting?**
- Check Firebase configuration
- Verify Firestore rules allow writes

**Need help?**
- EmailJS documentation: https://www.emailjs.com/docs/
- Formspree documentation: https://formspree.io/guides/

## Benefits of This Solution

✅ **Free to use**  
✅ **No Firebase Functions needed**  
✅ **Works with free Firebase plan**  
✅ **Easy to set up**  
✅ **Reliable email delivery**  
✅ **Professional email templates**  

Your form will now automatically send email notifications whenever someone submits it!
