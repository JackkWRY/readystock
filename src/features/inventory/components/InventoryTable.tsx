import React from "react";
import { Table, Button, Space, Tag, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { Item } from "../../../types/inventory";

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
      title: "ชื่อสินค้า",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record) => (
        <Space>
          <span style={{ fontWeight: 500 }}>{name}</span>
          {record.quantity <= record.min_quantity && (
            <WarningOutlined style={{ color: "#faad14" }} />
          )}
        </Space>
      ),
    },
    {
      title: "หมวดหมู่",
      dataIndex: "category",
      key: "category",
      width: 160,
      render: (cat: string | null) => cat || "-",
    },
    {
      title: "คงเหลือ",
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
      title: "ขั้นต่ำ",
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
            title="ยืนยันการลบ"
            description="คุณต้องการลบสินค้านี้หรือไม่?"
            onConfirm={() => onDelete(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
              loading={isDeleting} // Note: This might show loading on all delete buttons if mostly global, but for row-specific we would need id tracking. For now simpler.
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={items}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `ทั้งหมด ${total} รายการ`,
      }}
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 12,
      }}
    />
  );
};
