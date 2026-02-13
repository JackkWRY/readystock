import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { LockOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';

import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../hooks/useTranslation';
import './LoginView.css';
import { handleError } from '../../utils/errorHandler';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { login } = useAuthStore();
  const { t } = useTranslation();

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      await login(values.email, values.password);
      messageApi.success(t.LOGIN.SUCCESS);
    } catch (err) {
      handleError(err, t.LOGIN.ERROR_INVALID);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="login-container">
        <Card
          className="glass-card login-card"
          bordered={false}
        >
          <Space
            orientation="vertical"
            size="large"
            className="login-content"
          >
            {/* Logo & Branding */}
            <div>
              <ShopOutlined className="login-logo-icon" />
              <Title level={2} className="login-title">
                ReadyStock
              </Title>
              <Text type="secondary" className="login-subtitle">
                ระบบจัดการคลังสินค้า
              </Text>
            </div>

            {/* Login Form */}
            <Form
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              size="large"
              className="login-form"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'กรุณากรอกอีเมล' },
                  { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="login-input-icon" />}
                  placeholder={t.LOGIN.EMAIL}
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'กรุณากรอกรหัสผ่าน' },
                  { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="login-input-icon" />}
                  placeholder={t.LOGIN.PASSWORD}
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="login-button"
                >
                  {t.LOGIN.SUBMIT}
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </div>
    </>
  );
};

export default LoginView;
