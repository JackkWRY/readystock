import React from "react";
import { Table, Button, Space, Tag, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { Item } from "../../../types/inventory";
import { TH } from "../../../constants/th";
import { TableSkeleton } from "../../../components/common/TableSkeleton";

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
  const columns: ColumnsType<Item> = [
    {
      title: TH.INVENTORY.NAME,
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
      title: TH.INVENTORY.CATEGORY,
      dataIndex: "category",
      key: "category",
      width: 160,
      render: (cat: string | null) => cat || "-",
    },
    {
      title: TH.INVENTORY.QUANTITY,
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
      title: TH.INVENTORY.MIN_QUANTITY,
      dataIndex: "min_quantity",
      key: "min_quantity",
      width: 100,
      align: "center",
    },
    {
      title: "จัดการ",
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
            title={TH.INVENTORY.DELETE_ITEM}
            description={TH.INVENTORY.CONFIRM_DELETE}
            onConfirm={() => onDelete(record.id)}
            okText={TH.COMMON.CONFIRM}
            cancelText={TH.COMMON.CANCEL}
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
        showTotal: (total) => `${TH.DASHBOARD.TOTAL_ITEMS} ${total} รายการ`,
      }}
      className="inventory-table"
    />
  );
};
