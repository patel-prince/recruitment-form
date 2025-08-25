# Email Setup Guide for Recruitment Form

This guide explains how to set up email functionality to send form summaries to users.

## 🚀 Email Functionality Overview

The recruitment form now includes email functionality that sends a complete summary of the submitted application to the user's email address.

## 📧 Setup Options

### Option 1: Firebase Functions (Recommended)

#### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Initialize Firebase Functions
```bash
cd firebase-functions
npm install
```

#### 3. Configure Email Credentials
Set up your Gmail credentials in Firebase Functions:

```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.pass="your-app-password"
```

**Note:** Use an App Password, not your regular Gmail password.

#### 4. Deploy Firebase Functions
```bash
firebase deploy --only functions
```

#### 5. Update Email Service
The email service is already configured to use Firebase Functions. No additional changes needed.

### Option 2: EmailJS (Alternative)

#### 1. Sign up for EmailJS
- Go to [EmailJS](https://www.emailjs.com/)
- Create an account and verify your email

#### 2. Create Email Service
- Add Gmail as your email service
- Configure with your Gmail credentials

#### 3. Create Email Template
Create a template with these variables:
- `to_email`
- `to_name`
- `message`
- `subject`

#### 4. Update Email Service
Replace the Firebase Functions code in `src/services/simpleEmailService.ts` with:

```typescript
import emailjs from '@emailjs/browser'

export const sendFormSummaryEmail = async (formData: any, recipientEmail: string) => {
  try {
    const emailContent = formatFormDataForEmail(formData)
    
    const result = await emailjs.send(
      'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
      'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
      {
        to_email: recipientEmail,
        to_name: `${formData.personalDetails.firstName} ${formData.personalDetails.lastName}`,
        message: emailContent,
        subject: 'Your Application Summary - Recruitment Form'
      },
      'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
    )

    return {
      success: true,
      message: 'Email sent successfully!'
    }
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
}
```

## 📋 Email Content

The email includes a comprehensive summary of all form data:

### Personal Details
- First Name, Last Name
- Email, Phone
- Gender, Date of Birth
- City, State, Marital Status
- Nationality, Language
- LinkedIn Profile

### Education Details
- School, Degree, Course, Year
- Multiple education entries supported

### Work Experience
- Company, Position
- Start Date, End Date
- Currently Working status
- Job Description

### Skills & Interests
- Technical Skills
- Soft Skills
- Hobbies & Interests

### Portfolio
- GitHub Profile
- Portfolio Website
- Projects

### References
- Multiple reference entries

### Additional Information
- Resume File Name
- Experience Gap Explanation (if provided)
- Submission Timestamp

## 🔧 Testing

### 1. Test Email Functionality
1. Fill out the form completely
2. Submit the form
3. Check the browser console for email content
4. Verify email is received at the provided email address

### 2. Debug Email Issues
- Check browser console for error messages
- Verify email service configuration
- Test with different email addresses

## 📝 Email Template Example

The email is formatted as plain text with clear sections:

```
APPLICATION SUMMARY
==================

PERSONAL DETAILS
----------------
First Name: John
Last Name: Doe
Email: john.doe@example.com
...

EDUCATION DETAILS
-----------------
1. school: University of Technology, degree: Bachelor's, course: Computer Science, year: 2023

WORK EXPERIENCE
---------------
1. company: Tech Corp, position: Developer, startDate: 2023-01-01, endDate: 2024-01-01, currentlyWorking: No, description: Full-stack development

...
```

## 🛠️ Troubleshooting

### Common Issues

1. **Email not sending**
   - Check Firebase Functions logs
   - Verify email credentials
   - Check CORS settings

2. **Email content missing**
   - Verify form data is being captured
   - Check email template variables

3. **Firebase Functions deployment fails**
   - Check Node.js version (requires 18+)
   - Verify all dependencies installed
   - Check Firebase project configuration

### Support

For issues with:
- **Firebase Functions**: Check Firebase console logs
- **EmailJS**: Check EmailJS dashboard
- **Form Data**: Check browser console logs

## 🎯 Next Steps

1. **Deploy Firebase Functions** (if using Option 1)
2. **Test email functionality** with real form submissions
3. **Customize email template** as needed
4. **Monitor email delivery** and user feedback 