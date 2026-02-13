import React, { useState } from "react";
import { Card, Typography, Space, Select } from "antd";
import { useTransactions } from "./hooks/useTransactions";
import { TransactionTable } from "./components/TransactionTable";
import { TransactionType } from "../../constants/inventory";
import { useTranslation } from "../../hooks/useTranslation";
import "./styles/HistoryView.css";

const { Title } = Typography;

export const HistoryView: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all" | 'CREATE'>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  // useTransactions hook now handles fetching based on these params
  const { data, isLoading } = useTransactions({ 
    page, 
    pageSize, 
    filter: typeFilter 
  });

  // Extract data and count safely
  const transactions = data?.data || [];
  const total = data?.count || 0;

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleFilterChange = (value: TransactionType | "all" | 'CREATE') => {
    setTypeFilter(value);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="history-container">
      <Space direction="vertical" size="large" className="history-content">
        <div className="history-header">
          <Title level={4} className="history-title">
            {t.TRANSACTION.HISTORY}
          </Title>

          <Space>
            <Select
              value={typeFilter}
              onChange={handleFilterChange}
              className="history-filter"
              options={[
                { value: "all", label: t.TRANSACTION.ALL },
                { value: TransactionType.RECEIVE, label: t.TRANSACTION.TYPES.RECEIVE },
                { value: TransactionType.WITHDRAW, label: t.TRANSACTION.TYPES.WITHDRAW },
                { value: TransactionType.UPDATE, label: t.TRANSACTION.TYPES.UPDATE },
                { value: 'CREATE', label: t.TRANSACTION.TYPES.CREATE },
                { value: TransactionType.DELETE, label: t.TRANSACTION.TYPES.DELETE },
              ]}
            />
          </Space>
        </div>

        <Card className="glass-card">
          <TransactionTable 
            transactions={transactions} 
            loading={isLoading}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </Card>
      </Space>
    </div>
  );
};

export default HistoryView;
