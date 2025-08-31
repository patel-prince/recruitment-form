import { FileTextOutlined, InboxOutlined, LoadingOutlined } from '@ant-design/icons'
import { Alert, Form, Typography, Upload, message } from 'antd'
import { useState } from 'react'
import { uploadResumeToCloudinary, type CloudinaryUploadResponse } from '../../firebase/cloudinaryService'

const { Dragger } = Upload
const { Text, Paragraph } = Typography

interface ResumeUploadSectionProps {
  form: any
}

const ResumeUploadSection = ({ form }: ResumeUploadSectionProps) => {
  const [fileList, setFileList] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [cloudinaryData, setCloudinaryData] = useState<CloudinaryUploadResponse | null>(null)

  const uploadProps = {
    name: 'resume',
    multiple: false,
    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif',
    fileList,
    beforeUpload: async (file: File) => {
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

      try {
        setUploading(true)
        message.loading('Uploading resume to Cloudinary...', 0)
        
        // Upload to Cloudinary
        const cloudinaryResult = await uploadResumeToCloudinary(file)
        
        // Debug: Log the raw Cloudinary response
        console.log('Raw Cloudinary response:', cloudinaryResult)
        
        // Store Cloudinary data in form (only metadata, not the file object)
        form.setFieldValue('resume', file.name) // Store only the filename
        
        // Clean the Cloudinary result to remove any file objects
        const cleanCloudinaryData = {
          public_id: cloudinaryResult.public_id || '',
          secure_url: cloudinaryResult.secure_url || '',
          url: cloudinaryResult.url || '',
          format: cloudinaryResult.format || '',
          resource_type: cloudinaryResult.resource_type || '',
          created_at: cloudinaryResult.created_at || '',
          bytes: cloudinaryResult.bytes || 0
        }
        
        // Debug: Log the cleaned data
        console.log('Cleaned Cloudinary data:', cleanCloudinaryData)
        
        // Update the local state with clean data
        setCloudinaryData(cleanCloudinaryData)
        
        form.setFieldValue('cloudinaryData', cleanCloudinaryData)
        
        setFileList([file])
        
        message.destroy()
        message.success(`${file.name} uploaded successfully to Cloudinary!`)
        
        return false // Prevent default upload behavior
      } catch (error) {
        message.destroy()
        message.error('Failed to upload resume to Cloudinary. Please try again.')
        console.error('Upload error:', error)
        return false
      } finally {
        setUploading(false)
      }
    },
    onRemove: () => {
      setFileList([])
      setCloudinaryData(null)
      form.setFieldValue('resume', '')
      form.setFieldValue('cloudinaryData', null)
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
          Maximum file size is 5MB. Your resume will be stored securely in Cloudinary.
        </Paragraph>
      </div>

      <Form.Item
        name="resume"
        rules={[{ required: true, message: 'Please upload your resume!' }]}
        hidden
      >
        <input />
      </Form.Item>

      <Form.Item
        name="cloudinaryData"
        rules={[{ required: true, message: 'Please upload your resume to Cloudinary!' }]}
        hidden
      >
        <input />
      </Form.Item>

      <Dragger {...uploadProps} style={{ padding: '32px' }} disabled={uploading}>
        <p className="ant-upload-drag-icon">
          {uploading ? (
            <LoadingOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          ) : (
            <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          )}
        </p>
        <p
          className="ant-upload-text"
          style={{ fontSize: '16px', marginBottom: '8px' }}
        >
          {uploading ? 'Uploading...' : 'Click or drag resume file to this area to upload'}
        </p>
        <p className="ant-upload-hint" style={{ color: '#666' }}>
          Support for PDF, DOC, DOCX, and image files (JPG, PNG, GIF). Maximum size: 5MB
        </p>
      </Dragger>

      {/* Hidden field for Cloudinary data */}
      <Form.Item name="cloudinaryData" hidden>
        <input />
      </Form.Item>

      {fileList.length > 0 && cloudinaryData && (
        <Alert
          message="Resume Uploaded Successfully to Cloudinary"
          description={
            <div>
              <Text strong>{fileList[0].name}</Text>
              <br />
              <Text type="secondary">
                Size: {(fileList[0].size / 1024 / 1024).toFixed(2)} MB
              </Text>
              <br />
              <Text type="secondary">
                Cloudinary ID: {cloudinaryData.public_id || 'N/A'}
              </Text>
              <br />
              <Text type="secondary">
                Format: {cloudinaryData.format ? cloudinaryData.format.toUpperCase() : 'N/A'}
              </Text>
              <br />
              <Text type="secondary">
                Resource Type: {cloudinaryData.resource_type || 'N/A'}
              </Text>
              <br />
                             <Text type="secondary">
                 <a href={cloudinaryData.secure_url} target="_blank" rel="noopener noreferrer">
                   View Resume ↗
                 </a>
               </Text>
               <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                 Click the link above to view your resume directly in the browser
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
          <li>Your resume will be stored securely in Cloudinary</li>
        </ul>
      </div>
    </div>
  )
}

export default ResumeUploadSection
