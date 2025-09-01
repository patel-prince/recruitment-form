// Email configuration
// Replace these values with your actual email service details

export const emailConfig = {
  // For Gmail (recommended for testing)
  service: 'gmail',
  auth: {
    user: 'quake.patel@gmail.com', // Replace with your Gmail address
    pass: '00quake09' // Replace with your Gmail App Password (not your regular password)
  }
  
  // Alternative: For other email services (Outlook, Yahoo, custom SMTP)
  // host: 'smtp.your-provider.com',
  // port: 587,
  // secure: false, // true for 465, false for other ports
  // auth: {
  //   user: 'your-email@domain.com',
  //   pass: 'your-password'
  // }
};

// Client email where form submissions will be sent
export const CLIENT_EMAIL = 'quake.patel@gmail.com'; // Replace with your client's email address

// Email templatesy
export const emailTemplates = {
  subject: (firstName: string, lastName: string) => 
    `New Recruitment Form Submission - ${firstName} ${lastName}`,
  
  // You can customize the email content here
  getGreeting: () => 'Hello!',
  getFooter: () => 'This is an automated notification from your recruitment form system.'
};
