import { Form, Input } from 'antd'

const PortfolioSection = () => {
  return (
    <>
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
    </>
  )
}

export default PortfolioSection
