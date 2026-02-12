export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: number
          name: string
          category: string | null
          quantity: number
          min_quantity: number
          created_at: string
          is_deleted: boolean
          deleted_at: string | null
        }
        Insert: {
          id?: number
          name: string
          category?: string | null
          quantity?: number
          min_quantity?: number
          created_at?: string
          is_deleted?: boolean
          deleted_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          category?: string | null
          quantity?: number
          min_quantity?: number
          created_at?: string
          is_deleted?: boolean
          deleted_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          role: 'admin' | 'staff' | null
        }
        Insert: {
          id: string
          email?: string | null
          role?: 'admin' | 'staff' | null
        }
        Update: {
          id?: string
          email?: string | null
          role?: 'admin' | 'staff' | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: number
          created_at: string
          item_id: number | null
          action_type: 'CREATE' | 'RECEIVE' | 'WITHDRAW' | 'UPDATE' | 'DELETE'
          amount: number
          user_email: string | null
          note: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          item_id?: number | null
          action_type: 'CREATE' | 'RECEIVE' | 'WITHDRAW' | 'UPDATE' | 'DELETE'
          amount: number
          user_email?: string | null
          note?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          item_id?: number | null
          action_type?: 'CREATE' | 'RECEIVE' | 'WITHDRAW' | 'UPDATE' | 'DELETE'
          amount?: number
          user_email?: string | null
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_: string]: never
    }
    Functions: {
      receive_item: {
        Args: {
          t_item_id: number
          t_amount: number
          t_note: string | null
          t_user_email: string | null
        }
        Returns: void
      }
      withdraw_item: {
        Args: {
          t_item_id: number
          t_amount: number
          t_note: string | null
          t_user_email: string | null
        }
        Returns: void
      }
    }
    Enums: {
      [_: string]: never
    }
    CompositeTypes: {
      [_: string]: never
    }
  }
}
