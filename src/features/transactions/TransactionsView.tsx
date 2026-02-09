import { Tabs, Typography } from "antd";
import { PlusCircleOutlined, SendOutlined } from "@ant-design/icons";
import { StockTransactionForm } from "./components/StockTransactionForm";

const { Title } = Typography;

export const TransactionsView: React.FC = () => {
  const tabItems = [
    {
      key: "in",
      label: (
        <span>
          <PlusCircleOutlined /> รับเข้า
        </span>
      ),
      children: <StockTransactionForm type="in" />,
    },
    {
      key: "out",
      label: (
        <span>
          <SendOutlined /> เบิกออก
        </span>
      ),
      children: <StockTransactionForm type="out" />,
    },
  ];

  return (
    <div>
      <Title level={4} style={{ margin: "0 0 24px", color: "#fff" }}>
        เบิก-รับสินค้า
      </Title>

      <Tabs
        defaultActiveKey="in"
        items={tabItems}
        type="card"
        style={{
          background: "rgba(255,255,255,0.03)",
          padding: 16,
          borderRadius: 12,
        }}
      />
    </div>
  );
};

export default TransactionsView;
