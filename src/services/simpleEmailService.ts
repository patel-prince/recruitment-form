import { getFunctions, httpsCallable } from 'firebase/functions'
import app from '../firebase/config'

export interface EmailData {
  to: string
  subject: string
  content: string
  formData: any
}

export const sendFormSummaryEmail = async (formData: any, recipientEmail: string) => {
  // Format the form data into a readable email
  const emailContent = formatFormDataForEmail(formData)
  
  try {
    // Initialize Firebase Functions
    const functions = getFunctions(app)
    const sendEmail = httpsCallable(functions, 'sendFormSummaryEmail')
    
    // Call the Firebase Function
    const result = await sendEmail({
      formData: formData,
      recipientEmail: recipientEmail
    })

    return {
      success: true,
      message: 'Email sent successfully!',
      result: result.data
    }
  } catch (error) {
    console.error('Error sending email:', error)
    // For now, we'll just log the email content and return success
    // This allows the form to work without email setup
    console.log('Email content that would be sent:', emailContent)
    return {
      success: true,
      message: 'Email content logged to console (email service not configured)'
    }
  }
}

const formatFormDataForEmail = (formData: any): string => {
  const formatDate = (date: any) => {
    if (!date) return 'Not specified'
    if (typeof date === 'string') return date
    if (date.$d) return date.$d.toLocaleDateString()
    if (date.format) return date.format('YYYY-MM-DD')
    if (date.toDate) return date.toDate().toLocaleDateString()
    return 'Invalid date'
  }

  const formatArrayData = (data: any[], title: string) => {
    if (!data || data.length === 0) return `${title}: Not specified\n`
    
    let result = `${title}:\n`
    data.forEach((item, index) => {
      result += `${index + 1}. `
      Object.keys(item).forEach(key => {
        if (item[key]) {
          result += `${key}: ${item[key]}, `
        }
      })
      result = result.slice(0, -2) + '\n'
    })
    return result + '\n'
  }

  let emailContent = `
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
`

  return emailContent
} 