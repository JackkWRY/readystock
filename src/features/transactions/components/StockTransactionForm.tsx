import { Form, Select, InputNumber, Input, Button, message, Card, Space, Typography } from "antd";
import { SendOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useItems } from "../../inventory/hooks/useItems";
import { useCreateTransaction, useWithdrawItem } from "../hooks/useTransactions";
import { useAuthStore } from "../../../store/authStore";
import type { Item } from "../../../types/inventory";

const { Text } = Typography;
const { TextArea } = Input;

interface StockTransactionFormProps {
  type: "in" | "out";
}

export const StockTransactionForm: React.FC<StockTransactionFormProps> = ({ type }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useAuthStore();

  const { data: items = [], isLoading: itemsLoading } = useItems();
  const createTransaction = useCreateTransaction();
  const withdrawItem = useWithdrawItem();

  const isLoading = createTransaction.isPending || withdrawItem.isPending;

  const selectedItemId = Form.useWatch("item_id", form);
  const selectedItem = items.find((item) => item.id === selectedItemId);

  const handleSubmit = async (values: { item_id: number; quantity: number; note?: string }) => {
    try {
      if (type === "in") {
        await createTransaction.mutateAsync({
          itemId: values.item_id,
          amount: values.quantity,
          userEmail: user?.email || undefined,
          note: values.note,
        });
        messageApi.success(`รับสินค้าเข้าคลัง ${values.quantity} ชิ้น สำเร็จ`);
      } else {
        await withdrawItem.mutateAsync({
          itemId: values.item_id,
          amount: values.quantity,
          userEmail: user?.email || undefined,
          note: values.note,
        });
        messageApi.success(`เบิกสินค้า ${values.quantity} ชิ้น สำเร็จ`);
      }

      form.resetFields();
    } catch (error) {
      if (error instanceof Error) {
        messageApi.error(error.message);
      } else {
        messageApi.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const filterOption = (input: string, option?: { label: string; value: number }) => {
    return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  };

  return (
    <>
      {contextHolder}
      <Card
        className="glass-card"
        title={
          <Space>
            {type === "in" ? <PlusCircleOutlined /> : <SendOutlined />}
            <span>{type === "in" ? "รับสินค้าเข้าคลัง" : "เบิกสินค้าออก"}</span>
          </Space>
        }
        style={{ maxWidth: 600 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ quantity: 1 }}
        >
          <Form.Item
            name="item_id"
            label="เลือกสินค้า"
            rules={[{ required: true, message: "กรุณาเลือกสินค้า" }]}
          >
            <Select
              showSearch
              placeholder="ค้นหาและเลือกสินค้า..."
              loading={itemsLoading}
              filterOption={filterOption}
              options={items.map((item: Item) => ({
                value: item.id,
                label: `${item.name}${item.category ? ` (${item.category})` : ""}`,
              }))}
            />
          </Form.Item>

          {selectedItem && (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <Space orientation="vertical" size={4}>
                <Text style={{ color: "rgba(255,255,255,0.6)" }}>
                  คงเหลือ:{" "}
                  <Text
                    strong
                    style={{
                      color:
                        selectedItem.quantity <= selectedItem.min_quantity
                          ? "#faad14"
                          : "#52c41a",
                    }}
                  >
                    {selectedItem.quantity} ชิ้น
                  </Text>
                </Text>
                {selectedItem.category && (
                  <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                    หมวดหมู่: {selectedItem.category}
                  </Text>
                )}
              </Space>
            </div>
          )}

          <Form.Item
            name="quantity"
            label="จำนวน"
            rules={[
              { required: true, message: "กรุณากรอกจำนวน" },
              {
                type: "number",
                min: 1,
                message: "จำนวนต้องมากกว่า 0",
              },
              ...(type === "out" && selectedItem
                ? [
                    {
                      type: "number" as const,
                      max: selectedItem.quantity,
                      message: `ไม่สามารถเบิกเกินจำนวนคงเหลือ (${selectedItem.quantity})`,
                    },
                  ]
                : []),
            ]}
          >
            <InputNumber
              min={1}
              max={type === "out" ? selectedItem?.quantity : undefined}
              style={{ width: "100%" }}
              placeholder="กรอกจำนวน"
            />
          </Form.Item>

          <Form.Item name="note" label="หมายเหตุ (ไม่บังคับ)">
            <TextArea rows={2} placeholder="ระบุหมายเหตุหรือเหตุผล..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={type === "in" ? <PlusCircleOutlined /> : <SendOutlined />}
              block
              size="large"
              style={{
                background: type === "in" ? "#52c41a" : undefined,
              }}
            >
              {type === "in" ? "รับเข้าคลัง" : "เบิกออก"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default StockTransactionForm;
