export const EN = {
  // Auth
  LOGIN: {
    TITLE: 'Login',
    EMAIL: 'Email',
    PASSWORD: 'Password',
    SUBMIT: 'Sign In',
    SUCCESS: 'Login Successful!',
    ERROR_INVALID: 'Invalid email or password',
    ERROR_GENERIC: 'An error occurred. Please try again.',
  },
  
  // Dashboard
  DASHBOARD: {
    TITLE: 'Dashboard',
    OVERVIEW: 'System Overview',
    TOTAL_ITEMS: 'Total Items',
    TOTAL_QUANTITY: 'Total Quantity',
    LOW_STOCK: 'Low Stock Items',
    RECENT_TRANSACTIONS: 'Recent Transactions',
  },

  // Inventory
  INVENTORY: {
    TITLE: 'Inventory',
    SEARCH: 'Search items...',
    ADD_ITEM: 'Add Item',
    EDIT_ITEM: 'Edit',
    DELETE_ITEM: 'Delete',
    CONFIRM_DELETE: 'Are you sure you want to delete this item?',
    NAME: 'Item Name',
    CATEGORY: 'Category',
    QUANTITY: 'Quantity',
    MIN_QUANTITY: 'Min Qty',
    UNIT: 'pcs',
    PLACEHOLDERS: {
      NAME: 'e.g. 3-inch Round Head Screw',
      CATEGORY: 'e.g. Equipment',
    },
  },

  // Transactions
  TRANSACTION: {
    TITLE: 'Stock In/Out',
    RECEIVE: 'Stock In',
    WITHDRAW: 'Stock Out',
    RECEIVE_TITLE: 'Receive Stock',
    WITHDRAW_TITLE: 'Withdraw Stock',
    SELECT_ITEM: 'Select Item',
    AMOUNT: 'Amount',
    NOTE: 'Note',
    NOTE_OPTIONAL: 'Note (Optional)',
    NOTE_PLACEHOLDER: 'Enter optional note or reason...',
    SUBMIT_RECEIVE: 'Confirm Stock In',
    SUBMIT_WITHDRAW: 'Confirm Withdrawal',
    HISTORY: 'History',
    ALL: 'All',
    DATE: 'Date',
    TYPE: 'Transaction Type',
    ACTION: 'Action',
    USER: 'User',
    TYPES: {
      RECEIVE: 'Stock In',
      WITHDRAW: 'Stock Out',
      UPDATE: 'Adjust',
      DELETE: 'Delete',
      CREATE: 'Create Item',
    },
  },

  // Settings
  SETTINGS: {
    TITLE: 'Settings',
    PROFILE: 'Profile',
    LOGOUT: 'Logout',
    ABOUT: 'About',
    LANGUAGE: 'Language',
    ROLES: {
      ADMIN: 'Administrator',
      STAFF: 'Staff',
    },
  },
  
  // Common
  COMMON: {
    LOADING: 'Loading...',
    SUCCESS: 'Operation Successful',
    ERROR: 'An error occurred',
    CANCEL: 'Cancel',
    CONFIRM: 'Confirm',
    ALL: 'All',
  }
} as const;
