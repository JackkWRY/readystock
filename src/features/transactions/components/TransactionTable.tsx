import React, { useMemo } from "react";
import { Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { 
  PlusCircleOutlined,
  SendOutlined,
  SyncOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { TransactionType } from "../../../constants/inventory";
import type { TransactionWithItem } from "../hooks/useTransactions";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const { Text } = Typography;

interface TransactionTableProps {
  transactions: TransactionWithItem[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
}

const typeConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  [TransactionType.RECEIVE]: { color: "success", icon: <PlusCircleOutlined />, label: "รับเข้า" },
  [TransactionType.WITHDRAW]: { color: "error", icon: <SendOutlined />, label: "เบิกออก" },
  [TransactionType.UPDATE]: { color: "processing", icon: <SyncOutlined />, label: "ปรับยอด" },
  [TransactionType.DELETE]: { color: "red", icon: <DeleteOutlined />, label: "ลบสินค้า" },
  'CREATE': { color: "cyan", icon: <AppstoreAddOutlined />, label: "สร้างสินค้า" },
};

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
}) => {
  const columns: ColumnsType<TransactionWithItem> = useMemo(
    () => [
      {
        title: "วันที่/เวลา",
        dataIndex: "created_at",
        key: "created_at",
        width: 180,
        render: (date: string) =>
          dayjs(date).format("D MMM BB HH:mm น."),
      },
      {
        title: "รายการ",
        key: "item",
        render: (_, record) => {
          if (record.items?.name) {
            return <Text strong>{record.items.name}</Text>;
          }
          if (record.action_type === TransactionType.DELETE && record.note) {
             const match = record.note.match(/ลบสินค้า:\s*(.+)/);
             return <Text delete type="secondary">{match?.[1] || record.note}</Text>;
          }
           return <Text disabled>-</Text>;
        },
      },
      {
        title: "ประเภท",
        dataIndex: "action_type",
        key: "action_type",
        width: 120,
        align: "center",
        render: (type: string) => {
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
        align: "right",
        width: 100,
        render: (amount: number, record) => {
          const type = record.action_type;
          const isPositive = amount > 0;
          let color: "success" | "warning" | "danger" | "secondary" | undefined = undefined;

          if (type === TransactionType.RECEIVE || type === 'CREATE') {
             color = "success";
          } else if (type === TransactionType.WITHDRAW || type === TransactionType.DELETE) {
             color = "danger";
          }

          return (
            <Text type={color} strong>
              {isPositive ? "+" : ""}
              {amount}
            </Text>
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
        width: 200,
        ellipsis: true,
        render: (email: string | null) => email?.split("@")[0] || "-",
      },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      dataSource={transactions}
      rowKey="id"
      loading={loading}
      pagination={{ 
        current: page,
        pageSize: pageSize,
        total: total,
        onChange: onPageChange,
        showSizeChanger: true,
        showTotal: (total) => `ทั้งหมด ${total} รายการ`, 
      }}
      scroll={{ x: 800 }}
      style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
      }}
    />
  );
};
