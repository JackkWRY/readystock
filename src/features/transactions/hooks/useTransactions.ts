import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../../../services/transactionService";
import { QUERY_KEYS } from "../../../constants/inventory";
import type { Transaction } from "../../../types/inventory";

// Define locally
export interface TransactionWithItem extends Transaction {
  items?: {
    name: string;
  };
}

// Fetch transactions with joined item details
export const useTransactions = ({
  page = 1,
  pageSize = 10,
  filter = "all",
}: {
  page?: number;
  pageSize?: number;
  filter?: string;
} = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TRANSACTIONS, { page, pageSize, filter }],
    queryFn: async () => {
      const { data, count } = await transactionService.getAll({ page, pageSize, filter });
      
      // Define the shape of the data returned by the join query
      type TransactionResponse = Transaction & {
        items: { name: string } | null;
      };
      
      const transactions = data as unknown as TransactionResponse[];

      // Formatting matches original hook logic
      const formattedData = transactions.map((tx) => ({
        ...tx,
        items: tx.items ? { name: tx.items.name } : undefined,
      }));

      return { data: formattedData as TransactionWithItem[], count };
    },
  });
};

// Receive item (Stock In) using RPC
export const useReceiveItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { itemId: number; amount: number; userEmail?: string; note?: string }) =>
      transactionService.receiveItem(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS });
    },
  });
};

// Withdraw item using Supabase RPC
export const useWithdrawItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { itemId: number; amount: number; userEmail?: string; note?: string }) =>
      transactionService.withdrawItem(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS });
    },
  });
};
