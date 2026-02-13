import { supabase } from '../lib/supabaseClient';
import { Item, CreateItemInput } from '../types/inventory';

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
    // 1. Update item (Database triggers will handle logging if quantity changes)
    const { data, error } = await supabase
      .from('items')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Soft delete item
  delete: async (id: number): Promise<void> => {
    // Soft delete (Database triggers will handle logging 'DELETE' if configured correctly for soft deletes, 
    // OR we need to adjust the trigger logic. 
    
    const { error } = await supabase
      .from('items')
      .update({ is_deleted: true, deleted_at: new Date().toISOString(), quantity: 0 })
      .eq('id', id);

    if (error) throw error;
  }
};
