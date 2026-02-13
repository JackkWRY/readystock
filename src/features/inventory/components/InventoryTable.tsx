import React from "react";
import { Table, Button, Space, Tag, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { Item } from "../../../types/inventory";
import { TableSkeleton } from "../../../components/common/TableSkeleton";
import { useTranslation } from "../../../hooks/useTranslation";

interface InventoryTableProps {
  items: Item[];
  loading: boolean;
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const { t } = useTranslation();

  const columns: ColumnsType<Item> = [
    {
      title: t.INVENTORY.NAME,
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record) => (
        <Space>
          <span className="text-medium">{name}</span>
          {record.quantity <= record.min_quantity && (
            <WarningOutlined style={{ color: "#faad14" }} />
          )}
        </Space>
      ),
    },
    {
      title: t.INVENTORY.CATEGORY,
      dataIndex: "category",
      key: "category",
      width: 160,
      render: (cat: string | null) => cat || "-",
    },
    {
      title: t.INVENTORY.QUANTITY,
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "center",
      sorter: (a, b) => a.quantity - b.quantity,
      render: (qty: number, record) => (
        <Tag color={qty <= record.min_quantity ? "warning" : "success"}>
          {qty}
        </Tag>
      ),
    },
    {
      title: t.INVENTORY.MIN_QUANTITY,
      dataIndex: "min_quantity",
      key: "min_quantity",
      width: 100,
      align: "center",
    },
    {
      title: t.TRANSACTION.ACTION,
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          />
          <Popconfirm
            title={t.INVENTORY.DELETE_ITEM}
            description={t.INVENTORY.CONFIRM_DELETE}
            onConfirm={() => onDelete(record.id)}
            okText={t.COMMON.CONFIRM}
            cancelText={t.COMMON.CANCEL}
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
              loading={isDeleting}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <TableSkeleton columns={columns} rowCount={5} />;
  }

  return (
    <Table
      columns={columns}
      dataSource={items}
      rowKey="id"
      loading={false}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `${t.DASHBOARD.TOTAL_ITEMS} ${total} ${t.INVENTORY.UNIT}`,
      }}
      className="inventory-table"
    />
  );
};
