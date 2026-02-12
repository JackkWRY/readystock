import { useState, useMemo } from "react";
import { Button, Input, message, Typography } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { Item } from "../../types/inventory";
import { useItems, useDeleteItem } from "./hooks/useItems";
import { ItemFormModal } from "./components/ItemFormModal";
import { InventoryTable } from "./components/InventoryTable";

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

      <InventoryTable 
        items={filteredItems} 
        loading={isLoading} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        isDeleting={deleteItem.isPending}
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
