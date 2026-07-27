# Flow Stack Server

A production-ready REST API built with TypeScript, Express 5, Prisma 7, and
PostgreSQL using domain-driven modular architecture.

## Features

- **Session-based authentication** with secure cookies
- **Role-based access control** (USER, ADMIN)
- **Task management** with CRUD operations, filtering, search, and pagination
- **Dashboard analytics** with role-specific statistics
- **User management** for admin users
- **Input validation** with Zod schemas
- **Standardized API responses** across all endpoints

## Prerequisites

- Node.js >= 20.x
- pnpm >= 11.x
- PostgreSQL database

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
DATABASE_URL=your_postgresql_database_url
PORT=8000
SESSION_SECRET=your-super-secret-session-key
```

### Variable Descriptions

| Variable       | Required | Default       | Description                                            |
| -------------- | -------- | ------------- | ------------------------------------------------------ |
| NODE_ENV       | No       | `development` | Environment mode (`development`, `test`, `production`) |
| DATABASE_URL   | Yes      | -             | PostgreSQL connection string                           |
| PORT           | No       | `8000`        | Server listening port                                  |
| SESSION_SECRET | Yes      | -             | Secret for signing session cookies                     |

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Database

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# (Optional) Open Prisma Studio to view data
pnpm prisma studio
```

### 3. Start Development Server

```bash
pnpm dev
```

The server will start at `http://localhost:8000`.

### 4. Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
flow-stack-server/
├── prisma/
│   ├── schema.prisma          # Root schema
│   └── models/                # Split model files
│       ├── user.prisma        # User, Session, Account
│       └── task.prisma        # Task
├── src/
│   ├── index.ts               # Entry point
│   ├── mounted-routes.ts      # Route mounting
│   ├── config/                # Environment & Prisma
│   ├── types/                 # TypeScript types
│   └── modules/
│       ├── auth/              # Authentication
│       ├── task/              # Task management
│       ├── dashboard/         # Dashboard & user management
│       └── shared/            # Shared utilities
├── ENDPOINTS.md               # API documentation
├── AGENTS.md                  # Architecture guide
└── README.md                  # This file
```

## API Overview

### Authentication

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/api/v1/auth/sign-up`  | Register new user |
| POST   | `/api/v1/auth/sign-in`  | Login             |
| POST   | `/api/v1/auth/sign-out` | Logout            |
| GET    | `/api/v1/auth/profile`  | Get profile       |

### Tasks

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| POST   | `/api/v1/tasks`            | Create task           |
| GET    | `/api/v1/tasks`            | List tasks (filtered) |
| GET    | `/api/v1/tasks/:id`        | Get task              |
| PATCH  | `/api/v1/tasks/:id`        | Update task           |
| PATCH  | `/api/v1/tasks/:id/status` | Update status         |
| DELETE | `/api/v1/tasks/:id`        | Delete task           |

### Dashboard

| Method | Endpoint                                          | Description     |
| ------ | ------------------------------------------------- | --------------- |
| GET    | `/api/v1/dashboard/user`                          | User dashboard  |
| GET    | `/api/v1/dashboard/admin`                         | Admin dashboard |
| GET    | `/api/v1/dashboard/admin/users`                   | List users      |
| PATCH  | `/api/v1/dashboard/admin/users/:id/toggle-active` | Toggle user     |
| DELETE | `/api/v1/dashboard/admin/users/:id`               | Delete user     |

For detailed API documentation, see [ENDPOINTS.md](./ENDPOINTS.md).

## Development

### Scripts

```bash
pnpm dev          # Start dev server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
```

### Architecture

This project follows **Domain-Driven Modular Architecture** with:

- **Controller-Service separation** (thin controllers, fat services)
- **Shared module** for cross-cutting concerns
- **Zod validation** for all inputs
- **Standardized responses** across all endpoints

For architecture details, see [AGENTS.md](./AGENTS.md).
