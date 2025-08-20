import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, DatePicker, Divider, Form, Input, Layout, Select } from 'antd'

const FormPage = () => {
  const [form] = Form.useForm()

  const handleCurrentlyWorkingChange = (checked: boolean, fieldName: number) => {
    // Simply set the checkbox value - no restrictions
    form.setFieldValue(['workExperience', fieldName, 'currentlyWorking'], checked)
  }

  return (
    <Layout>
      <Layout.Content className="min-h-full" style={{ padding: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log('Form submitted:', values)
          }}
        >
          {/* Personal Details Section */}
          <div style={{ marginBottom: '32px' }}>
            <Divider
              orientation="left"
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}
            >
              Personal Details
            </Divider>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px'
              }}
            >
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Middle Name" name="middleName">
                <Input />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter your last name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email', type: 'email' }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please select your gender' }]}
              >
                <Select
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' }
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
                rules={[{ required: true, message: 'Please select your date of birth' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please enter your city' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: 'Please enter your state' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Marital Status"
                name="maritalStatus"
                rules={[{ required: true, message: 'Please select your marital status' }]}
              >
                <Select
                  options={[
                    { label: 'Single', value: 'single' },
                    { label: 'Married', value: 'married' },
                    { label: 'Engaged', value: 'engaged' }
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Nationality"
                name="nationality"
                rules={[{ required: true, message: 'Please enter your nationality' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Language"
                name="language"
                rules={[{ required: true, message: 'Please enter your language' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="LinkedIn Profile" name="linkedInProfile">
                <Input />
              </Form.Item>
            </div>
          </div>

          {/* Education Details Section */}
          <div style={{ marginBottom: '32px' }}>
            <Divider
              orientation="left"
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}
            >
              Education Details
            </Divider>

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
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Education Details
                  </Button>
                </>
              )}
            </Form.List>
          </div>

          {/* Work Experience Section */}
          <div style={{ marginBottom: '32px' }}>
            <Divider
              orientation="left"
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}
            >
              Work Experience
            </Divider>
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
                      <Form.Item
                        name={[field.name, 'currentlyWorking']}
                        valuePropName="checked"
                      >
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
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Work Experience
                  </Button>
                </>
              )}
            </Form.List>
          </div>

          {/* Skills Section */}
          <div style={{ marginBottom: '32px' }}>
            <Divider
              orientation="left"
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}
            >
              Skills
            </Divider>
            <Form.Item label="Technical Skills" name="technicalSkills">
              <Input.TextArea
                rows={3}
                placeholder="e.g., JavaScript, React, Node.js, Python, etc."
              />
            </Form.Item>
            <Form.Item label="Soft Skills" name="softSkills">
              <Input.TextArea
                rows={3}
                placeholder="e.g., Leadership, Communication, Problem Solving, etc."
              />
            </Form.Item>
          </div>

          {/* Interests Section */}
          <div style={{ marginBottom: '32px' }}>
            <Divider
              orientation="left"
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}
            >
              Interests
            </Divider>
            <Form.Item label="Hobbies & Interests" name="interests">
              <Input.TextArea
                rows={3}
                placeholder="e.g., Reading, Traveling, Photography, etc."
              />
            </Form.Item>
          </div>

          {/* Portfolio Section */}
          <div style={{ marginBottom: '32px' }}>
            <Divider
              orientation="left"
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}
            >
              Portfolio
            </Divider>
            <Form.Item label="GitHub Profile" name="githubProfile">
              <Input placeholder="https://github.com/yourusername" />
            </Form.Item>
            <Form.Item label="Portfolio Website" name="portfolioWebsite">
              <Input placeholder="https://your-portfolio.com" />
            </Form.Item>
            <Form.Item label="Projects" name="projects">
              <Input.TextArea
                rows={4}
                placeholder="Describe your key projects and achievements"
              />
            </Form.Item>
          </div>

          {/* References Section */}
          <div style={{ marginBottom: '32px' }}>
            <Divider
              orientation="left"
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}
            >
              References
            </Divider>
            <Form.List name="references" initialValue={[]}>
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
                        <h4 style={{ margin: 0 }}>Reference #{field.name + 1}</h4>
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
                      <Form.Item label="Name" name={[field.name, 'name']}>
                        <Input />
                      </Form.Item>
                      <Form.Item label="Position" name={[field.name, 'position']}>
                        <Input />
                      </Form.Item>
                      <Form.Item label="Company" name={[field.name, 'company']}>
                        <Input />
                      </Form.Item>
                      <Form.Item label="Email" name={[field.name, 'email']}>
                        <Input />
                      </Form.Item>
                      <Form.Item label="Phone" name={[field.name, 'phone']}>
                        <Input />
                      </Form.Item>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Reference
                  </Button>
                </>
              )}
            </Form.List>
          </div>

          {/* Submit and Reset Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Submit Application
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="reset" size="large">
                Reset Form
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Layout.Content>
    </Layout>
  )
}

export default FormPage
