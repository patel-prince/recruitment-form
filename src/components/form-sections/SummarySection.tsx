import { Descriptions, Divider, Input, Typography } from 'antd'
import { useEffect, useState } from 'react'

const { Title, Text } = Typography

interface SummarySectionProps {
  form: any
  gapExplanation?: string
  onGapExplanationChange?: (explanation: string) => void
}

const SummarySection = ({
  form,
  gapExplanation = '',
  onGapExplanationChange
}: SummarySectionProps) => {
  const [formData, setFormData] = useState<any>({})

  // Function to get all form values
  const getAllFormValues = () => {
    try {
      // Get all form fields
      const allFields = form.getFieldsValue(true) // true to get all fields including nested ones
  

      return allFields
    } catch (error) {
      console.error('Error getting form values:', error)
      return {}
    }
  }

  useEffect(() => {
    // Update form data immediately
    const updateData = () => {
      const values = getAllFormValues()
      setFormData(values)
    }

    updateData()

    // Set up interval to check for changes
    const interval = setInterval(updateData, 1000)

    // Also listen for form field changes
    const handleFormChange = () => {
      setTimeout(updateData, 100) // Small delay to ensure form is updated
    }

    // Add event listener for form changes
    document.addEventListener('input', handleFormChange)
    document.addEventListener('change', handleFormChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('input', handleFormChange)
      document.removeEventListener('change', handleFormChange)
    }
  }, [form])

  const formatDate = (date: any) => {
    if (!date) return 'Not specified'
    if (typeof date === 'string') return date
    if (date.$d) return date.$d.toLocaleDateString()
    if (date.format) return date.format('YYYY-MM-DD')
    if (date.toDate) return date.toDate().toLocaleDateString()
    return 'Invalid date'
  }

  const calculateExperience = (workExperience: any[]) => {
    let totalYears = 0
    const gaps: { start: any; end: any; duration: string }[] = []

    if (!workExperience || workExperience.length === 0) {
      return { totalYears: 0, gaps: [] }
    }

    // Sort work experience by start date
    const sortedExperience = [...workExperience].sort((a, b) => {
      const startDateA = a.startDate ? a.startDate.$d || a.startDate.toDate() : null
      const startDateB = b.startDate ? b.startDate.$d || b.startDate.toDate() : null
      if (!startDateA || !startDateB) return 0
      return startDateA.getTime() - startDateB.getTime()
    })

    let previousEndDate: Date | null = null

    sortedExperience.forEach((job) => {
      const startDate = job.startDate ? job.startDate.$d || job.startDate.toDate() : null
      const endDate = job.currentlyWorking
        ? new Date()
        : job.endDate
          ? job.endDate.$d || job.endDate.toDate()
          : null

      if (startDate && endDate) {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        totalYears += diffDays / 365.25 // Account for leap years

        // Calculate gap with previous job
        if (
          previousEndDate &&
          startDate &&
          startDate.getTime() > previousEndDate.getTime()
        ) {
          const gapTime = Math.abs(startDate.getTime() - previousEndDate.getTime())
          const gapDays = Math.ceil(gapTime / (1000 * 60 * 60 * 24))
          let duration = ''
          if (gapDays >= 365) {
            duration = `${(gapDays / 365.25).toFixed(1)} years`
          } else if (gapDays >= 30) {
            duration = `${Math.round(gapDays / 30.44)} months`
          } else {
            duration = `${gapDays} days`
          }
          gaps.push({
            start: previousEndDate.toLocaleDateString(),
            end: startDate.toLocaleDateString(),
            duration: duration
          })
        }
      }
      if (endDate) {
        previousEndDate = endDate
      }
    })

    return { totalYears: totalYears.toFixed(1), gaps }
  }

  const formatArrayData = (data: any[], title: string) => {
    if (!data || data.length === 0) return null

    return (
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '16px', color: '#1890ff' }}>
          {title}
        </Title>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px',
              backgroundColor: '#fafafa'
            }}
          >
            <Descriptions column={1} size="small">
              {Object.entries(item).map(([key, value]) => {
                if (value === null || value === undefined || value === '') return null
                return (
                  <Descriptions.Item
                    key={key}
                    label={
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, ' $1')
                    }
                  >
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                  </Descriptions.Item>
                )
              })}
            </Descriptions>
          </div>
        ))}
      </div>
    )
  }

  const { totalYears, gaps } = calculateExperience(formData.workExperience)

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <Title
        level={2}
        style={{ textAlign: 'center', marginBottom: '32px', color: '#1890ff' }}
      >
        Application Summary
      </Title>

      {/* Personal Details */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ marginBottom: '16px', color: '#1890ff' }}>
          Personal Details
        </Title>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="First Name">
            {formData.firstName || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Middle Name">
            {formData.middleName || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {formData.lastName || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {formData.email || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {formData.phone || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {formData.gender || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {formatDate(formData.dateOfBirth)}
          </Descriptions.Item>
          <Descriptions.Item label="City">
            {formData.city || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="State">
            {formData.state || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Marital Status">
            {formData.maritalStatus || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Nationality">
            {formData.nationality || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Language">
            {formData.language || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="LinkedIn Profile" span={2}>
            {formData.linkedInProfile || 'Not specified'}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Divider />

      {/* Education Details */}
      {formatArrayData(formData.educationDetails, 'Education Details')}

      <Divider />

      {/* Work Experience */}
      {formatArrayData(formData.workExperience, 'Work Experience')}

      {/* Experience Summary */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '16px', color: '#52c41a' }}>
          Experience Summary
        </Title>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Total Years of Experience">
            {totalYears} years
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* Experience Gaps */}
      {gaps.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ marginBottom: '16px', color: '#faad14' }}>
            Experience Gaps Identified
          </Title>
          <Descriptions column={1} bordered size="small">
            {gaps.map((gap, index) => (
              <Descriptions.Item key={index} label={`Gap ${index + 1}`}>
                {gap.start} to {gap.end} ({gap.duration})
              </Descriptions.Item>
            ))}
          </Descriptions>

          {/* Gap Explanation Input */}
          <div style={{ marginTop: '16px' }}>
            <Title level={5} style={{ marginBottom: '12px', color: '#faad14' }}>
              Please explain the reason for these gaps:
            </Title>
            <Input.TextArea
              rows={4}
              value={gapExplanation}
              onChange={(e) => onGapExplanationChange?.(e.target.value)}
              placeholder="Please provide a brief explanation for the gaps in your work experience (e.g., personal reasons, career transition, education, etc.)"
              style={{ marginBottom: '8px' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              This information will be included in your application submission.
            </Text>
          </div>
        </div>
      )}

      <Divider />

      {/* Skills */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '16px', color: '#1890ff' }}>
          Skills
        </Title>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Technical Skills">
            {formData.technicalSkills || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Soft Skills">
            {formData.softSkills || 'Not specified'}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Divider />

      {/* Interests */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '16px', color: '#1890ff' }}>
          Interests
        </Title>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Hobbies & Interests">
            {formData.interests || 'Not specified'}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Divider />

      {/* Portfolio */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '16px', color: '#1890ff' }}>
          Portfolio
        </Title>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="GitHub Profile">
            {formData.githubProfile || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Portfolio Website">
            {formData.portfolioWebsite || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Projects">
            {formData.projects || 'Not specified'}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Divider />

      {/* References */}
      {formatArrayData(formData.references, 'References')}

      <div
        style={{
          textAlign: 'center',
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#f6ffed',
          borderRadius: '8px'
        }}
      >
        <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
          Please review all information before submitting your application.
        </Text>
      </div>
    </div>
  )
}

export default SummarySection
