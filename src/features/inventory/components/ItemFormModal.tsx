import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import type { Item, CreateItemInput } from "../../../types/inventory";
import { useCreateItem, useUpdateItem } from "../hooks/useItems";

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
        messageApi.success("แก้ไขสินค้าสำเร็จ");
      } else {
        await createItem.mutateAsync(values);
        messageApi.success("เพิ่มสินค้าสำเร็จ");
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
        title={isEditing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        open={open}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={isEditing ? "บันทึก" : "เพิ่มสินค้า"}
        cancelText="ยกเลิก"
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
            min_quantity: 0,
          }}
        >
          <Form.Item
            name="name"
            label="ชื่อสินค้า"
            rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า" }]}
          >
            <Input placeholder="เช่น สกรูหัวกลม 3 นิ้ว" />
          </Form.Item>

          <Form.Item
            name="sku"
            label="รหัสสินค้า (SKU)"
            rules={[{ required: true, message: "กรุณากรอกรหัสสินค้า" }]}
          >
            <Input placeholder="เช่น SCR-001" />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item
              name="quantity"
              label="จำนวนคงเหลือ"
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
              label="จำนวนขั้นต่ำ (แจ้งเตือน)"
              rules={[{ required: true, message: "กรุณากรอกจำนวนขั้นต่ำ" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="0"
              />
            </Form.Item>
          </div>

          <Form.Item name="category" label="หมวดหมู่">
            <Input placeholder="เช่น อุปกรณ์ช่าง" />
          </Form.Item>

          <Form.Item name="location" label="ตำแหน่งจัดเก็บ">
            <Input placeholder="เช่น ชั้น A-01" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ItemFormModal;
