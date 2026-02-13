import { useEffect } from "react";
import { ConfigProvider, Spin, theme } from "antd";
import { useAuthStore } from "./store/authStore";
import { LoginView } from "./features/auth/LoginView";
import { DashboardLayout } from "./features/dashboard/DashboardLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardView } from "./features/dashboard/DashboardView";
import { InventoryView } from "./features/inventory/InventoryView";
import { TransactionsView } from "./features/transactions/TransactionsView";
import { HistoryView } from "./features/transactions/HistoryView";

import { SettingsView } from "./features/settings/SettingsView";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GlobalErrorFallback } from "./components/GlobalErrorFallback";

function App() {
  const { user, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

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
      <ErrorBoundary fallback={GlobalErrorFallback}>
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
        ) : (
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={user ? <Navigate to="/" replace /> : <LoginView />} 
              />

              {/* Protected Routes */}
              <Route 
                path="/" 
                element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}
              >
                <Route index element={<DashboardView />} />
                <Route path="inventory" element={<InventoryView />} />
                <Route path="transactions" element={<TransactionsView />} />
                <Route path="history" element={<HistoryView />} />
                <Route path="settings" element={<SettingsView />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        )}
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default App;
