import { Form, Input } from 'antd'

const InterestsSection = () => {
  return (
    <Form.Item label="Hobbies & Interests" name="interests">
      <Input.TextArea
        rows={3}
        placeholder="e.g., Reading, Traveling, Photography, etc."
      />
    </Form.Item>
  )
}

export default InterestsSection
