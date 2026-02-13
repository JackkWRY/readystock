import React from "react";
import { Tabs, Typography } from "antd";
import { PlusCircleOutlined, SendOutlined } from "@ant-design/icons";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionType } from "../../constants/inventory";
import { useTranslation } from "../../hooks/useTranslation";
import "./styles/TransactionsView.css";

const { Title } = Typography;

export const TransactionsView: React.FC = () => {
  const { t } = useTranslation();

  const tabItems = [
    {
      key: "in",
      label: (
        <span>
          <PlusCircleOutlined /> {t.TRANSACTION.RECEIVE}
        </span>
      ),
      children: <TransactionForm type={TransactionType.RECEIVE} />,
    },
    {
      key: "out",
      label: (
        <span>
          <SendOutlined /> {t.TRANSACTION.WITHDRAW}
        </span>
      ),
      children: <TransactionForm type={TransactionType.WITHDRAW} />,
    },
  ];

  return (
    <div className="transactions-container">
      <Title level={4} className="transactions-title">
        {t.TRANSACTION.TITLE}
      </Title>

      <div className="transactions-card">
        <Tabs
          defaultActiveKey="in"
          items={tabItems}
          type="card"
          className="glass-tabs"
        />
      </div>
    </div>
  );
};

export default TransactionsView;
