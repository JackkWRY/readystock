import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import type { Item, CreateItemInput } from "../../../types/inventory";
import { useCreateItem, useUpdateItem } from "../hooks/useItems";
import { handleError } from "../../../utils/errorHandler";
import { useTranslation } from "../../../hooks/useTranslation";
import "../styles/ItemFormModal.css";

interface ItemFormModalProps {
  open: boolean;
  onClose: () => void;
  editItem?: Item | null;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  open,
  onClose,
  editItem,
}) => {
  const [form] = Form.useForm<CreateItemInput>();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();

  const createItem = useCreateItem();
  const updateItem = useUpdateItem();

  const isEditing = !!editItem;
  const isLoading = createItem.isPending || updateItem.isPending;

  useEffect(() => {
    if (open && editItem) {
      form.setFieldsValue(editItem);
    } else if (open) {
      form.resetFields();
    }
  }, [open, editItem, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing && editItem) {
        await updateItem.mutateAsync({ id: editItem.id, ...values });
        messageApi.success(t.COMMON.SUCCESS);
      } else {
        await createItem.mutateAsync(values);
        messageApi.success(t.COMMON.SUCCESS);
      }

      onClose();
      form.resetFields();
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={isEditing ? t.INVENTORY.EDIT_ITEM : t.INVENTORY.ADD_ITEM}
        open={open}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={t.COMMON.CONFIRM}
        cancelText={t.COMMON.CANCEL}
        confirmLoading={isLoading}
        destroyOnHidden
        className="glass-modal"
        width={520}
      >
        <Form
          form={form}
          layout="vertical"
          className="item-form-modal-content"
          initialValues={{
            quantity: 0,
            min_quantity: 5,
          }}
        >
          <Form.Item
            name="name"
            label={t.INVENTORY.NAME}
            rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า" }]}
          >
            <Input placeholder={t.INVENTORY.PLACEHOLDERS.NAME} />
          </Form.Item>

          <Form.Item name="category" label={t.INVENTORY.CATEGORY}>
            <Input placeholder={t.INVENTORY.PLACEHOLDERS.CATEGORY} />
          </Form.Item>

          <div className="item-form-grid">
            <Form.Item
              name="quantity"
              label={t.INVENTORY.QUANTITY}
              rules={[{ required: true, message: "กรุณากรอกจำนวน" }]}
            >
              <InputNumber
                min={0}
                className="item-form-input-number"
                placeholder="0"
              />
            </Form.Item>

            <Form.Item
              name="min_quantity"
              label={t.INVENTORY.MIN_QUANTITY}
              rules={[{ required: true, message: "กรุณากรอกจำนวนขั้นต่ำ" }]}
            >
              <InputNumber
                min={0}
                className="item-form-input-number"
                placeholder="5"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ItemFormModal;
