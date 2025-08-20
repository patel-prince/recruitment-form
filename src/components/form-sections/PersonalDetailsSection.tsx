import { DatePicker, Divider, Form, Input, Select } from 'antd'

const PersonalDetailsSection = () => {
  return (
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
  )
}

export default PersonalDetailsSection 