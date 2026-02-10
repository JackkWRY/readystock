# 📦 ReadyStock

> ระบบจัดการสต็อกสินค้าอัจฉริยะ — Inventory Management System

A modern inventory management desktop application built with **React**, **TypeScript**, **Electron**, and **Supabase**.

---

## ✨ Features

- **📋 Inventory Management** — Add, edit, and soft-delete items with category support
- **📥 Stock In / 📤 Stock Out** — Receive and withdraw items via RPC with automatic history logging
- **📊 Transaction History** — Full audit trail with filterable action types (CREATE, RECEIVE, WITHDRAW, UPDATE, DELETE)
- **⚠️ Low Stock Alerts** — Visual warnings when items fall below minimum quantity thresholds
- **🔐 Authentication** — Supabase-based login with role-based access (Admin / Staff)
- **🗑️ Soft Delete** — Items are never permanently removed; history remains fully trackable
- **🔄 Real-time Sync** — Automatic cache invalidation via React Query

## 🛠️ Tech Stack

| Layer                | Technology                         |
| -------------------- | ---------------------------------- |
| **Frontend**         | React 18, TypeScript, Ant Design 6 |
| **State Management** | Zustand, TanStack React Query      |
| **Backend**          | Supabase (PostgreSQL, Auth, RPC)   |
| **Desktop**          | Electron 30                        |
| **Build Tool**       | Vite 5                             |

## 📁 Project Structure

```
src/
├── features/
│   ├── auth/             # Login page & auth logic
│   ├── dashboard/        # Layout, sidebar navigation
│   ├── inventory/        # Item CRUD, soft delete
│   │   ├── components/   # ItemFormModal
│   │   └── hooks/        # useItems, useCreateItem, useUpdateItem, useDeleteItem
│   ├── transactions/     # Stock in/out, history view
│   │   ├── components/   # StockTransactionForm
│   │   └── hooks/        # useTransactions, useReceiveItem, useWithdrawItem
│   └── settings/         # App settings
├── lib/                  # Supabase client, React Query client
├── store/                # Zustand auth store
└── types/                # TypeScript interfaces (Item, Transaction, etc.)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- a [Supabase](https://supabase.com/) project
  - Run the SQL commands in `supabase/schema.sql` in your Supabase SQL Editor to set up tables and functions.

### Manual Database Setup

If you prefer to set up the database manually, you can execute the SQL commands found in `supabase/schema.sql`. This file contains:

1.  **Table Definitions**: `profiles`, `items`, `transactions`
2.  **RLS Policies**: Basic policies for data access
3.  **Triggers**: Auto-create user profile, auto-log item creation
4.  **RPC Functions**: `receive_item` and `withdraw_item` for stock management

### Installation

```bash
# Clone the repository
git clone https://github.com/JackkWRY/readystock.git
cd readystock

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## 🗄️ Database Schema

### Tables

#### `items`

| Column         | Type        | Description         |
| -------------- | ----------- | ------------------- |
| `id`           | bigint      | Primary key         |
| `name`         | text        | Item name           |
| `category`     | text        | Category (nullable) |
| `quantity`     | integer     | Current stock       |
| `min_quantity` | integer     | Low stock threshold |
| `is_deleted`   | boolean     | Soft delete flag    |
| `deleted_at`   | timestamptz | Deletion timestamp  |
| `created_at`   | timestamptz | Creation timestamp  |

#### `transactions`

| Column        | Type        | Description                                                 |
| ------------- | ----------- | ----------------------------------------------------------- |
| `id`          | bigint      | Primary key                                                 |
| `item_id`     | bigint      | FK → items (SET NULL on delete)                             |
| `action_type` | text        | `CREATE` \| `RECEIVE` \| `WITHDRAW` \| `UPDATE` \| `DELETE` |
| `amount`      | integer     | Quantity change (+/-)                                       |
| `note`        | text        | Description                                                 |
| `user_email`  | text        | Who performed the action                                    |
| `created_at`  | timestamptz | Timestamp                                                   |

### Database Triggers

| Trigger                      | Event                   | Description                   |
| ---------------------------- | ----------------------- | ----------------------------- |
| `trg_log_item_create_update` | AFTER INSERT on `items` | Auto-logs CREATE transactions |

> Stock In/Out and Update transactions are logged by the application code. Soft delete transactions are logged by `useDeleteItem`.

### RPC Functions

| Function                                                   | Description                       |
| ---------------------------------------------------------- | --------------------------------- |
| `receive_item(t_item_id, t_amount, t_note, t_user_email)`  | Increases stock and logs RECEIVE  |
| `withdraw_item(t_item_id, t_amount, t_note, t_user_email)` | Decreases stock and logs WITHDRAW |

## 📄 License

This project is private.
