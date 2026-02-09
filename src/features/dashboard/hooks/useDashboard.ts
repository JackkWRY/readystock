import { useMemo } from "react";
import { useItems } from "../../inventory/hooks/useItems";
import { useTransactions } from "../../transactions/hooks/useTransactions";

interface DashboardStats {
  totalItems: number;
  totalQuantity: number;
  lowStockCount: number;
  recentTransactionsCount: number;
}

interface UseDashboardReturn {
  stats: DashboardStats;
  lowStockItems: ReturnType<typeof useItems>["data"];
  recentTransactions: ReturnType<typeof useTransactions>["data"];
  isLoading: boolean;
}

/**
 * Custom hook for dashboard data and statistics
 * Aggregates data from inventory and transactions
 */
export const useDashboard = (): UseDashboardReturn => {
  const { data: items = [], isLoading: itemsLoading } = useItems();
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions(5);

  const stats = useMemo<DashboardStats>(() => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockCount = items.filter(
      (item) => item.quantity <= item.min_quantity
    ).length;
    const recentTransactionsCount = transactions.length;

    return {
      totalItems,
      totalQuantity,
      lowStockCount,
      recentTransactionsCount,
    };
  }, [items, transactions]);

  const lowStockItems = useMemo(() => {
    return items.filter((item) => item.quantity <= item.min_quantity);
  }, [items]);

  return {
    stats,
    lowStockItems,
    recentTransactions: transactions,
    isLoading: itemsLoading || transactionsLoading,
  };
};

export default useDashboard;
