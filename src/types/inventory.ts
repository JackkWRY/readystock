/**
 * Inventory Types for ReadyStock
 * Matches Supabase database schema
 */

export interface Item {
  id: number; // bigint in DB
  name: string;
  category: string | null;
  quantity: number;
  min_quantity: number;
  created_at: string;
}

export interface Transaction {
  id: number; // bigint in DB
  item_id: number;
  action_type: 'STOCK_IN' | 'WITHDRAW' | 'ADJUST';
  amount: number;
  user_email: string | null;
  note: string | null;
  created_at: string;
}

export type TransactionType = Transaction['action_type'];

export type UserRole = 'admin' | 'staff';

export interface Profile {
  id: string; // uuid
  email: string | null;
  role: UserRole;
}

// Form input types (for creating/updating)
export type CreateItemInput = Omit<Item, 'id' | 'created_at'>;

export type CreateTransactionInput = Omit<Transaction, 'id' | 'created_at'>;
