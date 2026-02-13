import { supabase } from '../lib/supabaseClient';
import { Item, CreateItemInput } from '../types/inventory';
import { TransactionType } from '../constants/inventory';

export const inventoryService = {
  // Fetch all active items
  getAll: async (): Promise<Item[]> => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('is_deleted', false)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get single item by ID
  getById: async (id: number): Promise<Item | null> => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new item
  create: async (input: CreateItemInput): Promise<Item> => {
    const { data, error } = await supabase
      .from('items')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update item
  update: async (id: number, input: Partial<Item>): Promise<Item> => {
    // 1. Fetch old item to compare (for transaction log)
    const { data: oldItem } = await supabase
      .from('items')
      .select('quantity, name')
      .eq('id', id)
      .single();

    // 2. Update item
    const { data, error } = await supabase
      .from('items')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // 3. Log UPDATE transaction if quantity changed manually
    if (oldItem && input.quantity !== undefined && oldItem.quantity !== input.quantity) {
      const diff = input.quantity - oldItem.quantity;
      await supabase.from('transactions').insert({
        item_id: id,
        action_type: TransactionType.UPDATE,
        amount: diff,
        note: `แก้ไขจำนวนจาก ${oldItem.quantity} เป็น ${input.quantity}`,
        user_email: (await supabase.auth.getUser()).data.user?.email || 'system',
      });
    }

    return data;
  },

  // Soft delete item
  delete: async (id: number): Promise<void> => {
    // 1. Get item details
    const { data: item, error: fetchError } = await supabase
      .from('items')
      .select('name, quantity')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Soft delete
    const { error } = await supabase
      .from('items')
      .update({ is_deleted: true, deleted_at: new Date().toISOString(), quantity: 0 })
      .eq('id', id);

    if (error) throw error;

    // 3. Log DELETE transaction
    await supabase.from('transactions').insert({
      item_id: id,
      action_type: TransactionType.DELETE,
      amount: -(item?.quantity || 0),
      note: `ลบสินค้า: ${item?.name || 'unknown'}`,
      user_email: (await supabase.auth.getUser()).data.user?.email || 'system',
    });
  }
};
