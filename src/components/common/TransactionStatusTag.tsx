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
import { useTranslation } from "../../hooks/useTranslation";

interface TransactionStatusTagProps {
  type: string;
}

export const TransactionStatusTag: React.FC<TransactionStatusTagProps> = ({ type }) => {
  const { t } = useTranslation();

  const getConfig = (type: string) => {
    switch (type) {
      case TransactionType.RECEIVE:
        return { color: "success", icon: <PlusCircleOutlined />, label: t.TRANSACTION.TYPES.RECEIVE };
      case TransactionType.WITHDRAW:
        return { color: "error", icon: <SendOutlined />, label: t.TRANSACTION.TYPES.WITHDRAW };
      case TransactionType.UPDATE:
        return { color: "processing", icon: <SyncOutlined />, label: t.TRANSACTION.TYPES.UPDATE };
      case TransactionType.DELETE:
        return { color: "red", icon: <DeleteOutlined />, label: t.TRANSACTION.TYPES.DELETE };
      case 'CREATE':
        return { color: "cyan", icon: <AppstoreAddOutlined />, label: t.TRANSACTION.TYPES.CREATE };
      default:
        return null;
    }
  };

  const config = getConfig(type);

  if (!config) {
    return <Tag>{type}</Tag>;
  }

  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
};
