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
- **🌍 Internationalization (i18n)** — Dual language support (Thai / English) with easy switching
- **🗑️ Soft Delete** — Items are never permanently removed; history remains fully trackable
- **🤖 Automated Logging** — All transactions (Create, Update, Delete) are logged automatically via Database Triggers
- **📊 Dashboard** — Executive summary with visual statistics, low stock alerts, and recent transaction history
- **🔄 Real-time Sync** — Automatic cache invalidation via React Query

## 🛠️ Tech Stack

| Layer                    | Technology                         |
| ------------------------ | ---------------------------------- |
| **Frontend**             | React 18, TypeScript, Ant Design 6 |
| **State Management**     | Zustand (Auth/Lang), React Query   |
| **Internationalization** | Custom i18n Hook + Zustand         |
| **Backend**              | Supabase (PostgreSQL, Auth, RPC)   |
| **Desktop**              | Electron 30                        |
| **Build Tool**           | Vite 5                             |

## 📁 Project Structure

```
src/
├── app/                  # App configuration (routes, providers)
├── assets/               # Static assets (images, fonts, global icons)
├── components/           # Shared UI components (Buttons, Layouts, etc.)
├── constants/            # Global constants & i18n strings (en.ts, th.ts)
├── features/             # Feature-based modules (Domain Driven Design)
│   ├── auth/             # Login & Authentication logic
│   ├── dashboard/        # Dashboard widgets & layout
│   ├── inventory/        # Item CRUD operations & state
│   ├── transactions/     # Stock In/Out operations
│   └── settings/         # Application settings
├── hooks/                # Global React hooks (useDebounce, useOnClickOutside)
├── lib/                  # External service clients (Supabase, API, React Query)
├── services/             # Business Logic & API calls (Pure TS/JS)
├── store/                # Global State Stores (Zustand)
├── styles/               # Global styles, themes, and CSS variables
├── types/                # Shared TypeScript definitions (Interfaces, Types)
├── utils/                # Utility helpers (formatters, validators)
├── App.tsx               # Root Component (Providers setup)
└── main.tsx              # Entry Point
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

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
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
| `quantity`     | bigint      | Current stock       |
| `min_quantity` | bigint      | Low stock threshold |
| `is_deleted`   | boolean     | Soft delete flag    |
| `deleted_at`   | timestamptz | Deletion timestamp  |
| `created_at`   | timestamptz | Creation timestamp  |

#### `transactions`

| Column        | Type        | Description                                                 |
| ------------- | ----------- | ----------------------------------------------------------- |
| `id`          | bigint      | Primary key                                                 |
| `item_id`     | bigint      | FK → items (SET NULL on delete)                             |
| `action_type` | text        | `CREATE` \| `RECEIVE` \| `WITHDRAW` \| `UPDATE` \| `DELETE` |
| `amount`      | bigint      | Quantity change (+/-)                                       |
| `note`        | text        | Description                                                 |
| `user_email`  | text        | Who performed the action                                    |
| `created_at`  | timestamptz | Timestamp                                                   |

### Database Triggers

| Trigger                      | Event                        | Description                                                |
| ---------------------------- | ---------------------------- | ---------------------------------------------------------- |
| `trg_log_item_create_update` | INSERT OR UPDATE on `items`  | Auto-logs CREATE, UPDATE, and DELETE (Soft Delete) actions |
| `on_profile_role_change`     | INSERT/UPDATE on `profiles`  | Syncs role to JWT Custom Claims                            |
| `on_auth_user_created`       | AFTER INSERT on `auth.users` | Auto-creates public user profile                           |

> **Note:** All transaction logging is handled centrally by Database Triggers. The application uses RPCs for complex logic but skips redundant logging by signaling the trigger via `app.skip_log`.

### RPC Functions

| Function                                                   | Description                       |
| ---------------------------------------------------------- | --------------------------------- |
| `receive_item(t_item_id, t_amount, t_note, t_user_email)`  | Increases stock and logs RECEIVE  |
| `withdraw_item(t_item_id, t_amount, t_note, t_user_email)` | Decreases stock and logs WITHDRAW |

## 📄 License

This project is private.
