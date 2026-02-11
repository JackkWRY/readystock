import { Form, message } from "antd";
import { useItems } from "../../inventory/hooks/useItems";
import { useReceiveItem, useWithdrawItem } from "./useTransactions";
import { useAuthStore } from "../../../store/authStore";
import { TransactionType } from "../../../constants/inventory";

interface UseStockTransactionFormProps {
  type: TransactionType;
  onSuccess?: () => void;
}

export const useStockTransactionForm = ({ type, onSuccess }: UseStockTransactionFormProps) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useAuthStore();

  const { data: items = [], isLoading: itemsLoading } = useItems();
  const receiveItem = useReceiveItem();
  const withdrawItem = useWithdrawItem();

  const isLoading = receiveItem.isPending || withdrawItem.isPending;

  const selectedItemId = Form.useWatch("item_id", form);
  const selectedItem = items.find((item) => item.id === selectedItemId);

  const handleSubmit = async (values: { item_id: number; quantity: number; note?: string }) => {
    try {
      if (type === TransactionType.RECEIVE) {
        await receiveItem.mutateAsync({
          itemId: values.item_id,
          amount: values.quantity,
          userEmail: user?.email || undefined,
          note: values.note,
        });
        messageApi.success(`รับสินค้าเข้าคลัง ${values.quantity} ชิ้น สำเร็จ`);
      } else if (type === TransactionType.WITHDRAW) {
        await withdrawItem.mutateAsync({
          itemId: values.item_id,
          amount: values.quantity,
          userEmail: user?.email || undefined,
          note: values.note,
        });
        messageApi.success(`เบิกสินค้า ${values.quantity} ชิ้น สำเร็จ`);
      }

      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
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

  return {
    form,
    items,
    itemsLoading,
    selectedItem,
    isLoading,
    contextHolder,
    handleSubmit,
    filterOption,
  };
};
