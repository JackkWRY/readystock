import React from "react";
import { Row, Col, Card, Statistic, Table, Typography, Tag, Space } from "antd";
import {
  ShopOutlined,
  WarningOutlined,
  SwapOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

import { useDashboard } from "./hooks/useDashboard";
import { useTranslation } from "../../hooks/useTranslation";
import "./DashboardView.css";
import { TransactionStatusTag } from "../../components/common/TransactionStatusTag";
import { formatDate } from "../../utils/dateUtils";

const { Title, Text } = Typography;

export const DashboardView: React.FC = () => {
  const { stats, lowStockItems, recentTransactions, isLoading } = useDashboard();
  const { t, currentLanguage } = useTranslation();

  return (
    <div className="dashboard-container">
      <Title level={4} className="dashboard-title">
        {t.DASHBOARD.OVERVIEW}
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading} className="glass-card">
            <Statistic
              title={t.DASHBOARD.TOTAL_ITEMS}
              value={stats.totalItems}
              prefix={<DatabaseOutlined />}
              suffix={t.INVENTORY.UNIT}
              valueStyle={{ color: "var(--text-color)" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading} className="glass-card">
            <Statistic
              title={t.DASHBOARD.TOTAL_QUANTITY}
              value={stats.totalQuantity}
              prefix={<ShopOutlined />}
              suffix={t.INVENTORY.UNIT}
              valueStyle={{ color: "var(--text-color)" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading} className="glass-card">
            <Statistic
              title={t.DASHBOARD.LOW_STOCK}
              value={stats.lowStockCount}
              prefix={<WarningOutlined />}
              suffix={t.INVENTORY.UNIT}
              valueStyle={{ color: "var(--error-color)" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading} className="glass-card">
            <Statistic
              title={t.DASHBOARD.RECENT_TRANSACTIONS}
              value={stats.recentTransactionsCount}
              prefix={<SwapOutlined />}
              suffix={t.INVENTORY.UNIT}
              valueStyle={{ color: "var(--text-color)" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Low Stock Items */}
        <Col xs={24} lg={12}>
          <Card 
            title={<Space><WarningOutlined style={{ color: "#faad14" }} /> {t.DASHBOARD.LOW_STOCK}</Space>}
            className="glass-card"
            loading={isLoading}
          >
            <Table
              dataSource={lowStockItems}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ y: 300 }}
              columns={[
                { title: t.INVENTORY.NAME, dataIndex: "name" },
                { 
                  title: t.INVENTORY.QUANTITY, 
                  dataIndex: "quantity",
                  render: (qty, record) => (
                    <Tag color="error">{qty} / {record.min_quantity}</Tag>
                  )
                },
              ]}
            />
          </Card>
        </Col>

        {/* Recent Transactions */}
        <Col xs={24} lg={12}>
          <Card 
            title={<Space><SwapOutlined /> {t.DASHBOARD.RECENT_TRANSACTIONS}</Space>}
            className="glass-card"
            loading={isLoading}
          >
             <Table
              dataSource={recentTransactions}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ y: 300 }}
              columns={[
                { 
                  title: t.TRANSACTION.DATE, 
                  dataIndex: "created_at",
                  width: 140,
                  render: (date) => formatDate(date, currentLanguage)
                },
                { 
                  title: t.TRANSACTION.TYPE, 
                  key: "action",
                  render: (_, record) => (
                    <Space>
                        <TransactionStatusTag type={record.action_type} />
                        <Text>{record.items?.name || (record.note?.includes("ลบสินค้า") ? "สินค้าถูกลบ" : "-")}</Text>
                    </Space>
                  )
                },
                {
                    title: t.TRANSACTION.AMOUNT,
                    dataIndex: "amount",
                    align: "right",
                    width: 80,
                    render: (val) => (
                        <Text type={val > 0 ? "success" : "danger"}>
                            {val > 0 ? "+" : ""}{val}
                        </Text>
                    )
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
