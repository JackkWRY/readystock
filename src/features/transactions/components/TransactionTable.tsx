import React, { useMemo } from "react";
import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { TransactionType } from "../../../constants/inventory";
import type { TransactionWithItem } from "../hooks/useTransactions";
import { TransactionStatusTag } from "../../../components/common/TransactionStatusTag";
import { useTranslation } from "../../../hooks/useTranslation";
import { formatDate } from "../../../utils/dateUtils";

const { Text } = Typography;

interface TransactionTableProps {
  transactions: TransactionWithItem[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
}) => {
  const { t, currentLanguage } = useTranslation();

  const columns: ColumnsType<TransactionWithItem> = useMemo(
    () => [
      {
        title: t.TRANSACTION.DATE,
        dataIndex: "created_at",
        key: "created_at",
        width: 180,
        render: (date: string) => formatDate(date, currentLanguage),
      },
      {
        title: t.TRANSACTION.ACTION,
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
        title: t.TRANSACTION.TYPE,
        dataIndex: "action_type",
        key: "action_type",
        width: 120,
        align: "center",
        render: (type: string) => <TransactionStatusTag type={type} />,
      },
      {
        title: t.TRANSACTION.AMOUNT,
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
        title: t.TRANSACTION.NOTE,
        dataIndex: "note",
        key: "note",
        ellipsis: true,
        render: (note: string | null) => note || "-",
      },
      {
        title: t.TRANSACTION.USER,
        dataIndex: "user_email",
        key: "user_email",
        width: 200,
        ellipsis: true,
        render: (email: string | null) => email?.split("@")[0] || "-",
      },
    ],
    [t, currentLanguage]
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
        showTotal: (total) => `${t.COMMON.ALL} ${total} ${t.INVENTORY.UNIT}`, 
      }}
      scroll={{ x: 800 }}
      style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
      }}
    />
  );
};
