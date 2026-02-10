import { useState } from "react";
import { Table, Tag, Select, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusCircleOutlined,
  SendOutlined,
  SyncOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTransactions, type TransactionWithItem } from "./hooks/useTransactions";
import type { TransactionType } from "../../types/inventory";
import dayjs from "dayjs";

const { Title } = Typography;

const typeConfig: Record<TransactionType, { color: string; icon: React.ReactNode; label: string }> = {
  RECEIVE: { color: "success", icon: <PlusCircleOutlined />, label: "รับเข้า" },
  WITHDRAW: { color: "error", icon: <SendOutlined />, label: "เบิกออก" },
  UPDATE: { color: "processing", icon: <SyncOutlined />, label: "ปรับยอด" },
  CREATE: { color: "cyan", icon: <AppstoreAddOutlined />, label: "สร้างสินค้า" },
  DELETE: { color: "red", icon: <DeleteOutlined />, label: "ลบสินค้า" },
};

export const HistoryView: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const { data: transactions = [], isLoading } = useTransactions();

  const filteredTransactions = typeFilter === "all"
    ? transactions
    : transactions.filter((tx) => tx.action_type === typeFilter);

  const columns: ColumnsType<TransactionWithItem> = [
    {
      title: "วันที่-เวลา",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "สินค้า",
      key: "item",
      render: (_, record) => {
        if (record.items?.name) {
          return <span style={{ fontWeight: 500 }}>{record.items.name}</span>;
        }
        // For deleted items (item_id = null), extract name from note
        if (record.action_type === "DELETE" && record.note) {
          const match = record.note.match(/ลบสินค้า:\s*(.+)/);
          return <span style={{ fontWeight: 500, textDecoration: "line-through", opacity: 0.6 }}>{match?.[1] || record.note}</span>;
        }
        return <span style={{ opacity: 0.5 }}>-</span>;
      },
    },
    {
      title: "ประเภท",
      dataIndex: "action_type",
      key: "action_type",
      width: 120,
      align: "center",
      render: (type: TransactionType) => {
        const config = typeConfig[type];
        return config ? (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        ) : (
          <Tag>{type}</Tag>
        );
      },
    },
    {
      title: "จำนวน",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      align: "center",
      render: (amount: number, record) => {
        const colorMap: Record<string, string> = {
          RECEIVE: "#52c41a",
          CREATE: "#13c2c2",
          WITHDRAW: "#ff4d4f",
          DELETE: "#ff4d4f",
          UPDATE: "#1890ff",
        };
        return (
          <span
            style={{
              fontWeight: 600,
              color: colorMap[record.action_type] || "#1890ff",
            }}
          >
            {amount > 0 ? `+${amount}` : amount}
          </span>
        );
      },
    },
    {
      title: "หมายเหตุ",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
      render: (note: string | null) => note || "-",
    },
    {
      title: "ผู้ทำรายการ",
      dataIndex: "user_email",
      key: "user_email",
      width: 160,
      render: (email: string | null) => email?.split("@")[0] || "-",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ margin: 0, color: "#fff" }}>
          ประวัติการทำรายการ
        </Title>

        <Space>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 140 }}
            options={[
              { value: "all", label: "ทั้งหมด" },
              { value: "RECEIVE", label: "รับเข้า" },
              { value: "WITHDRAW", label: "เบิกออก" },
              { value: "UPDATE", label: "ปรับยอด" },
              { value: "CREATE", label: "สร้างสินค้า" },
              { value: "DELETE", label: "ลบสินค้า" },
            ]}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTransactions}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          showTotal: (total) => `ทั้งหมด ${total} รายการ`,
        }}
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
        }}
      />
    </div>
  );
};

export default HistoryView;
