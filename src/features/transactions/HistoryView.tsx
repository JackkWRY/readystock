import { useState } from "react";
import { Table, Tag, Select, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusCircleOutlined,
  SendOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useTransactions, type TransactionWithItem } from "./hooks/useTransactions";
import type { TransactionType } from "../../types/inventory";
import dayjs from "dayjs";

const { Title } = Typography;

const typeConfig: Record<TransactionType, { color: string; icon: React.ReactNode; label: string }> = {
  in: { color: "success", icon: <PlusCircleOutlined />, label: "รับเข้า" },
  out: { color: "error", icon: <SendOutlined />, label: "เบิกออก" },
  adjust: { color: "processing", icon: <SyncOutlined />, label: "ปรับยอด" },
};

export const HistoryView: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const { data: transactions = [], isLoading } = useTransactions();

  const filteredTransactions = typeFilter === "all"
    ? transactions
    : transactions.filter((tx) => tx.type === typeFilter);

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
      render: (_, record) => (
        <Space orientation="vertical" size={0}>
          <span style={{ fontWeight: 500 }}>{record.items?.name || "-"}</span>
          <Tag color="blue" style={{ fontFamily: "monospace", fontSize: 11 }}>
            {record.items?.sku || "-"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      key: "type",
      width: 120,
      align: "center",
      render: (type: TransactionType) => {
        const config = typeConfig[type];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "center",
      render: (qty: number, record) => (
        <span
          style={{
            fontWeight: 600,
            color: record.type === "in" ? "#52c41a" : record.type === "out" ? "#ff4d4f" : "#1890ff",
          }}
        >
          {record.type === "in" ? "+" : record.type === "out" ? "-" : ""}
          {qty}
        </span>
      ),
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
      dataIndex: "performed_by",
      key: "performed_by",
      width: 160,
      render: (user: string | null) => user?.split("@")[0] || "-",
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
              { value: "in", label: "รับเข้า" },
              { value: "out", label: "เบิกออก" },
              { value: "adjust", label: "ปรับยอด" },
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
