import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import { TransactionType } from '../constants/inventory';

// Type definitions from Supabase
type ReceiveItemArgs = Database['public']['Functions']['receive_item']['Args'];
type WithdrawItemArgs = Database['public']['Functions']['withdraw_item']['Args'];
type TransactionTypeEnum = Database['public']['Enums']['transaction_type'];

export interface TransactionParams {
  itemId: number;
  amount: number;
  userEmail?: string;
  note?: string;
}

export const transactionService = {
  // Fetch transactions with filtering and pagination
  getAll: async ({ page = 1, pageSize = 10, filter = 'all' }: { page?: number; pageSize?: number; filter?: string }) => {
    let query = supabase
      .from('transactions')
      .select('*, items(name)', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filter
    if (filter && filter !== 'all') {
      query = query.eq('action_type', filter as TransactionTypeEnum);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return { data, count: count || 0 };
  },

  // Receive Item (Stock In) - Uses RPC
  receiveItem: async ({ itemId, amount, userEmail, note }: TransactionParams): Promise<void> => {
    const args: ReceiveItemArgs = {
      t_item_id: itemId,
      t_amount: amount,
      t_user_email: userEmail || null,
      t_note: note || null,
    };

    const { error } = await supabase.rpc('receive_item', args);

    // Fallback to manual if RPC fails (optional, but requested in original code)
    if (error) {
      console.error('RPC receive_item failed, falling back to manual', error);
      await manualTransaction({ itemId, amount, userEmail, note, type: TransactionType.RECEIVE as TransactionTypeEnum });
    }
  },

  // Withdraw Item (Stock Out) - Uses RPC
  withdrawItem: async ({ itemId, amount, userEmail, note }: TransactionParams): Promise<void> => {
    const args: WithdrawItemArgs = {
      t_item_id: itemId,
      t_amount: amount,
      t_user_email: userEmail || null,
      t_note: note || null,
    };

    const { error } = await supabase.rpc('withdraw_item', args);

    if (error) {
       // Check if custom exception
       if (error.message.includes('สินค้าไม่พอ')) {
         throw new Error('สินค้าคงเหลือไม่เพียงพอ');
       }

      console.error('RPC withdraw_item failed, falling back to manual', error);
      await manualTransaction({ itemId, amount, userEmail, note, type: TransactionType.WITHDRAW as TransactionTypeEnum });
    }
  },
};

// Private helper for manual transactions (Fallback)
const manualTransaction = async ({ 
  itemId, amount, userEmail, note, type 
}: TransactionParams & { type: TransactionTypeEnum }) => {
  
  // 1. Update item quantity
  const { data: item } = await supabase.from('items').select('quantity').eq('id', itemId).single();
  if (!item) throw new Error('Item not found');

  let newQuantity = item.quantity;
  if (type === TransactionType.RECEIVE) {
    newQuantity += amount;
  } else if (type === TransactionType.WITHDRAW) {
    if (item.quantity < amount) throw new Error('สินค้าไม่พอ');
    newQuantity -= amount;
  }

  const { error: updateError } = await supabase
    .from('items')
    .update({ quantity: newQuantity })
    .eq('id', itemId);
  
  if (updateError) throw updateError;

  // 2. Log transaction
  const { error: logError } = await supabase.from('transactions').insert({
    item_id: itemId,
    action_type: type,
    amount,
    note,
    user_email: userEmail,
  });

  if (logError) throw logError;
};
