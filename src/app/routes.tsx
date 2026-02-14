import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { DashboardLayout } from "../features/dashboard/DashboardLayout";
import { Spin } from "antd";

// Lazy Load Pages for Performance (Code Splitting)
const LoginView = lazy(() => import("../features/auth/LoginView").then(module => ({ default: module.LoginView })));
const DashboardView = lazy(() => import("../features/dashboard/DashboardView").then(module => ({ default: module.DashboardView })));
const InventoryView = lazy(() => import("../features/inventory/InventoryView").then(module => ({ default: module.InventoryView })));
const TransactionsView = lazy(() => import("../features/transactions/TransactionsView").then(module => ({ default: module.TransactionsView })));
const HistoryView = lazy(() => import("../features/transactions/HistoryView").then(module => ({ default: module.HistoryView })));
const SettingsView = lazy(() => import("../features/settings/SettingsView").then(module => ({ default: module.SettingsView })));

// Loading Component
const PageLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
    <Spin size="large" />
  </div>
);

export const AppRoutes = () => {
  const { user } = useAuthStore();

  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
};
