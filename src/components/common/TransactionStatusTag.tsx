import React from "react";
import { Tag } from "antd";
import {
  PlusCircleOutlined,
  SendOutlined,
  SyncOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { TransactionType } from "../../constants/inventory";

interface TransactionStatusTagProps {
  type: string;
}

const typeConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  [TransactionType.RECEIVE]: { color: "success", icon: <PlusCircleOutlined />, label: "รับเข้า" },
  [TransactionType.WITHDRAW]: { color: "error", icon: <SendOutlined />, label: "เบิกออก" },
  [TransactionType.UPDATE]: { color: "processing", icon: <SyncOutlined />, label: "ปรับยอด" },
  [TransactionType.DELETE]: { color: "red", icon: <DeleteOutlined />, label: "ลบสินค้า" },
  'CREATE': { color: "cyan", icon: <AppstoreAddOutlined />, label: "สร้างสินค้า" },
};

export const TransactionStatusTag: React.FC<TransactionStatusTagProps> = ({ type }) => {
  const config = typeConfig[type];

  if (!config) {
    return <Tag>{type}</Tag>;
  }

  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
};
