import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_p7qd2t8'; // Your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'template_0uj0too'; // Your EmailJS template ID
const EMAILJS_PUBLIC_KEY = 'OJcl90l_8FqxBvq6f'; // Your EmailJS public key

export interface EmailData {
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    city: string;
    state: string;
    maritalStatus: string;
    nationality: string;
    language: string;
    linkedInProfile: string;
  };
  educationDetails: Array<{
    school: string;
    degree: string;
    course: string;
    year: string;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    currentlyWorking: string;
    description: string;
  }>;
  skills: {
    technicalSkills: string;
    softSkills: string;
  };
  otherDetails: {
    interests: string;
    githubProfile: string;
    portfolioWebsite: string;
    projects: string;
    references: string[];
    resumeFileName: string;
    resumeUrl: string;
    cloudinaryData: any;
  };
  gapExplanation: string;
  timestamp: string;
}

// Function to format form data for email
function formatFormDataForEmail(formData: EmailData): string {
  const { personalDetails, educationDetails, workExperience, skills, otherDetails, gapExplanation } = formData;
  
  return `
NEW RECRUITMENT FORM SUBMISSION

Personal Details:
- Name: ${personalDetails.firstName} ${personalDetails.lastName}
- Email: ${personalDetails.email}
- Phone: ${personalDetails.phone}
- Gender: ${personalDetails.gender}
- Date of Birth: ${personalDetails.dateOfBirth}
- Location: ${personalDetails.city}, ${personalDetails.state}
- Marital Status: ${personalDetails.maritalStatus}
- Nationality: ${personalDetails.nationality}
- Language: ${personalDetails.language}
- LinkedIn: ${personalDetails.linkedInProfile}

Education Details:
${educationDetails.map((edu, index) => `
${index + 1}. School: ${edu.school}
   Degree: ${edu.degree}
   Course: ${edu.course}
   Year: ${edu.year}
`).join('')}

Work Experience:
${workExperience.map((work, index) => `
${index + 1}. Company: ${work.company}
   Position: ${work.position}
   Start Date: ${work.startDate}
   End Date: ${work.endDate}
   Currently Working: ${work.currentlyWorking}
   Description: ${work.description}
`).join('')}

Skills:
- Technical Skills: ${skills.technicalSkills}
- Soft Skills: ${skills.softSkills}

Other Details:
- Interests: ${otherDetails.interests}
- GitHub Profile: ${otherDetails.githubProfile}
- Portfolio Website: ${otherDetails.portfolioWebsite}
- Projects: ${otherDetails.projects}
- References: ${otherDetails.references.join(', ')}
- Resume: ${otherDetails.resumeUrl ? `Download Resume: ${otherDetails.resumeUrl}` : 'No resume uploaded'}

${gapExplanation ? `Experience Gap Explanation: ${gapExplanation}` : ''}

Submitted on: ${new Date(formData.timestamp).toLocaleString()}
  `;
}

// Function to send email using EmailJS
export const sendFormSubmissionEmail = async (formData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Prepare email parameters
    const emailParams = {
      to_email: 'quake.patel@gmail.com', // Your email where you want to receive notifications
      from_name: `${formData.personalDetails.firstName} ${formData.personalDetails.lastName}`,
      from_email: formData.personalDetails.email,
      subject: `New Recruitment Form Submission - ${formData.personalDetails.firstName} ${formData.personalDetails.lastName}`,
      message: formatFormDataForEmail(formData),
      reply_to: formData.personalDetails.email
    };

    // Send email
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailParams
    );

    console.log('Email sent successfully:', result);
    return {
      success: true,
      message: 'Email notification sent successfully!'
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Failed to send email notification'
    };
  }
};

// Alternative: Simple email using a webhook service (like Formspree, Netlify Forms, etc.)
export const sendEmailViaWebhook = async (formData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    const webhookUrl = 'https://formspree.io/f/YOUR_FORM_ID'; // Replace with your Formspree form ID
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${formData.personalDetails.firstName} ${formData.personalDetails.lastName}`,
        email: formData.personalDetails.email,
        phone: formData.personalDetails.phone,
        message: formatFormDataForEmail(formData),
        _subject: `New Recruitment Form Submission - ${formData.personalDetails.firstName} ${formData.personalDetails.lastName}`,
        _replyto: formData.personalDetails.email
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Email notification sent successfully!'
      };
    } else {
      throw new Error('Webhook request failed');
    }

  } catch (error) {
    console.error('Error sending email via webhook:', error);
    return {
      success: false,
      message: 'Failed to send email notification'
    };
  }
};
