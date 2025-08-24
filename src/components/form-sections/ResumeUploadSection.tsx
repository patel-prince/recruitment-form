import { FileTextOutlined, InboxOutlined } from '@ant-design/icons'
import { Alert, Form, Typography, Upload, message } from 'antd'
import { useState } from 'react'

const { Dragger } = Upload
const { Text, Paragraph } = Typography

interface ResumeUploadSectionProps {
  form: any
}

const ResumeUploadSection = ({ form }: ResumeUploadSectionProps) => {
  const [fileList, setFileList] = useState<any[]>([])

  const uploadProps = {
    name: 'resume',
    multiple: false,
    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif',
    fileList,
    beforeUpload: (file: File) => {
      const isValidType =
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif'

      if (!isValidType) {
        message.error(
          'You can only upload PDF, DOC, DOCX, or image files (JPG, PNG, GIF)!'
        )
        return false
      }

      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error('File must be smaller than 5MB!')
        return false
      }

      // Set the file in form
      form.setFieldValue('resume', file)
      setFileList([file])
      message.success(`${file.name} uploaded successfully!`)
      return false // Prevent default upload behavior
    },
    onRemove: () => {
      setFileList([])
      form.setFieldValue('resume', null)
      message.info('Resume removed')
    }
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Typography.Title level={3} style={{ marginBottom: '16px' }}>
          Resume Upload
        </Typography.Title>
        <Paragraph style={{ color: '#666', marginBottom: '16px' }}>
          Please upload your resume in PDF, DOC, DOCX, or image format (JPG, PNG, GIF).
          Maximum file size is 5MB.
        </Paragraph>
      </div>

      <Form.Item
        name="resume"
        rules={[{ required: true, message: 'Please upload your resume!' }]}
      >
        <Dragger {...uploadProps} style={{ padding: '32px' }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </p>
          <p
            className="ant-upload-text"
            style={{ fontSize: '16px', marginBottom: '8px' }}
          >
            Click or drag resume file to this area to upload
          </p>
          <p className="ant-upload-hint" style={{ color: '#666' }}>
            Support for PDF, DOC, DOCX, and image files (JPG, PNG, GIF). Maximum size: 5MB
          </p>
        </Dragger>
      </Form.Item>

      {fileList.length > 0 && (
        <Alert
          message="Resume Uploaded Successfully"
          description={
            <div>
              <Text strong>{fileList[0].name}</Text>
              <br />
              <Text type="secondary">
                Size: {(fileList[0].size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </div>
          }
          type="success"
          showIcon
          icon={<FileTextOutlined />}
          style={{ marginTop: '16px' }}
        />
      )}

      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f6f8fa',
          borderRadius: '6px'
        }}
      >
        <Typography.Title level={5} style={{ marginBottom: '12px' }}>
          Resume Guidelines:
        </Typography.Title>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
          <li>Upload your most recent resume</li>
          <li>Ensure all information matches what you've entered in the form</li>
          <li>File should be clear and well-formatted</li>
          <li>Include your contact information and work experience</li>
          <li>Make sure the file is not password protected</li>
        </ul>
      </div>
    </div>
  )
}

export default ResumeUploadSection
