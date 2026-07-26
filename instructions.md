Role: Senior Backend Software Engineer (8+ years experience in Node.js,
Express/TypeScript, Prisma, and DDD/Modular Architecture).

Task Overview: Explore the existing codebase, understand the domain-driven
modular structure, and implement the complete 'Task' domain, along with
role-based authorization rules, dynamic dashboard statistics/activities, utility
helpers, and full project documentation.

---

### Core Instructions & Guidelines:

1. Codebase Exploration:
   - First, scan and map the entire project directory to align with the existing
     `src/modules/<name>` structure.
   - Review existing authentication and session verification middlewares to
     integrate smoothly with session-based user context.

2. Syntax & Code Quality Standards:
   - Prefer modern **arrow functions** unless traditional functions are strictly
     required by framework patterns.
   - Enforce **DRY principles**: Extract reusable query helpers, response
     formatters, validation schemas, and error handlers into small, modular
     utility files.
   - Implement strict type safety across all requests, responses, and database
     queries.

---

### Implementation Requirements:

#### Task 1: Module Architecture & CRUD (`src/modules/task/`)

Implement standard domain-driven layers (e.g., `task.ts`, `task.ts`, `task.ts`,
`task.ts`):

- **Create Task:** Allow authenticated users to create tasks linked to
  `creatorId`.
- **Read / List Tasks (with Filtering & Search):**
  - Support filtering by `status` and `priority`.
  - Support keyword search by `title` (case-insensitive search/contains).
  - Enforce Access Control: Standard users fetch only their created tasks
    (`creatorId = session.userId`), while Admins can view all tasks across the
    system.
- **Update Task & Status:**
  - Only task owners (`creatorId`) can update task details and status.
  - **Business Rule:** Tasks with `status === 'COMPLETED'` cannot have their
    status updated or changed back.
- **Delete Task:**
  - Task owner (`creatorId`) CAN delete their task.
  - Admin (`role === 'ADMIN'`) CAN delete any task.
  - Standard users CANNOT delete tasks created by others.

#### Task 2: Dashboard Statistics & Activity (`src/modules/dashboard/` or relevant module)

- Implement endpoint(s) to fetch dashboard stats tailored to session roles:
  - **USER Dashboard:** Counts of total tasks, tasks by status (`TODO`,
    `IN_PROGRESS`, `COMPLETED`), tasks by priority, and recent task activity
    log/list for the logged-in user for last 30 days.
  - **ADMIN Dashboard:** System-wide aggregates (total users, active users,
    total system tasks grouped by status and priority, top active task creators,
    and recent global task activity) for last 30 days. Total active users. User
    manage endpoint for admin ~ can delete and toggle users isActive status.

#### Task 3: Authorization & Middleware Refinement

- Utilize the session-based user context attached from the session verification
  middleware.
- Refine or create modular RBAC/Ownership middlewares (e.g.,
  `verifySessionId()`, `authorize()`) to keep controller actions clean and thin.

#### Task 4: Utility & Helper Refinements

- Create small, reusable helper functions for handling pagination, Prisma
  sorting/filtering clauses, dynamic search inputs, and standard HTTP API
  responses.

#### Task 5: Documentation Deliverables

Generate three clean Markdown documentation files at the root of the project:

1. `ENDPOINTS.md`: Comprehensive API reference covering method, URL, request
   headers/cookies, payload schemas, query parameters, authorization
   requirements, and sample response JSONs.
2. `AGENTS.md`: Technical summary outlining system architecture, database design
   choices, state transition rules (e.g., immutable COMPLETED state), and
   developer guidelines for future AI/human maintainers.
3. `README.md`: Complete project overview, environmental configuration guide
   (`.env.example` reference), database setup commands (Prisma
   generation/migrations), and local server start instructions.

### Note:

validate using zod schema with parseOrThrow() function.

---

Start by exploring the codebase, verify the session authorization middleware,
and outline your execution plan before writing code.
