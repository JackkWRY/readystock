import { useEffect, useState } from "react";
import { ConfigProvider, Spin, theme } from "antd";
import { useAuthStore } from "./store/authStore";
import { LoginView } from "./features/auth/LoginView";
import { DashboardLayout, type MenuKey } from "./features/dashboard/DashboardLayout";
import { InventoryView } from "./features/inventory/InventoryView";
import { TransactionsView } from "./features/transactions/TransactionsView";
import { HistoryView } from "./features/transactions/HistoryView";

import { SettingsView } from "./features/settings/SettingsView";

function App() {
  const { user, isLoading, initialize } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState<MenuKey>("inventory");

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Render content based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case "inventory":
        return <InventoryView />;
      case "transactions":
        return <TransactionsView />;
      case "history":
        return <HistoryView />;
      case "settings":
        return <SettingsView />;
      default:
        return <InventoryView />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#00ACC1",
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          colorBgContainer: "rgba(255, 255, 255, 0.08)",
          colorBgElevated: "rgba(22, 33, 62, 0.95)",
          colorBorder: "rgba(255, 255, 255, 0.15)",
        },
        components: {
          Card: {
            colorBgContainer: "transparent",
          },
          Input: {
            colorBgContainer: "rgba(255, 255, 255, 0.06)",
          },
          Button: {
            primaryShadow: "0 4px 12px rgba(0, 172, 193, 0.4)",
          },
          Table: {
            colorBgContainer: "transparent",
            headerBg: "rgba(255, 255, 255, 0.04)",
            rowHoverBg: "rgba(255, 255, 255, 0.06)",
          },
          Modal: {
            contentBg: "rgba(22, 33, 62, 0.95)",
            headerBg: "transparent",
          },
          Tabs: {
            cardBg: "rgba(255, 255, 255, 0.04)",
          },
        },
      }}
    >
      {isLoading ? (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large">
            <div style={{ padding: 50, textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
              กำลังโหลด...
            </div>
          </Spin>
        </div>
      ) : user ? (
        <DashboardLayout activeMenu={activeMenu} onMenuChange={setActiveMenu}>
          {renderContent()}
        </DashboardLayout>
      ) : (
        <LoginView />
      )}
    </ConfigProvider>
  );
}

export default App;
