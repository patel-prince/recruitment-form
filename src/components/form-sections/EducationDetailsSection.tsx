import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Select } from 'antd'
import { useEffect, useState } from 'react'

interface EducationDetailsSectionProps {
  form: any
}

const EducationDetailsSection = ({ form }: EducationDetailsSectionProps) => {
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: string[] }>(
    {}
  )

  // Comprehensive validation function for education
  const validateEducation = (index: number) => {
    const educationDetails = form.getFieldValue('educationDetails') || []
    const currentEducation = educationDetails[index]
    const errors: string[] = []

    // Required field validations
    if (!currentEducation?.school?.trim()) {
      errors.push('School/College name is required')
    }

    if (!currentEducation?.degree) {
      errors.push('Degree type is required')
    }

    if (!currentEducation?.year) {
      errors.push('Year of passing is required')
    }

    // Year validation
    if (currentEducation?.year) {
      const year = currentEducation.year.$d || currentEducation.year.toDate()
      const currentYear = new Date().getFullYear()
      const yearValue = year.getFullYear()

      if (yearValue > currentYear) {
        errors.push('Year of passing cannot be in the future')
      }

      if (yearValue < 1950) {
        errors.push('Year of passing seems too far in the past')
      }
    }

    // Course name validation for higher education
    if (
      currentEducation?.degree &&
      ['degree', 'masters', 'phd', 'msc', 'bsc', 'bca', 'mca', 'btech', 'mtech'].includes(
        currentEducation.degree
      )
    ) {
      if (!currentEducation?.course?.trim()) {
        errors.push('Course name is required for higher education degrees')
      }
    }

    // Duplicate education validation
    if (
      currentEducation?.school?.trim() &&
      currentEducation?.degree &&
      currentEducation?.year
    ) {
      const duplicateCount = educationDetails.filter((edu: any, i: number) => {
        if (i === index) return false // Skip current entry

        const sameSchool = edu?.school?.trim() === currentEducation.school.trim()
        const sameDegree = edu?.degree === currentEducation.degree
        const sameYear =
          edu?.year &&
          currentEducation.year &&
          (edu.year.$d || edu.year.toDate()).getFullYear() ===
            (currentEducation.year.$d || currentEducation.year.toDate()).getFullYear()
        const sameCourse = edu?.course?.trim() === currentEducation.course?.trim()

        return sameSchool && sameDegree && sameYear && sameCourse
      }).length

      if (duplicateCount > 0) {
        errors.push(
          'This education entry already exists (duplicate school, degree, year, and course)'
        )
      }
    }

    // Logical education progression validation
    if (educationDetails.length > 1) {
      const currentYear = currentEducation?.year
        ? (currentEducation.year.$d || currentEducation.year.toDate()).getFullYear()
        : null
      const currentDegree = currentEducation?.degree

      educationDetails.forEach((edu: any, i: number) => {
        if (i === index) return

        const otherYear = edu?.year
          ? (edu.year.$d || edu.year.toDate()).getFullYear()
          : null
        const otherDegree = edu?.degree

        if (currentYear && otherYear && currentDegree && otherDegree) {
          // Check if higher degree has earlier year than lower degree
          const degreeOrder = {
            '10th': 1,
            '12th': 2,
            diploma: 3,
            degree: 4,
            bsc: 4,
            bca: 4,
            btech: 4,
            masters: 5,
            msc: 5,
            mca: 5,
            mtech: 5,
            phd: 6
          }

          const currentLevel = degreeOrder[currentDegree as keyof typeof degreeOrder] || 0
          const otherLevel = degreeOrder[otherDegree as keyof typeof degreeOrder] || 0

          if (currentLevel > otherLevel && currentYear < otherYear) {
            errors.push(
              `Higher degree (${currentDegree}) cannot be completed before lower degree (${otherDegree})`
            )
          }
        }
      })
    }

    // Update validation errors
    setValidationErrors((prev) => ({
      ...prev,
      [index]: errors
    }))

    return errors.length === 0
  }

  // Validate all education entries
  const validateAllEducation = () => {
    const educationDetails = form.getFieldValue('educationDetails') || []
    let allValid = true

    educationDetails.forEach((_edu: any, index: number) => {
      if (!validateEducation(index)) {
        allValid = false
      }
    })

    return allValid
  }

  // Handle input changes and validate
  const handleInputChange = (fieldName: number) => {
    setTimeout(() => {
      validateEducation(fieldName)
    }, 100)
  }

  // Handle remove with validation cleanup
  const handleRemove = (remove: any, fieldName: number) => {
    remove(fieldName)
    // Clear validation errors for removed field
    setValidationErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }

  // Expose validation function to parent component
  useEffect(() => {
    if (form) {
      form.validateEducationSection = validateAllEducation
    }
  }, [form])

  return (
    <Form.List name="educationDetails" initialValue={[{}]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <div
              key={field.key}
              style={{
                border: '1px solid #d9d9d9',
                padding: '16px',
                marginBottom: '16px',
                borderRadius: '6px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}
              >
                <h4 style={{ margin: 0 }}>Education #{field.name + 1}</h4>
                <Button
                  type="text"
                  danger
                  icon={<MinusOutlined />}
                  onClick={() => handleRemove(remove, field.name)}
                  size="small"
                >
                  Remove
                </Button>
              </div>
              <Form.Item
                label="School Name"
                name={[field.name, 'school']}
                rules={[{ required: true, message: 'School/College name is required' }]}
                validateStatus={
                  validationErrors[field.name]?.includes(
                    'School/College name is required'
                  )
                    ? 'error'
                    : ''
                }
                help={
                  validationErrors[field.name]?.includes(
                    'School/College name is required'
                  )
                    ? 'School/College name is required'
                    : ''
                }
              >
                <Input
                  placeholder="Enter school/college name"
                  onChange={() => handleInputChange(field.name)}
                />
              </Form.Item>
              <Form.Item
                label="Degree"
                name={[field.name, 'degree']}
                rules={[{ required: true, message: 'Degree type is required' }]}
                validateStatus={
                  validationErrors[field.name]?.includes('Degree type is required')
                    ? 'error'
                    : ''
                }
                help={
                  validationErrors[field.name]?.includes('Degree type is required')
                    ? 'Degree type is required'
                    : ''
                }
              >
                <Select
                  placeholder="Select degree type"
                  onChange={() => handleInputChange(field.name)}
                  options={[
                    { label: '10th', value: '10th' },
                    { label: '12th', value: '12th' },
                    { label: 'Diploma', value: 'diploma' },
                    { label: 'Degree', value: 'degree' },
                    { label: 'Masters', value: 'masters' },
                    { label: 'PhD', value: 'phd' },
                    { label: 'MSc', value: 'msc' },
                    { label: 'BSc', value: 'bsc' },
                    { label: 'BCA', value: 'bca' },
                    { label: 'MCA', value: 'mca' },
                    { label: 'BTech', value: 'btech' },
                    { label: 'MTech', value: 'mtech' },
                    { label: 'Other', value: 'other' }
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Course Name"
                name={[field.name, 'course']}
                validateStatus={
                  validationErrors[field.name]?.includes(
                    'Course name is required for higher education degrees'
                  )
                    ? 'error'
                    : ''
                }
                help={
                  validationErrors[field.name]?.includes(
                    'Course name is required for higher education degrees'
                  )
                    ? 'Course name is required for higher education degrees'
                    : ''
                }
              >
                <Input
                  placeholder="e.g., Computer Science, Information Technology, etc."
                  onChange={() => handleInputChange(field.name)}
                />
              </Form.Item>
              <Form.Item
                label="Year of Passing"
                name={[field.name, 'year']}
                rules={[{ required: true, message: 'Year of passing is required' }]}
                validateStatus={
                  validationErrors[field.name]?.some((err) =>
                    err.includes('Year of passing')
                  )
                    ? 'error'
                    : ''
                }
                help={
                  validationErrors[field.name]?.find((err) =>
                    err.includes('Year of passing')
                  ) || ''
                }
              >
                <DatePicker
                  picker="year"
                  placeholder="Select year"
                  format="YYYY"
                  onChange={() => handleInputChange(field.name)}
                />
              </Form.Item>

              {/* Display validation errors */}
              {validationErrors[field.name] &&
                validationErrors[field.name].length > 0 && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#fff2f0',
                      border: '1px solid #ffccc7',
                      borderRadius: '6px',
                      color: '#cf1322'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      Validation Errors:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '16px' }}>
                      {validationErrors[field.name].map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ))}
          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Add Education Details
          </Button>
        </>
      )}
    </Form.List>
  )
}

export default EducationDetailsSection
