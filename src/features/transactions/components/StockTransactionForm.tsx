import { Form, Select, InputNumber, Input, Button, Card, Space, Typography } from "antd";
import { SendOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useStockTransactionForm } from "../hooks/useStockTransactionForm";
import { TransactionType } from "../../../constants/inventory";
import type { Item } from "../../../types/inventory";

const { Text } = Typography;
const { TextArea } = Input;

interface StockTransactionFormProps {
  type: TransactionType;
}

export const StockTransactionForm: React.FC<StockTransactionFormProps> = ({ type }) => {
  const {
    form,
    items,
    itemsLoading,
    selectedItem,
    isLoading,
    contextHolder,
    handleSubmit,
    filterOption,
  } = useStockTransactionForm({ type });

  const isReceive = type === TransactionType.RECEIVE;
  const isWithdraw = type === TransactionType.WITHDRAW;

  return (
    <>
      {contextHolder}
      <Card
        className="glass-card"
        title={
          <Space>
            {isReceive ? <PlusCircleOutlined /> : <SendOutlined />}
            <span>{isReceive ? "รับสินค้าเข้าคลัง" : "เบิกสินค้าออก"}</span>
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
              ...(isWithdraw && selectedItem
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
              max={isWithdraw ? selectedItem?.quantity : undefined}
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
              icon={isReceive ? <PlusCircleOutlined /> : <SendOutlined />}
              block
              size="large"
              style={{
                background: isReceive ? "#52c41a" : undefined,
              }}
            >
              {isReceive ? "รับเข้าคลัง" : "เบิกออก"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default StockTransactionForm;
