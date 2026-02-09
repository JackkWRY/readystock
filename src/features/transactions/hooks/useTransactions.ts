import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import type { Transaction, CreateTransactionInput } from "../../../types/inventory";

const TRANSACTIONS_QUERY_KEY = ["transactions"];
const ITEMS_QUERY_KEY = ["items"];

// Transaction with item details
export interface TransactionWithItem extends Transaction {
  items?: {
    name: string;
    sku: string;
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

      // Get unique item IDs
      const itemIds = [...new Set(transactions.map((tx) => tx.item_id))];

      // Fetch item details
      const { data: itemsData, error: itemsError } = await supabase
        .from("items")
        .select("id, name, sku")
        .in("id", itemIds);

      if (itemsError) throw itemsError;

      // Create a lookup map
      const itemsMap = new Map(
        (itemsData || []).map((item) => [item.id, { name: item.name, sku: item.sku }])
      );

      // Merge transaction with item details
      return transactions.map((tx) => ({
        ...tx,
        items: itemsMap.get(tx.item_id) || undefined,
      }));
    },
  });
};

// Create transaction (for stock in)
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTransactionInput): Promise<Transaction> => {
      // First, create the transaction record
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .insert(input)
        .select()
        .single();

      if (txError) throw txError;

      // Then update the item quantity
      if (input.type === "in") {
        const { error: updateError } = await supabase.rpc("increment_item_quantity", {
          p_item_id: input.item_id,
          p_quantity: input.quantity,
        });
        
        // Fallback: direct update if RPC doesn't exist
        if (updateError) {
          const { data: item } = await supabase
            .from("items")
            .select("quantity")
            .eq("id", input.item_id)
            .single();
          
          if (item) {
            await supabase
              .from("items")
              .update({ 
                quantity: item.quantity + input.quantity,
                updated_at: new Date().toISOString()
              })
              .eq("id", input.item_id);
          }
        }
      }

      return transaction;
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
      quantity,
      note,
      performedBy,
    }: {
      itemId: string;
      quantity: number;
      note?: string;
      performedBy?: string;
    }): Promise<void> => {
      // Try using the RPC function first
      const { error: rpcError } = await supabase.rpc("withdraw_item", {
        p_item_id: itemId,
        p_quantity: quantity,
        p_note: note || null,
        p_performed_by: performedBy || null,
      });

      if (rpcError) {
        // Fallback: manual transaction if RPC fails
        // Check current quantity
        const { data: item, error: fetchError } = await supabase
          .from("items")
          .select("quantity")
          .eq("id", itemId)
          .single();

        if (fetchError) throw fetchError;
        if (!item) throw new Error("Item not found");
        if (item.quantity < quantity) throw new Error("Insufficient stock");

        // Create transaction record
        const { error: txError } = await supabase.from("transactions").insert({
          item_id: itemId,
          type: "out",
          quantity: quantity,
          note: note || null,
          performed_by: performedBy || null,
        });

        if (txError) throw txError;

        // Update item quantity
        const { error: updateError } = await supabase
          .from("items")
          .update({
            quantity: item.quantity - quantity,
            updated_at: new Date().toISOString(),
          })
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
