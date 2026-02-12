import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import type { Item, CreateItemInput } from "../../../types/inventory";
import { TransactionType, QUERY_KEYS } from "../../../constants/inventory";

// Fetch all items
export const useItems = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ITEMS,
    queryFn: async (): Promise<Item[]> => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("is_deleted", false)
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

// Create new item
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateItemInput): Promise<Item> => {
      const { data, error } = await supabase
        .from("items")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
    },
  });
};

// Update existing item
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<Item> & { id: number }): Promise<Item> => {
      // Fetch old item to compare quantity
      const { data: oldItem } = await supabase
        .from("items")
        .select("quantity, name")
        .eq("id", id)
        .single();

      const { data, error } = await supabase
        .from("items")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Log UPDATE transaction only if quantity changed
      if (oldItem && input.quantity !== undefined && oldItem.quantity !== input.quantity) {
        const diff = input.quantity - oldItem.quantity;
        await supabase.from("transactions").insert({
          item_id: id,
          action_type: TransactionType.UPDATE,
          amount: diff,
          note: `แก้ไขจำนวนจาก ${oldItem.quantity} เป็น ${input.quantity}`,
          user_email: (await supabase.auth.getUser()).data.user?.email || "system",
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
    },
  });
};

// Delete item
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      // Get item details before soft-deleting
      const { data: item, error: fetchError } = await supabase
        .from("items")
        .select("name, quantity")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Soft delete: mark as deleted
      const { error } = await supabase
        .from("items")
        .update({ is_deleted: true, deleted_at: new Date().toISOString(), quantity: 0 })
        .eq("id", id);

      if (error) throw error;

      // Insert DELETE transaction record
      await supabase.from("transactions").insert({
        item_id: id,
        action_type: TransactionType.DELETE,
        amount: -(item?.quantity || 0),
        note: `ลบสินค้า: ${item?.name || 'unknown'}`,
        user_email: (await supabase.auth.getUser()).data.user?.email || 'system',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
    },
  });
};
