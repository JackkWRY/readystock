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
import { useTranslation } from "../../hooks/useTranslation";
import { LanguageSwitcher } from "../../components/common/LanguageSwitcher";
import "./SettingsView.css";

const { Title, Text } = Typography;

export const SettingsView: React.FC = () => {
  const { user, role, logout } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();

  const roleLabel = role === UserRole.ADMIN ? t.SETTINGS.ROLES.ADMIN : t.SETTINGS.ROLES.STAFF;

  const handleLogout = () => {
    logout();
    messageApi.success(t.COMMON.SUCCESS);
  };

  return (
    <>
      {contextHolder}
      <div className="settings-container">
        <Title level={4} className="settings-title">
          {t.SETTINGS.TITLE}
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

        {/* Language Section */}
        <Card
          className="glass-card settings-card"
          title={
            <Space>
              <InfoCircleOutlined />
              <span>{t.SETTINGS.LANGUAGE}</span>
            </Space>
          }
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text>เลือกภาษา / Select Language</Text>
            <LanguageSwitcher />
          </div>
        </Card>

        {/* About Section */}
        <Card
          className="glass-card settings-card"
          title={
            <Space>
              <InfoCircleOutlined />
              <span>{t.SETTINGS.ABOUT}</span>
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
          {t.SETTINGS.LOGOUT}
        </Button>
      </div>
    </>
  );
};

export default SettingsView;
