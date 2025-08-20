import { Form, Input } from 'antd'

const SkillsSection = () => {
  return (
    <>
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
    </>
  )
}

export default SkillsSection
