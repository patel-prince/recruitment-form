import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, DatePicker, Form, Input } from 'antd'

interface WorkExperienceSectionProps {
  form: any
}

const WorkExperienceSection = ({ form }: WorkExperienceSectionProps) => {
  const handleCurrentlyWorkingChange = (checked: boolean, fieldName: number) => {
    // Simply set the checkbox value - no restrictions
    form.setFieldValue(['workExperience', fieldName, 'currentlyWorking'], checked)
  }

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
                {fields.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<MinusOutlined />}
                    onClick={() => remove(field.name)}
                    size="small"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Form.Item label="Company Name" name={[field.name, 'company']}>
                <Input />
              </Form.Item>
              <Form.Item label="Position" name={[field.name, 'position']}>
                <Input />
              </Form.Item>
              <Form.Item label="Start Date" name={[field.name, 'startDate']}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="End Date" name={[field.name, 'endDate']}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name={[field.name, 'currentlyWorking']} valuePropName="checked">
                <Checkbox
                  onChange={(e) =>
                    handleCurrentlyWorkingChange(e.target.checked, field.name)
                  }
                >
                  Currently Working Here
                </Checkbox>
              </Form.Item>
              <Form.Item label="Description" name={[field.name, 'description']}>
                <Input.TextArea rows={4} />
              </Form.Item>
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
