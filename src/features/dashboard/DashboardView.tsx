import React from "react";
import { Row, Col, Card, Statistic, Table, Typography, Tag, Space } from "antd";
import {
  ShopOutlined,
  WarningOutlined,
  SwapOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDashboard } from "./hooks/useDashboard";
import { TH } from "../../constants/th";
import "./DashboardView.css";
import { TransactionStatusTag } from "../../components/common/TransactionStatusTag";

const { Title, Text } = Typography;

export const DashboardView: React.FC = () => {
  const { stats, lowStockItems, recentTransactions, isLoading } = useDashboard();

  return (
    <div className="dashboard-container">
      <Title level={4} className="dashboard-title">
        {TH.DASHBOARD.OVERVIEW}
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading} className="glass-card">
            <Statistic
              title="สินค้าทั้งหมด"
              value={stats.totalItems}
              prefix={<DatabaseOutlined />}
              suffix="รายการ"
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading} className="glass-card">
            <Statistic
              title="จำนวนชิ้นรวม"
              value={stats.totalQuantity}
              prefix={<ShopOutlined />}
              suffix="ชิ้น"
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading} className="glass-card">
            <Statistic
              title="สินค้าใกล้หมด"
              value={stats.lowStockCount}
              prefix={<WarningOutlined />}
              suffix="รายการ"
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading} className="glass-card">
            <Statistic
              title="รายการเคลื่อนไหว (5 ล่าสุด)"
              value={stats.recentTransactionsCount}
              prefix={<SwapOutlined />}
              suffix="รายการ"
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Low Stock Items */}
        <Col xs={24} lg={12}>
          <Card 
            title={<Space><WarningOutlined style={{ color: "#faad14" }} /> {TH.DASHBOARD.LOW_STOCK}</Space>}
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
                { title: TH.INVENTORY.NAME, dataIndex: "name" },
                { 
                  title: TH.INVENTORY.QUANTITY, 
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
            title={<Space><SwapOutlined /> {TH.DASHBOARD.RECENT_TRANSACTIONS}</Space>}
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
                  title: TH.TRANSACTION.DATE, 
                  dataIndex: "created_at",
                  width: 140,
                  render: (date) => dayjs(date).format("D MMM BB HH:mm")
                },
                { 
                  title: TH.TRANSACTION.TYPE, 
                  key: "action",
                  render: (_, record) => (
                    <Space>
                        <TransactionStatusTag type={record.action_type} />
                        <Text>{record.items?.name || (record.note?.includes("ลบสินค้า") ? "สินค้าถูกลบ" : "-")}</Text>
                    </Space>
                  )
                },
                {
                    title: TH.TRANSACTION.AMOUNT,
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
