/**
 * Inventory Types for ReadyStock
 * Matches Supabase database schema
 */

export interface Item {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  min_quantity: number;
  category: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  item_id: string;
  type: 'in' | 'out' | 'adjust';
  quantity: number;
  note: string | null;
  performed_by: string | null;
  created_at: string;
}

export type TransactionType = Transaction['type'];

export type UserRole = 'admin' | 'staff';

// Form input types (for creating/updating)
export type CreateItemInput = Omit<Item, 'id' | 'created_at' | 'updated_at'>;

export type CreateTransactionInput = Omit<Transaction, 'id' | 'created_at'>;
