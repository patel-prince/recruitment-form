import { Button, Form, Layout, Progress, Steps, message } from 'antd'
import { useState } from 'react'

import { submitFormToFirebase } from '../firebase/formService'
import type { FormSubmissionData } from '../firebase/formService'

import {
  EducationDetailsSection,
  InterestsSection,
  PersonalDetailsSection,
  PortfolioSection,
  ReferencesSection,
  ResumeUploadSection,
  SkillsSection,
  SummarySection,
  WorkExperienceSection
} from '../components/form-sections'

// Type definitions for form data
interface DateObject {
  format: (format: string) => string
}

interface FormValues {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  gender?: string
  dateOfBirth?: DateObject
  city?: string
  state?: string
  maritalStatus?: string
  nationality?: string
  language?: string
  linkedInProfile?: string
  educationDetails?: Array<{
    school?: string
    degree?: string
    course?: string
    year?: DateObject
  }>
  workExperience?: Array<{
    company?: string
    position?: string
    startDate?: DateObject
    endDate?: DateObject
    currentlyWorking?: boolean
    description?: string
  }>
  technicalSkills?: string
  softSkills?: string
  interests?: string
  githubProfile?: string
  portfolioWebsite?: string
  projects?: string
  references?: string[]
  resume?: File
}

const { Step } = Steps

const FormPage = () => {
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [gapExplanation, setGapExplanation] = useState('')

  const steps = [
    { title: 'Personal Details', key: 'personal' },
    { title: 'Education', key: 'education' },
    { title: 'Work Experience', key: 'work' },
    { title: 'Skills', key: 'skills' },
    { title: 'Interests', key: 'interests' },
    { title: 'Portfolio', key: 'portfolio' },
    { title: 'References', key: 'references' },
    { title: 'Resume Upload', key: 'resume' },
    { title: 'Summary', key: 'summary' }
  ]

  const calculateProgress = () => {
    return Math.round(
      ((completedSteps.length + (currentStep > 0 ? 1 : 0)) / steps.length) * 100
    )
  }

  const handleNext = async () => {
    try {
      // Validate current step
      const currentStepKey = steps[currentStep].key
      await form.validateFields(getStepFields(currentStepKey))

      // Additional validation for work experience section
      if (currentStepKey === 'work') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validateWorkExp = (form as any).validateWorkExperienceSection
        if (validateWorkExp && !validateWorkExp()) {
          message.error(
            'Please fix all validation errors in Work Experience before proceeding.'
          )
          return
        }
      }

      // Additional validation for education section
      if (currentStepKey === 'education') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validateEducation = (form as any).validateEducationSection
        if (validateEducation && !validateEducation()) {
          message.error(
            'Please fix all validation errors in Education before proceeding.'
          )
          return
        }
      }

      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }

      // Move to next step
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
        message.success(`${steps[currentStep].title} completed!`)
      }
    } catch {
      message.error('Please fill in all required fields before proceeding.')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (step: number) => {
    if (completedSteps.includes(step) || step <= currentStep) {
      setCurrentStep(step)
    }
  }

  const getStepFields = (stepKey: string) => {
    const fieldMappings: { [key: string]: string[] } = {
      personal: [
        'firstName',
        'lastName',
        'email',
        'phone',
        'gender',
        'dateOfBirth',
        'city',
        'state',
        'maritalStatus',
        'nationality',
        'language'
      ],
      education: ['educationDetails'],
      work: ['workExperience'],
      skills: ['technicalSkills', 'softSkills'],
      interests: ['interests'],
      portfolio: ['githubProfile', 'portfolioWebsite', 'projects'],
      references: ['references'],
      resume: ['resume'],
      summary: [] // No validation needed for summary
    }
    return fieldMappings[stepKey] || []
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalDetailsSection />
      case 1:
        return <EducationDetailsSection form={form} />
      case 2:
        return <WorkExperienceSection form={form} />
      case 3:
        return <SkillsSection />
      case 4:
        return <InterestsSection />
      case 5:
        return <PortfolioSection />
      case 6:
        return <ReferencesSection />
      case 7:
        return <ResumeUploadSection form={form} />
      case 8:
        return (
          <SummarySection
            key="summary"
            form={form}
            gapExplanation={gapExplanation}
            onGapExplanationChange={setGapExplanation}
          />
        )
      default:
        return <PersonalDetailsSection />
    }
  }

  const detectExperienceGaps = (workExperience: FormValues['workExperience']) => {
    if (!workExperience || workExperience.length === 0) return []

    const gaps: Array<{ start: string; end: string; duration: string }> = []
    const sortedExperience = [...workExperience].sort((a, b) => {
      const startDateA = a.startDate ? a.startDate.format('YYYY-MM-DD') : ''
      const startDateB = b.startDate ? b.startDate.format('YYYY-MM-DD') : ''
      return startDateA.localeCompare(startDateB)
    })

    let previousEndDate: string | null = null

    sortedExperience.forEach((job) => {
      const startDate = job.startDate ? job.startDate.format('YYYY-MM-DD') : ''
      const endDate = job.currentlyWorking
        ? new Date().toISOString().split('T')[0]
        : job.endDate
          ? job.endDate.format('YYYY-MM-DD')
          : ''

      if (startDate && endDate && previousEndDate && startDate > previousEndDate) {
        const gapStart = new Date(previousEndDate)
        const gapEnd = new Date(startDate)
        const gapDays = Math.ceil(
          (gapEnd.getTime() - gapStart.getTime()) / (1000 * 60 * 60 * 24)
        )

        let duration = ''
        if (gapDays >= 365) {
          duration = `${(gapDays / 365.25).toFixed(1)} years`
        } else if (gapDays >= 30) {
          duration = `${Math.round(gapDays / 30.44)} months`
        } else {
          duration = `${gapDays} days`
        }

        gaps.push({
          start: previousEndDate,
          end: startDate,
          duration
        })
      }

      if (endDate) {
        previousEndDate = endDate
      }
    })

    return gaps
  }

  const getAllFormValues = () => {
    try {
      const allFields = form.getFieldsValue(true)
      console.log('All fields from getFieldsValue:', allFields)
      
      // Get specific field arrays that might not be captured properly
      const educationDetails = form.getFieldValue('educationDetails') || []
      const workExperience = form.getFieldValue('workExperience') || []
      
      // Get string fields that might be undefined
      const technicalSkills = form.getFieldValue('technicalSkills') || allFields.technicalSkills || ''
      const softSkills = form.getFieldValue('softSkills') || allFields.softSkills || ''
      const interests = form.getFieldValue('interests') || allFields.interests || ''
      const projects = form.getFieldValue('projects') || allFields.projects || ''
      const references = form.getFieldValue('references') || allFields.references || []
      
      // Debug: Log individual field values
      console.log('Individual field values:')
      console.log('technicalSkills:', technicalSkills)
      console.log('softSkills:', softSkills)
      console.log('interests:', interests)
      console.log('projects:', projects)
      console.log('references:', references)
      
      return {
        ...allFields,
        educationDetails,
        workExperience,
        technicalSkills,
        softSkills,
        interests,
        projects,
        references
      }
    } catch (error) {
      console.error('Error getting form values:', error)
      return {}
    }
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      
      // Get all form values with better error handling
      const values = getAllFormValues() as FormValues
      
      // Debug: Log the raw form values
      console.log('Raw form values:', values)

      // Check for experience gaps
      const gaps = detectExperienceGaps(values.workExperience)

      if (gaps.length > 0 && !gapExplanation) {
        message.warning(
          'Please provide an explanation for the experience gaps in the Summary section before submitting.'
        )
        return
      }

      // Show loading message
      const loadingMessage = message.loading('Submitting your application...', 0)

      // Prepare data for Firebase with better data extraction
      const formData: FormSubmissionData = {
        timestamp: new Date().toISOString(),
        personalDetails: {
          firstName: values.firstName || '',
          lastName: values.lastName || '',
          email: values.email || '',
          phone: values.phone || '',
          gender: values.gender || '',
          dateOfBirth: values.dateOfBirth ? 
            (typeof values.dateOfBirth === 'object' && values.dateOfBirth.format ? 
              values.dateOfBirth.format('YYYY-MM-DD') : 
              String(values.dateOfBirth)) : '',
          city: values.city || '',
          state: values.state || '',
          maritalStatus: values.maritalStatus || '',
          nationality: values.nationality || '',
          language: values.language || '',
          linkedInProfile: values.linkedInProfile || ''
        },
        educationDetails: (values.educationDetails || []).map((edu) => ({
          school: edu?.school || '',
          degree: edu?.degree || '',
          course: edu?.course || '',
          year: edu?.year ? 
            (typeof edu.year === 'object' && edu.year.format ? 
              edu.year.format('YYYY') : 
              String(edu.year)) : ''
        })),
        workExperience: (values.workExperience || []).map((work) => ({
          company: work?.company || '',
          position: work?.position || '',
          startDate: work?.startDate ? 
            (typeof work.startDate === 'object' && work.startDate.format ? 
              work.startDate.format('YYYY-MM-DD') : 
              String(work.startDate)) : '',
          endDate: work?.endDate ? 
            (typeof work.endDate === 'object' && work.endDate.format ? 
              work.endDate.format('YYYY-MM-DD') : 
              String(work.endDate)) : '',
          currentlyWorking: work?.currentlyWorking ? 'Yes' : 'No',
          description: work?.description || ''
        })),
        skills: {
          technicalSkills: values.technicalSkills || '',
          softSkills: values.softSkills || ''
        },
        otherDetails: {
          interests: values.interests || '',
          githubProfile: values.githubProfile || '',
          portfolioWebsite: values.portfolioWebsite || '',
          projects: values.projects || '',
          references: values.references ? 
            (Array.isArray(values.references) ? values.references : [values.references]) : [],
          resumeFileName: values.resume ? 
            (typeof values.resume === 'object' && values.resume.name ? 
              values.resume.name : 
              String(values.resume)) : ''
        },
        gapExplanation: gapExplanation || ''
      }

      // Debug: Log the processed form data
      console.log('Processed form data for Firebase:', formData)

      // Submit to Firebase
      const result = await submitFormToFirebase(formData)

      // Close loading message
      loadingMessage()

      message.success(
        `Application submitted successfully! Document ID: ${result.documentId}`
      )

      // Reset form and gap-related state
      setTimeout(() => {
        form.resetFields()
        setCurrentStep(0)
        setCompletedSteps([])
        setGapExplanation('')
      }, 2000)
    } catch (error) {
      console.error('Submission error:', error)
      message.error('Failed to submit application. Please try again.')
    }
  }

  return (
    <Layout>
      <Layout.Content className="min-h-full" style={{ padding: '24px' }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '24px' }}>
          <Progress
            percent={calculateProgress()}
            status="active"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068'
            }}
          />
          <div
            style={{
              textAlign: 'center',
              marginTop: '8px',
              fontSize: '14px',
              color: '#666'
            }}
          >
            Step {currentStep + 1} of {steps.length} - {steps[currentStep].title}
          </div>
        </div>

        {/* Steps Navigation */}
        <div style={{ marginBottom: '32px' }}>
          <Steps
            current={currentStep}
            onChange={handleStepClick}
            responsive={true}
            size="small"
          >
            {steps.map((step, index) => (
              <Step
                key={step.key}
                title={step.title}
                status={
                  completedSteps.includes(index)
                    ? 'finish'
                    : index === currentStep
                      ? 'process'
                      : 'wait'
                }
              />
            ))}
          </Steps>
        </div>

        {/* Form Content */}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #f0f0f0'
            }}
          >
            {currentStep > 0 && (
              <Button size="large" onClick={handlePrevious} style={{ minWidth: '120px' }}>
                Previous
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                type="primary"
                size="large"
                onClick={handleNext}
                style={{ minWidth: '120px' }}
              >
                Save & Next
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                style={{ minWidth: '120px' }}
              >
                Submit Application
              </Button>
            )}

            <Button
              type="default"
              size="large"
              onClick={() => form.resetFields()}
              style={{ minWidth: '120px' }}
            >
              Reset Form
            </Button>
          </div>
        </Form>
      </Layout.Content>
    </Layout>
  )
}

export default FormPage
