import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import type { Database } from "../../../types/supabase";
import type { Transaction } from "../../../types/inventory";
import { handleManualTransaction } from "../services/transactionService";
import { TransactionType, QUERY_KEYS } from "../../../constants/inventory";

// Transaction with item details
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
    queryFn: async (): Promise<{ data: TransactionWithItem[]; count: number }> => {
      let query = supabase
        .from("transactions")
        .select("*, items(name)", { count: "exact" })
        .order("created_at", { ascending: false });

      // Apply filter
      if (filter && filter !== "all") {
        // Cast filter to the specific enum type defined in Supabase schema
        type TransactionTypeEnum = Database["public"]["Enums"]["transaction_type"];
        query = query.eq("action_type", filter as TransactionTypeEnum);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;
      
      // Define the shape of the data returned by the join query
      type TransactionWithJoinedItem = Transaction & {
        items: { name: string } | null;
      };

      // Cast data to the correct type
      const transactions = (data || []) as unknown as TransactionWithJoinedItem[];

      const formattedData = transactions.map((tx) => ({
        ...tx,
        items: tx.items ? { name: tx.items.name } : undefined,
      }));

      return { data: formattedData, count: count || 0 };
    },
  });
};

// Receive item (Stock In) using RPC
export const useReceiveItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      amount,
      userEmail,
      note,
    }: {
      itemId: number;
      amount: number;
      userEmail?: string;
      note?: string;
    }): Promise<void> => {
      // Best practice: Explicitly type the arguments using the generated Supabase types
      type ReceiveItemArgs = Database["public"]["Functions"]["receive_item"]["Args"];
      
      const args: ReceiveItemArgs = {
        t_item_id: itemId,
        t_amount: amount,
        t_user_email: userEmail || null,
        t_note: note || null,
      };

      const { error } = await supabase.rpc("receive_item", args);

      if (error) {
        await handleManualTransaction({
          itemId,
          amount,
          userEmail,
          note,
          type: TransactionType.RECEIVE,
        });
      }
    },
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
    mutationFn: async ({
      itemId,
      amount,
      userEmail,
      note,
    }: {
      itemId: number;
      amount: number;
      userEmail?: string;
      note?: string;
    }): Promise<void> => {
      // Try using the RPC function first (matches DB schema)
      type WithdrawItemArgs = Database["public"]["Functions"]["withdraw_item"]["Args"];
      
      const args: WithdrawItemArgs = {
        t_item_id: itemId,
        t_amount: amount,
        t_user_email: userEmail || null,
        t_note: note || null,
      };

      const { error: rpcError } = await supabase.rpc("withdraw_item", args);

      if (rpcError) {
        await handleManualTransaction({
          itemId,
          amount,
          userEmail,
          note,
          type: TransactionType.WITHDRAW,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS });
    },
  });
};
