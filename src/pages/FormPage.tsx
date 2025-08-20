import { Button, Form, Layout } from 'antd'

import {
  EducationDetailsSection,
  InterestsSection,
  PersonalDetailsSection,
  PortfolioSection,
  ReferencesSection,
  SkillsSection,
  WorkExperienceSection
} from '../components/form-sections'

const FormPage = () => {
  const [form] = Form.useForm()

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
          <PersonalDetailsSection />

          {/* Education Details Section */}
          <EducationDetailsSection />

          {/* Work Experience Section */}
          <WorkExperienceSection form={form} />

          {/* Skills Section */}
          <SkillsSection />

          {/* Interests Section */}
          <InterestsSection />

          {/* Portfolio Section */}
          <PortfolioSection />

          {/* References Section */}
          <ReferencesSection />

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
