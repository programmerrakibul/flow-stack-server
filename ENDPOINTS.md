# API Endpoints

Base URL: `http://localhost:8000/api/v1`

## Response Format

All responses follow this standard format:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "pagination": {},
  "token": ""
}
```

Auth endpoints (`/auth/sign-up`, `/auth/sign-in`) additionally return a `token`
field in the JSON body alongside setting HttpOnly cookies.

---

## Auth

### POST `/auth/sign-up`

Register a new user. Sets access and refresh HttpOnly cookies, returns token in
response body.

**Request Body:**

```json
{
  "name": "string (3-50 chars)",
  "email": "string (valid email)",
  "password": "string (min 8 chars, must include uppercase, lowercase, number, special char)",
  "image": "string (optional, valid URL)"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_access_token_string",
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "image": "string | null",
    "emailVerified": false,
    "role": "USER",
    "isActive": true,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

### POST `/auth/sign-in`

Authenticate an existing user. Sets access and refresh HttpOnly cookies, returns
token in response body.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "jwt_access_token_string",
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "image": "string | null",
    "emailVerified": false,
    "role": "USER",
    "isActive": true,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

### POST `/auth/sign-out`

Clear all authentication cookies.

**Cookies Cleared:** `__fs_access_token__`, `__fs_refresh_token__`

**Response (200):**

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

### POST `/auth/refresh-token`

Refresh access and refresh tokens using the refresh token cookie.

**Required Cookie:** `__fs_refresh_token__`

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully"
}
```

If no refresh token cookie is present:

```json
{
  "success": true,
  "message": "Refresh token not found"
}
```

### GET `/auth/profile`

Get the current authenticated user's profile. Requires `verifyAuth` middleware.

**Auth:** `Cookie: __fs_access_token__=<token>` or
`Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "image": "string | null",
    "emailVerified": false,
    "role": "USER",
    "isActive": true,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

## Tasks

All task endpoints require `verifyAuth` middleware.

**Auth:** `Cookie: __fs_access_token__=<token>` or
`Authorization: Bearer <token>`

### POST `/tasks`

Create a new task.

**Request Body:**

```json
{
  "title": "string (3-255 chars)",
  "description": "string (required)",
  "priority": "LOW | MEDIUM | HIGH (default: LOW)"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "priority": "LOW",
    "status": "TODO",
    "creatorId": "uuid",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

### GET `/tasks`

List tasks with filtering, search, and pagination. Users see only their own
tasks. Admins see all tasks.

**Query Parameters:**

| Param     | Type   | Description                                                         |
| --------- | ------ | ------------------------------------------------------------------- |
| page      | string | Page number (default: 1)                                            |
| limit     | string | Items per page (default: 10, max: 100)                              |
| search    | string | Case-insensitive title search                                       |
| status    | string | Filter by status: `TODO`, `IN_PROGRESS`, `COMPLETED`                |
| priority  | string | Filter by priority: `LOW`, `MEDIUM`, `HIGH`                         |
| sortBy    | string | Sort field: `createdAt`, `updatedAt`, `priority`, `status`, `title` |
| sortOrder | string | `asc` or `desc` (default: `desc`)                                   |

**Response (200):**

```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "priority": "LOW",
      "status": "TODO",
      "creatorId": "uuid",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPage": 5,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

### GET `/tasks/:id`

Get a single task by ID. Users can only access their own tasks. Admins can
access any task.

**Response (200):**

```json
{
  "success": true,
  "message": "Task fetched successfully",
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "priority": "LOW",
    "status": "TODO",
    "creatorId": "uuid",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "creator": {
      "id": "uuid",
      "name": "string",
      "email": "string"
    }
  }
}
```

### PATCH `/tasks/:id`

Update task details. Only the task owner can update. Completed tasks cannot be
updated.

**Request Body:**

```json
{
  "title": "string (optional, 3-255 chars)",
  "description": "string (optional)",
  "priority": "LOW | MEDIUM | HIGH (optional)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "priority": "LOW",
    "status": "TODO",
    "creatorId": "uuid",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

### PATCH `/tasks/:id/status`

Update task status. Only the task owner can update. Completed tasks cannot have
their status changed.

**Request Body:**

```json
{
  "status": "TODO | IN_PROGRESS | COMPLETED"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "priority": "LOW",
    "status": "IN_PROGRESS",
    "creatorId": "uuid",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

### DELETE `/tasks/:id`

Delete a task. Task owners can delete their own tasks. Admins can delete any
task.

**Response (200):**

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Users (Admin)

All user management endpoints require `verifyAuth` + `authorize(ADMIN)`
middleware.

**Auth:** `Cookie: __fs_access_token__=<token>` or
`Authorization: Bearer <token>` **Role Required:** `ADMIN`

### GET `/users`

List all users with pagination and search.

**Query Parameters:**

| Param  | Type   | Description                            |
| ------ | ------ | -------------------------------------- |
| page   | string | Page number (default: 1)               |
| limit  | string | Items per page (default: 10, max: 100) |
| search | string | Case-insensitive name/email search     |

**Response (200):**

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "image": "string | null",
      "emailVerified": false,
      "role": "USER",
      "isActive": true,
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "_count": {
        "tasks": 15
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPage": 10,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

### PATCH `/users/:id/status`

Toggle a user's active status.

**Response (200):**

```json
{
  "success": true,
  "message": "User status toggled successfully",
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "USER",
    "isActive": true
  }
}
```

### DELETE `/users/:id`

Delete a user permanently.

**Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Dashboard

All dashboard endpoints require `verifyAuth` middleware. Role-specific endpoints
additionally require `authorize(USER)` or `authorize(ADMIN)`.

**Auth:** `Cookie: __fs_access_token__=<token>` or
`Authorization: Bearer <token>`

### GET `/dashboard/user`

Get dashboard statistics for the authenticated user (last 30 days).

**Role Required:** `USER`

**Response (200):**

```json
{
  "success": true,
  "message": "User dashboard fetched successfully",
  "data": {
    "totalTasks": 25,
    "tasksByStatus": {
      "TODO": 10,
      "IN_PROGRESS": 8,
      "COMPLETED": 7
    },
    "tasksByPriority": {
      "LOW": 12,
      "MEDIUM": 8,
      "HIGH": 5
    },
    "recentActivity": [
      {
        "id": "uuid",
        "title": "string",
        "status": "TODO",
        "priority": "LOW",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
}
```

### GET `/dashboard/admin`

Get system-wide dashboard statistics (admin only, last 30 days).

**Role Required:** `ADMIN`

**Response (200):**

```json
{
  "success": true,
  "message": "Admin dashboard fetched successfully",
  "data": {
    "totalUsers": 100,
    "activeUsers": 85,
    "totalTasks": 500,
    "tasksByStatus": {
      "TODO": 200,
      "IN_PROGRESS": 150,
      "COMPLETED": 150
    },
    "tasksByPriority": {
      "LOW": 200,
      "MEDIUM": 180,
      "HIGH": 120
    },
    "topActiveCreators": [
      {
        "id": "uuid",
        "name": "string",
        "email": "string",
        "taskCount": 50
      }
    ],
    "recentActivity": [
      {
        "id": "uuid",
        "title": "string",
        "status": "TODO",
        "priority": "LOW",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "creator": {
          "id": "uuid",
          "name": "string",
          "email": "string"
        }
      }
    ]
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**

| Code | Description                                                      |
| ---- | ---------------------------------------------------------------- |
| 401  | Unauthorized - No token, invalid token, or expired refresh token |
| 403  | Forbidden - Insufficient permissions                             |
| 404  | Not Found - Resource does not exist                              |
| 409  | Conflict - Resource already exists (e.g., duplicate email)       |
| 422  | Unprocessable Entity - Validation error                          |
| 500  | Internal Server Error                                            |
