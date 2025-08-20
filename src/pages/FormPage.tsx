import { Button, Form, Layout, Progress, Steps, message } from 'antd'
import { useState } from 'react'

import {
  EducationDetailsSection,
  InterestsSection,
  PersonalDetailsSection,
  PortfolioSection,
  ReferencesSection,
  SkillsSection,
  SummarySection,
  WorkExperienceSection
} from '../components/form-sections'

const { Step } = Steps

const FormPage = () => {
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    { title: 'Personal Details', key: 'personal' },
    { title: 'Education', key: 'education' },
    { title: 'Work Experience', key: 'work' },
    { title: 'Skills', key: 'skills' },
    { title: 'Interests', key: 'interests' },
    { title: 'Portfolio', key: 'portfolio' },
    { title: 'References', key: 'references' },
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
    // Allow navigation to completed steps or current step
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step)
    } else if (step < currentStep) {
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
      summary: [] // No validation needed for summary
    }
    return fieldMappings[stepKey] || []
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalDetailsSection />
      case 1:
        return <EducationDetailsSection />
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
        return <SummarySection key="summary" form={form} />
      default:
        return <PersonalDetailsSection />
    }
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      console.log('Form submitted:', values)
      message.success('Application submitted successfully!')
    } catch {
      message.error('Please complete all required fields.')
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
