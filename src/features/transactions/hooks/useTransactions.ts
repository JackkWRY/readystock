import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import type { Transaction } from "../../../types/inventory";

const TRANSACTIONS_QUERY_KEY = ["transactions"];
const ITEMS_QUERY_KEY = ["items"];

// Transaction with item details
export interface TransactionWithItem extends Transaction {
  items?: {
    name: string;
  };
}

// Fetch all transactions with item details
export const useTransactions = (limit?: number) => {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, { limit }],
    queryFn: async (): Promise<TransactionWithItem[]> => {
      // Fetch transactions
      let query = supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data: transactions, error: txError } = await query;
      if (txError) throw txError;
      if (!transactions || transactions.length === 0) return [];

      // Get unique item IDs (filter out null for deleted items)
      const itemIds = [...new Set(transactions.map((tx) => tx.item_id).filter((id): id is number => id !== null))];

      // Fetch item details (only if there are valid IDs)
      let itemsMap = new Map<number, { name: string }>();
      if (itemIds.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("id, name")
          .in("id", itemIds);

        if (itemsError) throw itemsError;

        itemsMap = new Map(
          (itemsData || []).map((item) => [item.id, { name: item.name }])
        );
      }

      // Merge transaction with item details
      return transactions.map((tx) => ({
        ...tx,
        items: tx.item_id ? itemsMap.get(tx.item_id) || undefined : undefined,
      }));
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
      const { error } = await supabase.rpc("receive_item", {
        t_item_id: itemId,
        t_amount: amount,
        t_user_email: userEmail || null,
        t_note: note || null,
      });

      if (error) {
        // Fallback: manual transaction if RPC fails (e.g. function doesn't exist yet)
        console.warn("RPC receive_item failed, falling back to manual update:", error);

        // 1. Create transaction record
        const { error: txError } = await supabase
          .from("transactions")
          .insert({
            item_id: itemId,
            action_type: "RECEIVE",
            amount: amount,
            user_email: userEmail || null,
            note: note || null,
          });

        if (txError) throw txError;

        // 2. Update item quantity
        const { data: item } = await supabase
          .from("items")
          .select("quantity")
          .eq("id", itemId)
          .single();

        if (item) {
          const { error: updateError } = await supabase
            .from("items")
            .update({ quantity: item.quantity + amount })
            .eq("id", itemId);
            
          if (updateError) throw updateError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
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
      const { error: rpcError } = await supabase.rpc("withdraw_item", {
        t_item_id: itemId,
        t_amount: amount,
        t_user_email: userEmail || null,
        t_note: note || null,
      });

      if (rpcError) {
        // Fallback: manual transaction if RPC fails
        const { data: item, error: fetchError } = await supabase
          .from("items")
          .select("quantity")
          .eq("id", itemId)
          .single();

        if (fetchError) throw fetchError;
        if (!item) throw new Error("Item not found");
        if (item.quantity < amount) throw new Error("จำนวนอุปกรณ์ในสต็อกไม่เพียงพอ");

        // Create transaction record
        const { error: txError } = await supabase.from("transactions").insert({
          item_id: itemId,
          action_type: "WITHDRAW",
          amount: -amount,
          user_email: userEmail || null,
          note: note || null,
        });

        if (txError) throw txError;

        // Update item quantity
        const { error: updateError } = await supabase
          .from("items")
          .update({ quantity: item.quantity - amount })
          .eq("id", itemId);

        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
};
