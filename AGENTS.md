# AGENTS.md - Technical Architecture Guide

## System Architecture

Flow Stack is a **TypeScript/Express 5 REST API** following **Domain-Driven
Modular Architecture** with clean separation of concerns.

```
src/
├── index.ts                 # Server bootstrap
├── mounted-routes.ts        # Route mounting + global error handler
├── config/                  # Environment & Prisma singleton
├── types/                   # TypeScript augmentations
├── generated/               # Prisma generated client (gitignored)
└── modules/
    ├── auth/                # Authentication domain
    ├── task/                # Task management domain
    ├── dashboard/           # Dashboard & user management domain
    └── shared/              # Cross-cutting concerns
        ├── middlewares/     # Auth, RBAC, error handling
        ├── utils/           # Helpers & utilities
        └── types/           # Shared type definitions
```

Each module follows the same layered structure:

```
modules/<domain>/
├── controller/   # Thin request/response handlers
├── service/      # Business logic & database queries
├── routes/       # Express Router definitions
├── validation/   # Zod schemas for input validation
└── interface/    # TypeScript types/interfaces
```

## Database Design

**ORM:** Prisma v7 with PostgreSQL via `@prisma/adapter-pg` driver adapter.

### Models

#### User

- UUID primary key
- Unique email with index
- Role enum: `USER`, `ADMIN`
- `isActive` flag for soft-disable
- Has many Tasks, optional Account (1:1)

#### Account

- Stores authentication credentials (bcrypt password hash)
- Provider enum: `CREDENTIALS`
- Linked to User via unique `userId` FK

#### Task

- UUID primary key
- Indexed title for search
- Priority enum: `LOW`, `MEDIUM`, `HIGH`
- Status enum: `TODO`, `IN_PROGRESS`, `COMPLETED`
- Linked to User via `creatorId` FK (cascade delete)
- Composite indexes: `(status, priority)`, `(creatorId, status)`

## Authentication

**Stateless JWT dual-token authentication** with access and refresh tokens stored
in HttpOnly cookies.

### Token Architecture

- **Access Token**: Short-lived (15m), contains user ID, email, role, emailVerified
- **Refresh Token**: Long-lived (7d), used to obtain new access tokens
- Both tokens stored in HttpOnly, Secure (production), SameSite=Lax cookies
- No token persistence in database (fully stateless)

### Token Lifecycle

1. User signs up/signs in → server generates access + refresh tokens
2. Tokens set as HttpOnly cookies on the response
3. Subsequent requests include access token cookie automatically
4. `verifyAuth` middleware validates access token from cookie
5. If access token expired, middleware automatically refreshes using refresh token
6. If refresh token invalid/expired, user must re-authenticate

### Auth Utilities

- `src/modules/shared/utils/jwt.ts` - Token generation and verification
- `src/modules/shared/utils/cookie.ts` - Cookie helpers and configuration

## Authorization Rules

### Role-Based Access Control (RBAC)

- `verifyAuth` middleware validates JWT and attaches user to `req.user`
- `authorize(...roles)` middleware restricts endpoints to specific roles

### Task Ownership

| Action        | USER           | ADMIN             |
| ------------- | -------------- | ----------------- |
| Create task   | Own tasks only | Own tasks only    |
| List tasks    | Own tasks only | All tasks         |
| View task     | Own tasks only | Any task          |
| Update task   | Own tasks only | N/A (owners only) |
| Update status | Own tasks only | N/A (owners only) |
| Delete task   | Own tasks only | Any task          |

## Developer Guidelines

### Code Conventions

- **Arrow functions** for all non-framework functions
- **Object export pattern** for services/controllers
- **Zod validation** with `parseOrThrow()` for all inputs
- **Standardized responses** via `sendResponse.success/error`
- **No comments** unless explicitly requested

### Adding a New Module

1. Create directory: `src/modules/<name>/`
2. Add subdirectories: `controller/`, `service/`, `routes/`, `validation/`,
   `interface/`
3. Implement validation schemas with Zod
4. Implement service layer with business logic
5. Implement thin controller layer
6. Define routes with appropriate middleware
7. Mount routes in `mounted-routes.ts`

### Error Handling

- Use `http-errors-enhanced` for HTTP errors (e.g., `NotFoundError`,
  `ForbiddenError`)
- Zod validation errors are caught by the global error handler
- All errors flow through `globalErrorHandler` middleware

### Environment Configuration

- All env vars validated at startup via Zod schema
- Fail-fast on missing/invalid configuration
- See `.env` for required variables

## Tech Stack

| Technology           | Purpose                    |
| -------------------- | -------------------------- |
| TypeScript ^7.0      | Type safety                |
| Express ^5.2         | HTTP framework             |
| Prisma ^7.9          | ORM + PostgreSQL           |
| Zod ^4.4             | Input validation           |
| bcryptjs             | Password hashing           |
| jsonwebtoken         | JWT token generation       |
| cookie-parser        | Cookie parsing             |
| http-errors-enhanced | HTTP error classes         |
| http-status          | Status code constants      |

## Database Commands

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Open Prisma Studio
pnpm prisma studio

# Push schema changes (no migration)
pnpm prisma db push
```
