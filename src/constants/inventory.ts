// Transaction Types
export enum TransactionType {
  RECEIVE = 'RECEIVE',
  WITHDRAW = 'WITHDRAW',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

// User Roles
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

// Query Keys
export const QUERY_KEYS = {
  ITEMS: ['items'],
  TRANSACTIONS: ['transactions'],
} as const;

// Default Values
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_LOW_STOCK_THRESHOLD = 5;
