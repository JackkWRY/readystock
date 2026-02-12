/**
 * Inventory Types for ReadyStock
 * Matches Supabase database schema
 */

import { TransactionType, UserRole } from "../constants/inventory";

import { Database } from "./supabase";

export type Item = Database["public"]["Tables"]["items"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export type { TransactionType, UserRole };

export interface Profile {
  id: string; // uuid
  email: string | null;
  role: UserRole;
}

// Form input types (for creating/updating)

export type CreateTransactionInput = Database["public"]["Tables"]["transactions"]["Insert"];
export type CreateItemInput = Database["public"]["Tables"]["items"]["Insert"];
export type UpdateItemInput = Database["public"]["Tables"]["items"]["Update"];
