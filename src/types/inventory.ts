/**
 * Inventory Types for ReadyStock
 * Matches Supabase database schema
 */

import { TransactionType, UserRole } from "../constants/inventory";

export interface Item {
  id: number; // bigint in DB
  name: string;
  category: string | null;
  quantity: number;
  min_quantity: number;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
}

export interface Transaction {
  id: number; // bigint in DB
  item_id: number | null;
  action_type: TransactionType;
  amount: number;
  user_email: string | null;
  note: string | null;
  created_at: string;
}

export type { TransactionType, UserRole };

export interface Profile {
  id: string; // uuid
  email: string | null;
  role: UserRole;
}

// Form input types (for creating/updating)
export type CreateItemInput = Omit<Item, 'id' | 'created_at' | 'is_deleted' | 'deleted_at'>;

export type CreateTransactionInput = Omit<Transaction, 'id' | 'created_at'>;
