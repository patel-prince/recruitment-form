import { Divider, Form, Input } from 'antd'

const InterestsSection = () => {
  return (
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
  )
}

export default InterestsSection 