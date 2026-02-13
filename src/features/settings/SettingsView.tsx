import {
  Typography,
  Card,
  Avatar,
  Space,
  Divider,
  Button,
  message,
} from "antd";
import {
  UserOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/authStore";
import { UserRole } from "../../constants/inventory";
import { TH } from "../../constants/th";
import "./SettingsView.css";

const { Title, Text } = Typography;

export const SettingsView: React.FC = () => {
  const { user, role, logout } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();

  let roleLabel = "";
  if (role === UserRole.ADMIN) {
    roleLabel = "ผู้ดูแลระบบ";
  } else if (role === UserRole.STAFF) {
    roleLabel = "พนักงาน";
  }

  const handleLogout = () => {
    logout();
    messageApi.success(TH.COMMON.SUCCESS);
  };

  return (
    <>
      {contextHolder}
      <div className="settings-container">
        <Title level={4} className="settings-title">
          {TH.SETTINGS.TITLE}
        </Title>

        {/* User Profile Section */}
        <Card className="glass-card settings-card">
          <Space size={16} align="start">
            <Avatar size={64} icon={<UserOutlined />} />
            <div>
              <Title level={5} className="user-profile-title">
                {user?.email?.split("@")[0] || "User"}
              </Title>
              <Text className="user-profile-email">
                {user?.email}
              </Text>
              <div style={{ marginTop: 8 }}>
                <Text className="user-role-badge">
                  {roleLabel}
                </Text>
              </div>
            </div>
          </Space>
        </Card>

        {/* About Section */}
        <Card
          className="glass-card settings-card"
          title={
            <Space>
              <InfoCircleOutlined />
              <span>{TH.SETTINGS.ABOUT}</span>
            </Space>
          }
        >
          <Space orientation="vertical" size={4}>
            <Text className="about-text">
              <strong>ReadyStock</strong> - ระบบจัดการคลังสินค้า
            </Text>
            <Text className="about-subtext">
              Version 1.0.0
            </Text>
            <Text className="about-subtext">
              © 2026 ReadyStock. All rights reserved.
            </Text>
          </Space>
        </Card>

        <Divider className="settings-divider" />

        {/* Logout Button */}
        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          size="large"
          block
        >
          {TH.SETTINGS.LOGOUT}
        </Button>
      </div>
    </>
  );
};

export default SettingsView;
