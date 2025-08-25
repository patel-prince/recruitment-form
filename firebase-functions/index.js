const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure email transporter (you'll need to set up environment variables)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

exports.sendFormSummaryEmail = functions.https.onCall(async (data, context) => {
  try {
    const { formData, recipientEmail } = data;

    // Format email content
    const emailContent = formatFormDataForEmail(formData);

    const mailOptions = {
      from: functions.config().email.user,
      to: recipientEmail,
      subject: 'Your Application Summary - Recruitment Form',
      text: emailContent,
      html: formatFormDataForHtml(formData)
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});

const formatFormDataForEmail = (formData) => {
  const formatDate = (date) => {
    if (!date) return 'Not specified';
    if (typeof date === 'string') return date;
    return 'Invalid date';
  };

  const formatArrayData = (data, title) => {
    if (!data || data.length === 0) return `${title}: Not specified\n`;
    
    let result = `${title}:\n`;
    data.forEach((item, index) => {
      result += `${index + 1}. `;
      Object.keys(item).forEach(key => {
        if (item[key]) {
          result += `${key}: ${item[key]}, `;
        }
      });
      result = result.slice(0, -2) + '\n';
    });
    return result + '\n';
  };

  return `
APPLICATION SUMMARY
==================

PERSONAL DETAILS
----------------
First Name: ${formData.personalDetails.firstName || 'Not specified'}
Last Name: ${formData.personalDetails.lastName || 'Not specified'}
Email: ${formData.personalDetails.email || 'Not specified'}
Phone: ${formData.personalDetails.phone || 'Not specified'}
Gender: ${formData.personalDetails.gender || 'Not specified'}
Date of Birth: ${formatDate(formData.personalDetails.dateOfBirth)}
City: ${formData.personalDetails.city || 'Not specified'}
State: ${formData.personalDetails.state || 'Not specified'}
Marital Status: ${formData.personalDetails.maritalStatus || 'Not specified'}
Nationality: ${formData.personalDetails.nationality || 'Not specified'}
Language: ${formData.personalDetails.language || 'Not specified'}
LinkedIn Profile: ${formData.personalDetails.linkedInProfile || 'Not specified'}

EDUCATION DETAILS
-----------------
${formatArrayData(formData.educationDetails, 'Education')}

WORK EXPERIENCE
---------------
${formatArrayData(formData.workExperience, 'Work Experience')}

SKILLS
-------
Technical Skills: ${formData.skills.technicalSkills || 'Not specified'}
Soft Skills: ${formData.skills.softSkills || 'Not specified'}

INTERESTS
---------
Hobbies & Interests: ${formData.otherDetails.interests || 'Not specified'}

PORTFOLIO
---------
GitHub Profile: ${formData.otherDetails.githubProfile || 'Not specified'}
Portfolio Website: ${formData.otherDetails.portfolioWebsite || 'Not specified'}
Projects: ${formData.otherDetails.projects || 'Not specified'}

REFERENCES
----------
${formatArrayData(formData.otherDetails.references, 'References')}

ADDITIONAL INFORMATION
---------------------
Resume File: ${formData.otherDetails.resumeFileName || 'Not specified'}
${formData.gapExplanation ? `Experience Gap Explanation: ${formData.gapExplanation}` : ''}

Submitted on: ${new Date().toLocaleString()}

Thank you for your application!
`;
};

const formatFormDataForHtml = (formData) => {
  // Similar to formatFormDataForEmail but with HTML formatting
  return `
    <h1>APPLICATION SUMMARY</h1>
    <h2>PERSONAL DETAILS</h2>
    <p><strong>First Name:</strong> ${formData.personalDetails.firstName || 'Not specified'}</p>
    <p><strong>Last Name:</strong> ${formData.personalDetails.lastName || 'Not specified'}</p>
    <p><strong>Email:</strong> ${formData.personalDetails.email || 'Not specified'}</p>
    <!-- Add more HTML formatted content -->
  `;
}; 