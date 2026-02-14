import { theme, ThemeConfig } from "antd";

export const appTheme: ThemeConfig = {
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
};
