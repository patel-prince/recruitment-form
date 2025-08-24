import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, DatePicker, Form, Input, message } from 'antd'
import { useEffect, useState } from 'react'

interface WorkExperienceSectionProps {
  form: any
}

const WorkExperienceSection = ({ form }: WorkExperienceSectionProps) => {
  const [currentlyWorkingStates, setCurrentlyWorkingStates] = useState<boolean[]>([])
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: string[] }>(
    {}
  )

  // Function to get the most recent job index
  const getMostRecentJobIndex = () => {
    const workExperience = form.getFieldValue('workExperience') || []
    let mostRecentIndex = -1
    let mostRecentDate = new Date(0)

    workExperience.forEach((exp: any, index: number) => {
      const startDate = exp?.startDate ? exp.startDate.$d || exp.startDate.toDate() : null
      if (startDate && startDate > mostRecentDate) {
        mostRecentDate = startDate
        mostRecentIndex = index
      }
    })

    return mostRecentIndex
  }

  // Function to validate date overlaps
  const validateDateOverlaps = (currentIndex: number) => {
    const workExperience = form.getFieldValue('workExperience') || []
    const currentExp = workExperience[currentIndex]

    if (!currentExp?.startDate) return true

    const currentStart = currentExp.startDate.$d || currentExp.startDate.toDate()
    const currentEnd = currentExp.currentlyWorking
      ? new Date()
      : currentExp.endDate
        ? currentExp.endDate.$d || currentExp.endDate.toDate()
        : null

    for (let i = 0; i < workExperience.length; i++) {
      if (i === currentIndex) continue

      const otherExp = workExperience[i]
      if (!otherExp?.startDate) continue

      const otherStart = otherExp.startDate.$d || otherExp.startDate.toDate()
      const otherEnd = otherExp.currentlyWorking
        ? new Date()
        : otherExp.endDate
          ? otherExp.endDate.$d || otherExp.endDate.toDate()
          : null

      // Check for overlap
      if (currentEnd && otherEnd) {
        if (currentStart <= otherEnd && currentEnd >= otherStart) {
          message.error(`Date range overlaps with Work Experience #${i + 1}`)
          return false
        }
      }
    }
    return true
  }

  // Comprehensive validation function
  const validateWorkExperience = (index: number) => {
    const workExperience = form.getFieldValue('workExperience') || []
    const currentExp = workExperience[index]
    const errors: string[] = []

    // Required field validations
    if (!currentExp?.company?.trim()) {
      errors.push('Company name is required')
    }

    if (!currentExp?.position?.trim()) {
      errors.push('Position is required')
    }

    if (!currentExp?.startDate) {
      errors.push('Start date is required')
    }

    // Date validations
    if (currentExp?.startDate && currentExp?.endDate) {
      const startDate = currentExp.startDate.$d || currentExp.startDate.toDate()
      const endDate = currentExp.endDate.$d || currentExp.endDate.toDate()

      if (endDate <= startDate) {
        errors.push('End date must be after start date')
      }

      if (endDate > new Date()) {
        errors.push('End date cannot be in the future')
      }
    }

    if (currentExp?.startDate) {
      const startDate = currentExp.startDate.$d || currentExp.startDate.toDate()
      if (startDate > new Date()) {
        errors.push('Start date cannot be in the future')
      }
    }

    // Currently working validation
    if (currentExp?.currentlyWorking && currentExp?.endDate) {
      errors.push('Cannot be currently working if end date is provided')
    }

    // Duplicate experience validation
    if (
      currentExp?.company?.trim() &&
      currentExp?.position?.trim() &&
      currentExp?.startDate
    ) {
      const duplicateCount = workExperience.filter((exp: any, i: number) => {
        if (i === index) return false // Skip current entry

        const sameCompany = exp?.company?.trim() === currentExp.company.trim()
        const samePosition = exp?.position?.trim() === currentExp.position.trim()
        const sameStartDate =
          exp?.startDate &&
          currentExp.startDate &&
          (exp.startDate.$d || exp.startDate.toDate()).getTime() ===
            (currentExp.startDate.$d || currentExp.startDate.toDate()).getTime()

        // Check if end dates match (if both have end dates)
        let sameEndDate = false
        if (exp?.endDate && currentExp?.endDate) {
          sameEndDate =
            (exp.endDate.$d || exp.endDate.toDate()).getTime() ===
            (currentExp.endDate.$d || currentExp.endDate.toDate()).getTime()
        } else if (
          !exp?.endDate &&
          !currentExp?.endDate &&
          exp?.currentlyWorking === currentExp?.currentlyWorking
        ) {
          // Both are currently working or both don't have end dates
          sameEndDate = true
        }

        return sameCompany && samePosition && sameStartDate && sameEndDate
      }).length

      if (duplicateCount > 0) {
        errors.push(
          'This work experience entry already exists (duplicate company, position, and dates)'
        )
      }
    }

    // Update validation errors
    setValidationErrors((prev) => ({
      ...prev,
      [index]: errors
    }))

    return errors.length === 0
  }

  // Validate all work experiences
  const validateAllWorkExperiences = () => {
    const workExperience = form.getFieldValue('workExperience') || []
    let allValid = true

    // Check for duplicates across all entries
    const duplicates = findDuplicateExperiences()
    if (duplicates.length > 0) {
      duplicates.forEach(({ index, duplicateIndex }) => {
        setValidationErrors((prev) => ({
          ...prev,
          [index]: [
            ...(prev[index] || []),
            `Duplicate of Work Experience #${duplicateIndex + 1}`
          ]
        }))
      })
      allValid = false
    }

    workExperience.forEach((_exp: any, index: number) => {
      if (!validateWorkExperience(index)) {
        allValid = false
      }
    })

    return allValid
  }

  // Find duplicate experiences across all entries
  const findDuplicateExperiences = () => {
    const workExperience = form.getFieldValue('workExperience') || []
    const duplicates: { index: number; duplicateIndex: number }[] = []

    for (let i = 0; i < workExperience.length; i++) {
      for (let j = i + 1; j < workExperience.length; j++) {
        const exp1 = workExperience[i]
        const exp2 = workExperience[j]

        if (isDuplicateExperience(exp1, exp2)) {
          duplicates.push({ index: i, duplicateIndex: j })
          duplicates.push({ index: j, duplicateIndex: i })
        }
      }
    }

    return duplicates
  }

  // Check if two experiences are duplicates
  const isDuplicateExperience = (exp1: any, exp2: any) => {
    if (!exp1?.company?.trim() || !exp2?.company?.trim()) return false
    if (!exp1?.position?.trim() || !exp2?.position?.trim()) return false
    if (!exp1?.startDate || !exp2?.startDate) return false

    const sameCompany = exp1.company.trim() === exp2.company.trim()
    const samePosition = exp1.position.trim() === exp2.position.trim()

    const startDate1 = exp1.startDate.$d || exp1.startDate.toDate()
    const startDate2 = exp2.startDate.$d || exp2.startDate.toDate()
    const sameStartDate = startDate1.getTime() === startDate2.getTime()

    // Check end dates
    let sameEndDate = false
    if (exp1?.endDate && exp2?.endDate) {
      const endDate1 = exp1.endDate.$d || exp1.endDate.toDate()
      const endDate2 = exp2.endDate.$d || exp2.endDate.toDate()
      sameEndDate = endDate1.getTime() === endDate2.getTime()
    } else if (
      !exp1?.endDate &&
      !exp2?.endDate &&
      exp1?.currentlyWorking === exp2?.currentlyWorking
    ) {
      sameEndDate = true
    }

    return sameCompany && samePosition && sameStartDate && sameEndDate
  }

  const handleCurrentlyWorkingChange = (checked: boolean, fieldName: number) => {
    const mostRecentIndex = getMostRecentJobIndex()

    if (checked && fieldName !== mostRecentIndex) {
      message.error('Only the most recent job can be marked as "Currently Working Here"')
      return
    }

    // Update the local state to track checkbox states
    setCurrentlyWorkingStates((prev) => {
      const newStates = [...prev]
      newStates[fieldName] = checked
      return newStates
    })

    // Set the form value
    form.setFieldValue(['workExperience', fieldName, 'currentlyWorking'], checked)

    // If checked, clear the end date
    if (checked) {
      form.setFieldValue(['workExperience', fieldName, 'endDate'], null)
    }
  }

  // Initialize currently working states when fields change
  useEffect(() => {
    const workExperience = form.getFieldValue('workExperience') || []
    const states = workExperience.map((exp: any) => exp?.currentlyWorking || false)
    setCurrentlyWorkingStates(states)
  }, [form])

  // Auto-check "Currently Working Here" when component mounts or form changes
  useEffect(() => {
    autoCheckCurrentlyWorking()
  }, [form])

  // Handle date changes and validate overlaps
  const handleDateChange = (fieldName: number, fieldType: 'startDate' | 'endDate') => {
    // If an end date is added, automatically uncheck "Currently Working Here"
    if (fieldType === 'endDate') {
      const workExperience = form.getFieldValue('workExperience') || []
      const currentExp = workExperience[fieldName]

      if (currentExp?.endDate && currentExp?.currentlyWorking) {
        handleCurrentlyWorkingChange(false, fieldName)
      }
    }

    // If start date is added and no end date, automatically check "Currently Working Here"
    if (fieldType === 'startDate') {
      const workExperience = form.getFieldValue('workExperience') || []
      const currentExp = workExperience[fieldName]

      if (
        currentExp?.startDate &&
        !currentExp?.endDate &&
        !currentExp?.currentlyWorking
      ) {
        // Check if this is the most recent job
        const mostRecentIndex = getMostRecentJobIndex()
        if (fieldName === mostRecentIndex) {
          handleCurrentlyWorkingChange(true, fieldName)
        }
      }
    }

    // Validate overlaps and comprehensive validation after a short delay
    setTimeout(() => {
      validateDateOverlaps(fieldName)
      validateWorkExperience(fieldName)
    }, 100)
  }

  // Check if checkbox should be disabled for this field
  const isCheckboxDisabled = (fieldName: number) => {
    const mostRecentIndex = getMostRecentJobIndex()
    return fieldName !== mostRecentIndex
  }

  // Check if checkbox should be hidden (when end date is provided)
  const isCheckboxHidden = (fieldName: number) => {
    const workExperience = form.getFieldValue('workExperience') || []
    const currentExp = workExperience[fieldName]
    return currentExp?.endDate && !currentExp?.currentlyWorking
  }

  // Function to auto-check "Currently Working Here" for jobs with start date but no end date
  const autoCheckCurrentlyWorking = () => {
    const workExperience = form.getFieldValue('workExperience') || []
    const mostRecentIndex = getMostRecentJobIndex()

    workExperience.forEach((exp: any, index: number) => {
      if (
        exp?.startDate &&
        !exp?.endDate &&
        !exp?.currentlyWorking &&
        index === mostRecentIndex
      ) {
        handleCurrentlyWorkingChange(true, index)
      }
    })
  }

  // Handle input changes and validate
  const handleInputChange = (fieldName: number) => {
    setTimeout(() => {
      validateWorkExperience(fieldName)
      // Also check for duplicates across all entries
      const duplicates = findDuplicateExperiences()
      if (duplicates.length > 0) {
        duplicates.forEach(({ index, duplicateIndex }) => {
          if (index === fieldName) {
            setValidationErrors((prev) => ({
              ...prev,
              [index]: [
                ...(prev[index] || []),
                `Duplicate of Work Experience #${duplicateIndex + 1}`
              ]
            }))
          }
        })
      }
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
      form.validateWorkExperienceSection = validateAllWorkExperiences
    }
  }, [form])

  return (
    <Form.List name="workExperience" initialValue={[]}>
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
                <h4 style={{ margin: 0 }}>Work Experience #{field.name + 1}</h4>
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
                label="Company Name"
                name={[field.name, 'company']}
                rules={[{ required: true, message: 'Company name is required' }]}
                validateStatus={
                  validationErrors[field.name]?.includes('Company name is required')
                    ? 'error'
                    : ''
                }
                help={
                  validationErrors[field.name]?.includes('Company name is required')
                    ? 'Company name is required'
                    : ''
                }
              >
                <Input
                  onChange={() => handleInputChange(field.name)}
                  placeholder="Enter company name"
                />
              </Form.Item>
              <Form.Item
                label="Position"
                name={[field.name, 'position']}
                rules={[{ required: true, message: 'Position is required' }]}
                validateStatus={
                  validationErrors[field.name]?.includes('Position is required')
                    ? 'error'
                    : ''
                }
                help={
                  validationErrors[field.name]?.includes('Position is required')
                    ? 'Position is required'
                    : ''
                }
              >
                <Input
                  onChange={() => handleInputChange(field.name)}
                  placeholder="Enter your position"
                />
              </Form.Item>
              <Form.Item
                label="Start Date"
                name={[field.name, 'startDate']}
                rules={[{ required: true, message: 'Start date is required' }]}
                validateStatus={
                  validationErrors[field.name]?.includes('Start date is required')
                    ? 'error'
                    : ''
                }
                help={
                  validationErrors[field.name]?.includes('Start date is required')
                    ? 'Start date is required'
                    : ''
                }
              >
                <DatePicker
                  style={{ width: '100%' }}
                  onChange={() => handleDateChange(field.name, 'startDate')}
                  placeholder="Select start date"
                />
              </Form.Item>
              {!currentlyWorkingStates[field.name] && (
                <Form.Item
                  label="End Date"
                  name={[field.name, 'endDate']}
                  validateStatus={
                    validationErrors[field.name]?.some((err) => err.includes('End date'))
                      ? 'error'
                      : ''
                  }
                  help={
                    validationErrors[field.name]?.find((err) =>
                      err.includes('End date')
                    ) || ''
                  }
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    onChange={() => handleDateChange(field.name, 'endDate')}
                    placeholder="Select end date"
                  />
                </Form.Item>
              )}
              {!isCheckboxHidden(field.name) && (
                <Form.Item
                  name={[field.name, 'currentlyWorking']}
                  valuePropName="checked"
                >
                  <Checkbox
                    disabled={isCheckboxDisabled(field.name)}
                    onChange={(e) =>
                      handleCurrentlyWorkingChange(e.target.checked, field.name)
                    }
                  >
                    Currently Working Here
                  </Checkbox>
                </Form.Item>
              )}
              <Form.Item label="Description" name={[field.name, 'description']}>
                <Input.TextArea
                  rows={4}
                  placeholder="Describe your role and responsibilities"
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
            Add Work Experience
          </Button>
        </>
      )}
    </Form.List>
  )
}

export default WorkExperienceSection
