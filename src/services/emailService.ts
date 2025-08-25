import emailjs from '@emailjs/browser'

export interface EmailData {
  to_email: string
  to_name: string
  from_name: string
  subject: string
  message: string
}

export const sendFormSummaryEmail = async (formData: any, recipientEmail: string) => {
  try {
    // Format the form data into a readable email
    const emailContent = formatFormDataForEmail(formData)
    
    const templateParams = {
      to_email: recipientEmail,
      to_name: `${formData.personalDetails.firstName} ${formData.personalDetails.lastName}`,
      from_name: 'Recruitment Form System',
      subject: 'Your Application Summary - Recruitment Form',
      message: emailContent
    }

    // You'll need to replace these with your actual EmailJS credentials
    const serviceId = 'YOUR_EMAILJS_SERVICE_ID'
    const templateId = 'YOUR_EMAILJS_TEMPLATE_ID'
    const publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'

    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    )

    return {
      success: true,
      message: 'Email sent successfully!',
      result
    }
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
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