# NEXORA GROUP — Authentication Architecture

## Overview

NEXORA GROUP uses **Clerk** for authentication and **Supabase PostgreSQL** as the application database.

```
CLERK
│
├── Authentication
├── Sessions
├── User Management
└── Global Role (publicMetadata.role)
      │
      ▼
    NEXT.JS
      │
      ├── Public Site
      ├── /dashboard
      └── /admin
             │
             ▼
      SUPABASE POSTGRES
             │
             └── RLS
```

## Responsibilities

| Layer | Responsibility |
|-------|---------------|
| **Clerk** | Identity, authentication, sessions, user management, global role |
| **Next.js** | Route authorization, Server Actions, Clerk ↔ Supabase integration |
| **Supabase** | Application database, RLS, projects/products/experiments/categories data, synced profiles |

## Roles

Two roles only: `"user"` and `"admin"`.

```typescript
type AppRole = "user" | "admin";
```

Role is stored in Clerk `publicMetadata`:

```json
{ "role": "admin" }
```

- `publicMetadata` is read-only in the browser
- Role changes only via Clerk Backend API
- Users cannot self-promote
- First admin configured manually in Clerk Dashboard

## Session Claims

Clerk session claims expose role via `publicMetadata.role`.

```typescript
interface ClerkSessionClaims {
  sub: string; // Clerk user ID
  publicMetadata?: {
    role?: AppRole;
  };
}
```

## Authorization Helpers

Server-side helpers in `src/lib/auth/server.ts`:

- `getCurrentAuth()` — returns userId + role
- `requireAuth()` — throws if not authenticated
- `requireAdmin()` — throws if not admin
- `getOptionalAuth()` — returns null if not authenticated

## Admin Flow

```
request
  ↓
Clerk session (middleware)
  ↓
userId
  ↓
role (publicMetadata.role)
  ↓
admin?
  ├── NO → redirect to /
  └── YES → continue
```

## Dashboard Flow

```
request
  ↓
Clerk session (middleware)
  ↓
authenticated?
  ├── NO → redirect to /login
  └── YES → /dashboard
```

## Webhook

`POST /api/webhooks/clerk` — receives Clerk events:

- `user.created` — upsert profile
- `user.updated` — update profile
- `user.deleted` — soft delete (set `deleted_at`, revoke role)

Webhook is public (no Clerk session required). Signature verified via `verifyWebhook()`.

## Profile Sync

Clerk is the source of truth. Supabase `profiles` table is a mirror:

| Field | Source |
|-------|--------|
| `clerk_user_id` | Clerk user ID |
| `email` | Clerk email |
| `display_name` | Clerk first + last name |
| `avatar_url` | Clerk image URL |
| `role` | Clerk publicMetadata.role |
| `deleted_at` | Set on user.deleted |

## Security

- `CLERK_SECRET_KEY` — server only
- `CLERK_WEBHOOK_SIGNING_SECRET` — server only
- `SUPABASE_SERVICE_ROLE_KEY` — server only, never in browser
- No role escalation via client
- No role escalation via webhook
- RLS is the final barrier
