import { Button, Result, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

interface GlobalErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const GlobalErrorFallback: React.FC<GlobalErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a", // Dark background to match theme
        padding: 20,
      }}
    >
      <Result
        status="error"
        title={
          <Text style={{ color: "#fff", fontSize: 24 }}>
            อุ๊ปส์! เกิดข้อผิดพลาดที่ไม่คาดคิด
          </Text>
        }
        subTitle={
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <Paragraph style={{ color: "rgba(255,255,255,0.8)", marginBottom: 20 }}>
              ขออภัยในความไม่สะดวก ระบบเกิดข้อผิดพลาดในการทำงาน
              กรุณาลองรีโหลดหน้าเว็บใหม่อีกครั้ง
            </Paragraph>
            <div
              style={{
                background: "rgba(0,0,0,0.3)",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "20px",
                textAlign: "left",
                fontFamily: "monospace",
                color: "#ff4d4f",
                overflow: "auto",
                maxHeight: "150px",
              }}
            >
              {error.message}
            </div>
          </div>
        }
        extra={[
          <Button
            key="reload"
            type="primary"
            icon={<ReloadOutlined />}
            onClick={resetErrorBoundary}
            size="large"
          >
            รีโหลดหน้าเว็บ
          </Button>,
        ]}
      />
    </div>
  );
};
