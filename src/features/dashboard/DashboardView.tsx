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
import { TransactionType } from "../../constants/inventory";

const { Title, Text } = Typography;

export const DashboardView: React.FC = () => {
  const { stats, lowStockItems, recentTransactions, isLoading } = useDashboard();

  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 24, color: "#fff" }}>
        ภาพรวมระบบ
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
            title={<Space><WarningOutlined style={{ color: "#faad14" }} /> สินค้าใกล้หมดสต็อก</Space>}
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
                { title: "ชื่อสินค้า", dataIndex: "name" },
                { 
                  title: "คงเหลือ", 
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
            title={<Space><SwapOutlined /> การเคลื่อนไหวล่าสุด</Space>}
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
                  title: "เวลา", 
                  dataIndex: "created_at",
                  width: 140,
                  render: (date) => dayjs(date).format("D MMM BB HH:mm")
                },
                { 
                  title: "รายการ", 
                  key: "action",
                  render: (_, record) => {
                    let color = "default";
                    // let icon = null; // Unused
                    let text: string = record.action_type;

                    if (record.action_type === TransactionType.RECEIVE) {
                        color = "success";
                        text = "รับเข้า";
                    } else if (record.action_type === TransactionType.WITHDRAW) {
                        color = "error";
                        text = "เบิกออก";
                    } else if (record.action_type === TransactionType.UPDATE) {
                        color = "processing";
                        text = "ปรับยอด";
                    } else if (record.action_type === 'CREATE') {
                        color = "cyan";
                        text = "สร้างใหม่";
                    }

                    return (
                        <Space>
                            <Tag color={color}>{text}</Tag>
                            <Text>{record.items?.name || (record.note?.includes("ลบสินค้า") ? "สินค้าถูกลบ" : "-")}</Text>
                        </Space>
                    )
                  }
                },
                {
                    title: "จำนวน",
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
