import {
  Typography,
  Card,
  Avatar,
  Space,
  Divider,
  Switch,
  Form,
  Button,
  message,
} from "antd";
import {
  UserOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/authStore";

const { Title, Text, Paragraph } = Typography;

export const SettingsView: React.FC = () => {
  const { user, role, logout } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();

  const roleLabel = role === "admin" ? "ผู้ดูแลระบบ" : "พนักงาน";

  const handleLogout = () => {
    logout();
    messageApi.success("ออกจากระบบสำเร็จ");
  };

  return (
    <>
      {contextHolder}
      <div style={{ maxWidth: 800 }}>
        <Title level={4} style={{ margin: "0 0 24px", color: "#fff" }}>
          ตั้งค่า
        </Title>

        {/* User Profile Section */}
        <Card className="glass-card" style={{ marginBottom: 16 }}>
          <Space size={16} align="start">
            <Avatar size={64} icon={<UserOutlined />} />
            <div>
              <Title level={5} style={{ margin: 0, color: "#fff" }}>
                {user?.email?.split("@")[0] || "User"}
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.6)" }}>
                {user?.email}
              </Text>
              <div style={{ marginTop: 8 }}>
                <Text
                  style={{
                    padding: "2px 8px",
                    background: "rgba(0, 172, 193, 0.2)",
                    borderRadius: 4,
                    fontSize: 12,
                    color: "#00ACC1",
                  }}
                >
                  {roleLabel}
                </Text>
              </div>
            </div>
          </Space>
        </Card>

        {/* Notifications Section */}
        <Card
          className="glass-card"
          style={{ marginBottom: 16 }}
          title={
            <Space>
              <BellOutlined />
              <span>การแจ้งเตือน</span>
            </Space>
          }
        >
          <Form layout="horizontal" labelCol={{ span: 18 }} wrapperCol={{ span: 6 }}>
            <Form.Item
              label={
                <div>
                  <Text style={{ color: "#fff" }}>แจ้งเตือนสินค้าใกล้หมด</Text>
                  <Paragraph
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 12,
                      margin: 0,
                    }}
                  >
                    แสดงแจ้งเตือนเมื่อสินค้าเหลือน้อยกว่าจำนวนขั้นต่ำ
                  </Paragraph>
                </div>
              }
              style={{ marginBottom: 16 }}
            >
              <Switch defaultChecked />
            </Form.Item>

            <Form.Item
              label={
                <div>
                  <Text style={{ color: "#fff" }}>แจ้งเตือนการเบิกสินค้า</Text>
                  <Paragraph
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 12,
                      margin: 0,
                    }}
                  >
                    แจ้งเตือนเมื่อมีการเบิกสินค้าออกจากคลัง
                  </Paragraph>
                </div>
              }
              style={{ marginBottom: 0 }}
            >
              <Switch defaultChecked />
            </Form.Item>
          </Form>
        </Card>

        {/* Security Section */}
        <Card
          className="glass-card"
          style={{ marginBottom: 16 }}
          title={
            <Space>
              <SafetyCertificateOutlined />
              <span>ความปลอดภัย</span>
            </Space>
          }
        >
          <Space orientation="vertical" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text style={{ color: "#fff" }}>รหัสผ่าน</Text>
                <Paragraph
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 12,
                    margin: 0,
                  }}
                >
                  เปลี่ยนรหัสผ่านเพื่อความปลอดภัย
                </Paragraph>
              </div>
              <Button size="small">เปลี่ยนรหัสผ่าน</Button>
            </div>
          </Space>
        </Card>

        {/* About Section */}
        <Card
          className="glass-card"
          style={{ marginBottom: 16 }}
          title={
            <Space>
              <InfoCircleOutlined />
              <span>เกี่ยวกับแอป</span>
            </Space>
          }
        >
          <Space orientation="vertical" size={4}>
            <Text style={{ color: "rgba(255,255,255,0.8)" }}>
              <strong>ReadyStock</strong> - ระบบจัดการคลังสินค้า
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
              Version 1.0.0
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
              © 2026 ReadyStock. All rights reserved.
            </Text>
          </Space>
        </Card>

        <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Logout Button */}
        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          size="large"
          block
        >
          ออกจากระบบ
        </Button>
      </div>
    </>
  );
};

export default SettingsView;
