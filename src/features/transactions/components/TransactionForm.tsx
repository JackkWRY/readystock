import { Form, Select, InputNumber, Input, Button, Card, Space, Typography } from "antd";
import { SendOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useStockTransactionForm } from "../hooks/useStockTransactionForm";
import { TransactionType } from "../../../constants/inventory";
import type { Item } from "../../../types/inventory";
import { useTranslation } from "../../../hooks/useTranslation";
import "./styles/TransactionForm.css";

const { Text } = Typography;
const { TextArea } = Input;

interface TransactionFormProps {
  type: TransactionType;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ type }) => {
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
  const { t } = useTranslation();

  const isReceive = type === TransactionType.RECEIVE;
  const isWithdraw = type === TransactionType.WITHDRAW;

  return (
    <>
      {contextHolder}
      <Card
        className="glass-card transaction-card"
        title={
          <Space>
            {isReceive ? <PlusCircleOutlined /> : <SendOutlined />}
            <span>{isReceive ? t.TRANSACTION.RECEIVE_TITLE : t.TRANSACTION.WITHDRAW_TITLE}</span>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ quantity: 1 }}
        >
          <Form.Item
            name="item_id"
            label={t.TRANSACTION.SELECT_ITEM}
            rules={[{ required: true, message: "กรุณาเลือกสินค้า" }]}
          >
            <Select
              showSearch
              placeholder={t.INVENTORY.SEARCH}
              loading={itemsLoading}
              filterOption={filterOption}
              options={items.map((item: Item) => ({
                value: item.id,
                label: `${item.name}${item.category ? ` (${item.category})` : ""}`,
              }))}
            />
          </Form.Item>

          {selectedItem && (
            <div className="item-details-container">
              <Space orientation="vertical" size={4}>
                <Text className="item-details-label">
                  คงเหลือ:{" "}
                  <Text
                    className={`item-quantity-text ${
                      selectedItem.quantity <= selectedItem.min_quantity
                        ? "item-quantity-warning"
                        : "item-quantity-success"
                    }`}
                  >
                    {selectedItem.quantity} {t.INVENTORY.UNIT}
                  </Text>
                </Text>
                {selectedItem.category && (
                  <Text className="item-category-text">
                    {t.INVENTORY.CATEGORY}: {selectedItem.category}
                  </Text>
                )}
              </Space>
            </div>
          )}

          <Form.Item
            name="quantity"
            label={t.TRANSACTION.AMOUNT}
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
              placeholder={t.TRANSACTION.AMOUNT}
            />
          </Form.Item>

          <Form.Item name="note" label={t.TRANSACTION.NOTE_OPTIONAL}>
            <TextArea rows={2} placeholder={t.TRANSACTION.NOTE_PLACEHOLDER} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={isReceive ? <PlusCircleOutlined /> : <SendOutlined />}
              block
              size="large"
              className={isReceive ? "submit-btn-receive" : ""}
            >
              {isReceive ? t.TRANSACTION.SUBMIT_RECEIVE : t.TRANSACTION.SUBMIT_WITHDRAW}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default TransactionForm;
