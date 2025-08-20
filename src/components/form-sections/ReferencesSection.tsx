import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input } from 'antd'

const ReferencesSection = () => {
  return (
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
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Add Reference
            </Button>
          </>
        )}
      </Form.List>
    </div>
  )
}

export default ReferencesSection
