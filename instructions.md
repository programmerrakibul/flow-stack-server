# INSTRUCTIONS.md: Auth Migration to Dual-Token Architecture

**Role:** Principal Backend Software Engineer (8+ years experience in Node.js,
Express, TypeScript, Prisma, and Security Standards).

**Objective:** Refactor the existing authentication system from session-based
auth to a secure, stateless JWT dual-token system (Access Token + Refresh Token)
delivered exclusively via `HttpOnly` cookies.

---

## Pre-Implementation Routine

1. Read and analyze the following project documentation completely before
   modifying any code:
   - `AGENTS.md`
   - `ENDPOINTS.md`
   - `README.md`
2. Audit the current session-based authentication implementation across
   `src/modules/auth/` and existing middleware files to identify all points
   requiring refactoring.

---

## Key Constraints & Security Architecture Rules

- **Stateless Tokens:** Do **NOT** persist access or refresh tokens in the
  database.
- **Storage & Transmission:** Store both Access and Refresh tokens strictly in
  `HttpOnly`, `SameSite=Lax` (or `Strict`), and `Secure` (in production)
  cookies.
- **Secrets:** Use distinct environment variables for access and refresh token
  secrets:
  - `JWT_ACCESS_SECRET`
  - `JWT_REFRESH_SECRET`
- **Expirations:** Set configurable expirations (e.g., Access Token: `15m`,
  Refresh Token: `7d`).
- **Code Reusability (DRY):** Do not write inline JWT logic inside controllers
  or middlewares. Abstract all signature, verification, and cookie-setting
  procedures into small, single-responsibility utility helpers.

---

## Step-by-Step Implementation Roadmap

### Phase 1: Environment & Token Utilities

Create clean utility helpers in `src/modules/shared/utils/`):

1. **JWT Utilities (`jwt.ts`):**
   - `generateAccessToken(payload)`
   - `generateRefreshToken(payload)`
   - `verifyAccessToken(token)`
   - `verifyRefreshToken(token)`
2. **Cookie Utilities (`cookie.ts`):**
   - Reusable helpers to attach Access and Refresh cookies to the response
     object (`res.cookie(...)`).
   - Reusable helper to clear auth cookies on logout (`res.clearCookie(...)`).

### Phase 2: Refactor Authentication Handlers

Update the Auth module (`auth/controller/auth.ts`, `auth/service/auth.ts`):

1. **Login / Register:**
   - Validate credentials using `bcryptjs`.
   - Generate both `accessToken` and `refreshToken`.
   - Attach both tokens as `HttpOnly` cookies on successful authentication.
2. **Token Refresh Endpoint (`/auth/refresh-token`):**
   - Read the `refreshToken` from `req.cookies`.
   - Verify the refresh token using `JWT_REFRESH_SECRET`.
   - If valid, generate a **new** `accessToken` and attach it to the cookies.
   - Return a clean success response.
3. **Logout Endpoint (`/auth/logout`):**
   - Clear both access and refresh cookies.

### Phase 3: Auth & Authorization Middlewares

Update/Create global auth middleware (`src/modules/shared/middlewares/auth.ts`):

1. Extract `accessToken` from `req.cookies`.
2. Verify token against `JWT_ACCESS_SECRET`.
3. **Auto-Silent Refresh Handling:** If the `accessToken` is expired or missing,
   check for a valid `refreshToken`:
   - If `refreshToken` is valid, automatically generate a new `accessToken`, set
     it in `res.cookie`, attach the decoded user context to `req.user`, and
     proceed (`next()`).
   - If both tokens are invalid or expired, clear remaining cookies and throw a
     `401 Unauthorized` response.

### Phase 4: Documentation Updates

Update project documentation to reflect the updated auth flow:

1. `ENDPOINTS.md`: Update request/response formats, headers, and cookie
   behaviors for `/auth/login`, `/auth/refresh-token`, `/auth/logout`, and
   protected routes.
2. `AGENTS.md`: Update security context and authentication architecture details.
3. `README.md`: Ensure environment variables list includes `JWT_ACCESS_SECRET`,
   `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, and `JWT_REFRESH_EXPIRES_IN`.

---

## Validation Checklist

- [ ] Existing session dependencies/tables are bypassed or cleaned up safely.
- [ ] Access & Refresh tokens use different secrets.
- [ ] Tokens are invisible to client-side JavaScript (`HttpOnly` flag active).
- [ ] Expired Access Tokens auto-renew seamlessly when a valid Refresh Token is
      present.
- [ ] Controllers contain zero boilerplate token/cookie creation code (delegated
      to utilities).
