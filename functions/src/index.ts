import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
const { emailConfig, CLIENT_EMAIL } = require('./config');

// Initialize Firebase Admin
admin.initializeApp();

// Create email transporter
const transporter = nodemailer.createTransport(emailConfig);

// Function to format form data into HTML email
function formatFormDataToHTML(formData: any): string {
  const { personalDetails, educationDetails, workExperience, skills, otherDetails, gapExplanation } = formData;
  
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .section { margin-bottom: 25px; padding: 15px; border-left: 4px solid #007bff; background-color: #f9f9f9; }
          .section h3 { margin-top: 0; color: #007bff; }
          .field { margin-bottom: 10px; }
          .field strong { display: inline-block; width: 150px; }
          .resume-link { color: #007bff; text-decoration: none; }
          .resume-link:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>New Recruitment Form Submission</h2>
          <p><strong>Submitted on:</strong> ${new Date(formData.timestamp).toLocaleString()}</p>
        </div>

        <div class="section">
          <h3>Personal Details</h3>
          <div class="field"><strong>Name:</strong> ${personalDetails.firstName} ${personalDetails.lastName}</div>
          <div class="field"><strong>Email:</strong> ${personalDetails.email}</div>
          <div class="field"><strong>Phone:</strong> ${personalDetails.phone}</div>
          <div class="field"><strong>Gender:</strong> ${personalDetails.gender}</div>
          <div class="field"><strong>Date of Birth:</strong> ${personalDetails.dateOfBirth}</div>
          <div class="field"><strong>Location:</strong> ${personalDetails.city}, ${personalDetails.state}</div>
          <div class="field"><strong>Marital Status:</strong> ${personalDetails.maritalStatus}</div>
          <div class="field"><strong>Nationality:</strong> ${personalDetails.nationality}</div>
          <div class="field"><strong>Language:</strong> ${personalDetails.language}</div>
          <div class="field"><strong>LinkedIn:</strong> <a href="${personalDetails.linkedInProfile}" target="_blank">${personalDetails.linkedInProfile}</a></div>
        </div>

        <div class="section">
          <h3>Education Details</h3>
          ${educationDetails.map((edu: any, index: number) => `
            <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 3px;">
              <div class="field"><strong>School:</strong> ${edu.school}</div>
              <div class="field"><strong>Degree:</strong> ${edu.degree}</div>
              <div class="field"><strong>Course:</strong> ${edu.course}</div>
              <div class="field"><strong>Year:</strong> ${edu.year}</div>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h3>Work Experience</h3>
          ${workExperience.map((work: any, index: number) => `
            <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 3px;">
              <div class="field"><strong>Company:</strong> ${work.company}</div>
              <div class="field"><strong>Position:</strong> ${work.position}</div>
              <div class="field"><strong>Start Date:</strong> ${work.startDate}</div>
              <div class="field"><strong>End Date:</strong> ${work.endDate}</div>
              <div class="field"><strong>Currently Working:</strong> ${work.currentlyWorking}</div>
              <div class="field"><strong>Description:</strong> ${work.description}</div>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h3>Skills</h3>
          <div class="field"><strong>Technical Skills:</strong> ${skills.technicalSkills}</div>
          <div class="field"><strong>Soft Skills:</strong> ${skills.softSkills}</div>
        </div>

        <div class="section">
          <h3>Other Details</h3>
          <div class="field"><strong>Interests:</strong> ${otherDetails.interests}</div>
          <div class="field"><strong>GitHub Profile:</strong> <a href="${otherDetails.githubProfile}" target="_blank">${otherDetails.githubProfile}</a></div>
          <div class="field"><strong>Portfolio Website:</strong> <a href="${otherDetails.portfolioWebsite}" target="_blank">${otherDetails.portfolioWebsite}</a></div>
          <div class="field"><strong>Projects:</strong> ${otherDetails.projects}</div>
          <div class="field"><strong>References:</strong> ${otherDetails.references.join(', ')}</div>
          ${otherDetails.resumeUrl ? `<div class="field"><strong>Resume:</strong> <a href="${otherDetails.resumeUrl}" class="resume-link" target="_blank">Download Resume (${otherDetails.resumeFileName})</a></div>` : ''}
        </div>

        ${gapExplanation ? `
        <div class="section">
          <h3>Experience Gap Explanation</h3>
          <p>${gapExplanation}</p>
        </div>
        ` : ''}
      </body>
    </html>
  `;
}

// Cloud Function triggered when a new document is added to recruitment-submissions
export const sendFormSubmissionEmail = functions.firestore
  .document('recruitment-submissions/{submissionId}')
  .onCreate(async (snap, context) => {
    try {
      const formData = snap.data();
      const submissionId = context.params.submissionId;

      console.log('New form submission received:', submissionId);

      // Format the form data into HTML
      const htmlContent = formatFormDataToHTML(formData);

      // Email options
      const mailOptions = {
        from: emailConfig.auth.user,
        to: CLIENT_EMAIL,
        subject: `New Recruitment Form Submission - ${formData.personalDetails.firstName} ${formData.personalDetails.lastName}`,
        html: htmlContent,
        // Optional: Add a text version
        text: `
          New Recruitment Form Submission
          
          Name: ${formData.personalDetails.firstName} ${formData.personalDetails.lastName}
          Email: ${formData.personalDetails.email}
          Phone: ${formData.personalDetails.phone}
          
          Please check the full details in the HTML version of this email.
          
          Resume: ${formData.otherDetails.resumeUrl || 'No resume uploaded'}
        `
      };

      // Send email
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);

      return null;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new functions.https.HttpsError('internal', 'Failed to send email notification');
    }
  });

// Optional: HTTP function to manually trigger email (for testing)
export const sendTestEmail = functions.https.onRequest(async (req, res) => {
  try {
    const testData = {
      timestamp: new Date().toISOString(),
      personalDetails: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+1234567890',
        gender: 'Male',
        dateOfBirth: '1990-01-01',
        city: 'Test City',
        state: 'Test State',
        maritalStatus: 'Single',
        nationality: 'Test',
        language: 'English',
        linkedInProfile: 'https://linkedin.com/in/test'
      },
      educationDetails: [{
        school: 'Test University',
        degree: 'Bachelor\'s',
        course: 'Computer Science',
        year: '2012'
      }],
      workExperience: [{
        company: 'Test Company',
        position: 'Test Position',
        startDate: '2020-01-01',
        endDate: '2023-12-31',
        currentlyWorking: 'No',
        description: 'Test description'
      }],
      skills: {
        technicalSkills: 'React, Node.js',
        softSkills: 'Communication, Teamwork'
      },
      otherDetails: {
        interests: 'Reading, Programming',
        githubProfile: 'https://github.com/test',
        portfolioWebsite: 'https://test.com',
        projects: 'Test projects',
        references: ['Reference 1', 'Reference 2'],
        resumeFileName: 'test-resume.pdf',
        resumeUrl: 'https://example.com/resume.pdf',
        cloudinaryData: null
      },
      gapExplanation: 'Test gap explanation'
    };

    const htmlContent = formatFormDataToHTML(testData);
    
    const mailOptions = {
      from: emailConfig.auth.user,
      to: CLIENT_EMAIL,
      subject: 'Test Email - Recruitment Form',
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', result.messageId);

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
