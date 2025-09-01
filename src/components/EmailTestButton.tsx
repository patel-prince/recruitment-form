import React from 'react';
import { Button, message } from 'antd';
import { sendFormSubmissionEmail } from '../services/emailService';

const EmailTestButton: React.FC = () => {
  const testEmail = async () => {
    try {
      // Create test data
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

      const result = await sendFormSubmissionEmail(testData);
      
      if (result.success) {
        message.success('Test email sent successfully! Check your inbox.');
      } else {
        message.error(`Email failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Test email error:', error);
      message.error('Test email failed. Check console for details.');
    }
  };

  return (
    <Button 
      type="primary" 
      onClick={testEmail}
      style={{ margin: '10px' }}
    >
      Test Email Function
    </Button>
  );
};

export default EmailTestButton;
