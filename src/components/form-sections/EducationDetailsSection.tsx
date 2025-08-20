import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Select } from 'antd'

const EducationDetailsSection = () => {
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
              <Form.Item label="School Name" name={[field.name, 'school']}>
                <Input />
              </Form.Item>
              <Form.Item label="Degree" name={[field.name, 'degree']}>
                <Select
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
              <Form.Item label="Year of Passing" name={[field.name, 'year']}>
                <DatePicker picker="year" />
              </Form.Item>
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
