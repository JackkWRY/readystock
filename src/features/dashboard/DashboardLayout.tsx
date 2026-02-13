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
import { UserRole } from "../../constants/inventory";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { TH } from "../../constants/th";
import "./DashboardLayout.css";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, role, logout } = useAuthStore();
  const { data: items = [] } = useItems();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active menu key from location
  const activeMenu = useMemo(() => {
    const path = location.pathname.substring(1); // remove leading slash
    if (!path) return "dashboard";
    return path.split("/")[0]; // handle nested routes if any
  }, [location.pathname]);

  // Count low stock items
  const lowStockCount = useMemo(() => {
    return items.filter((item) => item.quantity <= item.min_quantity).length;
  }, [items]);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "dashboard") {
      navigate("/");
    } else {
      navigate(`/${key}`);
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: TH.SETTINGS.LOGOUT,
      danger: true,
      onClick: logout,
    },
  ];

  const menuItems: MenuProps["items"] = [
    {
      key: "dashboard",
      icon: <AppstoreOutlined />,
      label: TH.DASHBOARD.TITLE,
    },
    {
      key: "inventory",
      icon: <ShopOutlined />,
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {TH.INVENTORY.TITLE}
          {lowStockCount > 0 && (
            <Badge
              count={lowStockCount}
              size="small"
              style={{ backgroundColor: "var(--warning-color)" }}
            />
          )}
        </span>
      ),
    },
    {
      key: "transactions",
      icon: <SwapOutlined />,
      label: TH.TRANSACTION.TITLE,
    },
    {
      key: "history",
      icon: <HistoryOutlined />,
      label: TH.TRANSACTION.HISTORY,
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: TH.SETTINGS.TITLE,
    },
  ];

  let roleLabel = "";
  if (role === UserRole.ADMIN) {
    roleLabel = "ผู้ดูแลระบบ";
  } else if (role === UserRole.STAFF) {
    roleLabel = "พนักงาน";
  }

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
        <Content className="dashboard-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default DashboardLayout;
