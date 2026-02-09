import { useState, useMemo } from "react";
import { Layout, Menu, Avatar, Dropdown, Typography, Badge } from "antd";
import type { MenuProps } from "antd";
import {
  ShopOutlined,
  AppstoreOutlined,
  SwapOutlined,
  HistoryOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/authStore";
import { useItems } from "../inventory/hooks/useItems";
import "./DashboardLayout.css";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export type MenuKey = "inventory" | "transactions" | "history" | "settings";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeMenu?: MenuKey;
  onMenuChange?: (key: MenuKey) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeMenu = "inventory",
  onMenuChange,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, role, logout } = useAuthStore();
  const { data: items = [] } = useItems();

  // Count low stock items
  const lowStockCount = useMemo(() => {
    return items.filter((item) => item.quantity <= item.min_quantity).length;
  }, [items]);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    onMenuChange?.(key as MenuKey);
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "ออกจากระบบ",
      danger: true,
      onClick: logout,
    },
  ];

  const menuItems: MenuProps["items"] = [
    {
      key: "inventory",
      icon: <AppstoreOutlined />,
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          คลังสินค้า
          {lowStockCount > 0 && (
            <Badge
              count={lowStockCount}
              size="small"
              style={{ backgroundColor: "#faad14" }}
            />
          )}
        </span>
      ),
    },
    {
      key: "transactions",
      icon: <SwapOutlined />,
      label: "เบิก-รับสินค้า",
    },
    {
      key: "history",
      icon: <HistoryOutlined />,
      label: "ประวัติ",
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "ตั้งค่า",
    },
  ];

  const roleLabel = role === "admin" ? "ผู้ดูแลระบบ" : "พนักงาน";

  return (
    <Layout className="dashboard-layout">
      <Sider
        className={`dashboard-sider ${collapsed ? "sider-collapsed" : ""}`}
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={80}
      >
        {/* Logo */}
        <div className="sider-logo">
          <ShopOutlined className="sider-logo-icon" />
          <span className="sider-logo-text">ReadyStock</span>
        </div>

        {/* Menu */}
        <Menu
          className="dashboard-menu"
          mode="inline"
          selectedKeys={[activeMenu]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header className="dashboard-header">
          <div className="header-left">
            {collapsed ? (
              <MenuUnfoldOutlined
                className="sider-trigger"
                onClick={() => setCollapsed(false)}
              />
            ) : (
              <MenuFoldOutlined
                className="sider-trigger"
                onClick={() => setCollapsed(true)}
              />
            )}
          </div>

          <div className="header-right">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="header-user-info">
                <Avatar size="small" icon={<UserOutlined />} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text className="header-user-name">
                    {user?.email?.split("@")[0] || "User"}
                  </Text>
                  <Text className="header-user-role">{roleLabel}</Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content className="dashboard-content">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
