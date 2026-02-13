import { useState, useMemo } from "react";
import { Button, Input, message, Typography } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { Item } from "../../types/inventory";
import { useItems, useDeleteItem } from "./hooks/useItems";
import { ItemFormModal } from "./components/ItemFormModal";
import { InventoryTable } from "./components/InventoryTable";
import { TH } from "../../constants/th";
import "./styles/InventoryView.css";
import { handleError } from "../../utils/errorHandler";

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
      messageApi.success(TH.COMMON.SUCCESS);
    } catch (error) {
      handleError(error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditItem(null);
  };

  return (
    <>
      {contextHolder}
      <div className="inventory-header">
        <div className="inventory-title-row">
          <Title level={4} className="inventory-title">
            {TH.INVENTORY.TITLE}
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            {TH.INVENTORY.ADD_ITEM}
          </Button>
        </div>

        <Input
          placeholder={TH.INVENTORY.SEARCH}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="inventory-search"
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
