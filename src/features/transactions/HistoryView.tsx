import React, { useState } from "react";
import { Card, Typography, Space, Select } from "antd";
import { useTransactions } from "./hooks/useTransactions";
import { TransactionTable } from "./components/TransactionTable";
import { TransactionType } from "../../constants/inventory";

const { Title } = Typography;

export const HistoryView: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all" | 'CREATE'>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#fff" }}>
            ประวัติการทำรายการ
          </Title>

          <Space>
            <Select
              value={typeFilter}
              onChange={handleFilterChange}
              style={{ width: 140 }}
              options={[
                { value: "all", label: "ทั้งหมด" },
                { value: TransactionType.RECEIVE, label: "รับเข้า" },
                { value: TransactionType.WITHDRAW, label: "เบิกออก" },
                { value: TransactionType.UPDATE, label: "ปรับยอด" },
                { value: 'CREATE', label: "สร้างสินค้า" },
                { value: TransactionType.DELETE, label: "ลบสินค้า" },
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
