import { useEffect } from "react";
import { ConfigProvider, Spin } from "antd";
import { useAuthStore } from "./store/authStore";
import { appTheme } from "./styles/theme";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app/routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GlobalErrorFallback } from "./components/GlobalErrorFallback";

function App() {
  const { isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ConfigProvider theme={appTheme}>
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
            <AppRoutes />
          </BrowserRouter>
        )}
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default App;
