import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import type { Item, CreateItemInput } from "../../../types/inventory";
import { useCreateItem, useUpdateItem } from "../hooks/useItems";
import { TH } from "../../../constants/th";

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
        messageApi.success(TH.COMMON.SUCCESS);
      } else {
        await createItem.mutateAsync(values);
        messageApi.success(TH.COMMON.SUCCESS); // Or specific success message
      }

      onClose();
      form.resetFields();
    } catch (error) {
      if (error instanceof Error) {
        messageApi.error(error.message);
      }
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
        title={isEditing ? TH.INVENTORY.EDIT_ITEM : TH.INVENTORY.ADD_ITEM}
        open={open}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={TH.COMMON.CONFIRM}
        cancelText={TH.COMMON.CANCEL}
        confirmLoading={isLoading}
        destroyOnHidden
        className="glass-modal"
        width={520}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 24 }}
          initialValues={{
            quantity: 0,
            min_quantity: 5,
          }}
        >
          <Form.Item
            name="name"
            label={TH.INVENTORY.NAME}
            rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า" }]}
          >
            <Input placeholder="เช่น สกรูหัวกลม 3 นิ้ว" />
          </Form.Item>

          <Form.Item name="category" label={TH.INVENTORY.CATEGORY}>
            <Input placeholder="เช่น อุปกรณ์ช่าง" />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item
              name="quantity"
              label={TH.INVENTORY.QUANTITY}
              rules={[{ required: true, message: "กรุณากรอกจำนวน" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="0"
              />
            </Form.Item>

            <Form.Item
              name="min_quantity"
              label={TH.INVENTORY.MIN_QUANTITY}
              rules={[{ required: true, message: "กรุณากรอกจำนวนขั้นต่ำ" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
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
