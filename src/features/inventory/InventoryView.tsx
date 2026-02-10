import { useState, useMemo } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Popconfirm,
  message,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { Item } from "../../types/inventory";
import { useItems, useDeleteItem } from "./hooks/useItems";
import { ItemFormModal } from "./components/ItemFormModal";

const { Title } = Typography;

export const InventoryView: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);

  const { data: items = [], isLoading } = useItems();
  const deleteItem = useDeleteItem();
  const [messageApi, contextHolder] = message.useMessage();

  // Filter items by search text
  const filteredItems = useMemo(() => {
    if (!searchText.trim()) return items;
    const lowerSearch = searchText.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.category?.toLowerCase().includes(lowerSearch)
    );
  }, [items, searchText]);

  const handleEdit = (item: Item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteItem.mutateAsync(id);
      messageApi.success("ลบสินค้าสำเร็จ");
    } catch (error) {
      if (error instanceof Error) {
        messageApi.error(error.message);
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditItem(null);
  };

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
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="ยืนยันการลบ"
            description="คุณต้องการลบสินค้านี้หรือไม่?"
            onConfirm={() => handleDelete(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
              loading={deleteItem.isPending}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#fff" }}>
            คลังสินค้า
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            เพิ่มสินค้า
          </Button>
        </div>

        <Input
          placeholder="ค้นหาสินค้า..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 320 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredItems}
        rowKey="id"
        loading={isLoading}
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

      <ItemFormModal
        open={modalOpen}
        onClose={handleModalClose}
        editItem={editItem}
      />
    </>
  );
};

export default InventoryView;
