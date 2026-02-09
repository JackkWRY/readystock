import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { LockOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { supabase } from '../../lib/supabaseClient';
import { useAuthStore, UserRole } from '../../store/authStore';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { setUser, setSession, setRole } = useAuthStore();

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        messageApi.error(error.message);
        return;
      }

      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        setRole((data.user.user_metadata?.role as UserRole) || 'staff');
        messageApi.success('เข้าสู่ระบบสำเร็จ!');
      }
    } catch (err) {
      messageApi.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Card
          className="glass-card"
          style={{
            width: '100%',
            maxWidth: 420,
            padding: '24px 16px',
          }}
          bordered={false}
        >
          <Space
            orientation="vertical"
            size="large"
            style={{ width: '100%', textAlign: 'center' }}
          >
            {/* Logo & Branding */}
            <div>
              <ShopOutlined
                style={{
                  fontSize: 56,
                  color: '#00ACC1',
                  marginBottom: 16,
                }}
              />
              <Title level={2} style={{ margin: 0, color: '#fff' }}>
                ReadyStock
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                ระบบจัดการคลังสินค้า
              </Text>
            </div>

            {/* Login Form */}
            <Form
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              size="large"
              style={{ textAlign: 'left' }}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'กรุณากรอกอีเมล' },
                  { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />}
                  placeholder="อีเมล"
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
                  prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />}
                  placeholder="รหัสผ่าน"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: 48,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  เข้าสู่ระบบ
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
