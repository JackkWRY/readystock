import { Table, Skeleton } from "antd";
import type { ColumnsType } from "antd/es/table";

interface TableSkeletonProps<T = Record<string, unknown>> {
  columns: ColumnsType<T>;
  rowCount?: number;
}

export const TableSkeleton = <T extends object = Record<string, unknown>>({
  columns,
  rowCount = 5,
}: TableSkeletonProps<T>) => {
  const skeletonData = Array.from({ length: rowCount }).map((_, i) => ({
    key: i,
  })) as unknown as T[]; // Cast to T[] since we only need keys for skeleton rows

  const skeletonColumns = columns.map((col) => ({
    ...col,
    render: () => <Skeleton.Input style={{ width: "100%" }} active size="small" />,
  }));

  return (
    <Table
      columns={skeletonColumns}
      dataSource={skeletonData}
      pagination={false}
      rowKey="key"
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 12,
      }}
    />
  );
};
