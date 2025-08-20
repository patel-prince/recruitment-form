import { Divider, Form, Input } from 'antd'

const SkillsSection = () => {
  return (
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
  )
}

export default SkillsSection
