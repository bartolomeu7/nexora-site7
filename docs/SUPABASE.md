# NEXORA GROUP — Supabase Integration

## Overview

Supabase PostgreSQL is the application database. Clerk handles authentication. The Supabase client uses Clerk's JWT token for RLS-aware queries.

## Client Architecture

### Server Client

`src/lib/supabase/server.ts` — singleton Supabase client with Clerk token:

```typescript
serverClient = createClient(url, key, {
  async accessToken() {
    return (await auth()).getToken() ?? null;
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
```

### Browser Client

`src/lib/supabase/browser.ts` — singleton Supabase client with Clerk session token:

```typescript
browserClient = createClient(url, key, {
  async accessToken() {
    const token = await session?.getToken();
    return token ?? null;
  },
});
```

## Environment Variables

| Variable | Purpose | Exposure |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (admin ops) | Server only |

## RLS Integration

Clerk JWT token is automatically passed to Supabase via `access_token`. RLS policies use `auth.jwt()` to extract:

- `sub` — Clerk user ID
- `public_metadata.role` — user role

## Data Tables

- `profiles` — synced from Clerk via webhook
- `categories` — project/product/experiment categories
- `projects` + related tables
- `products` + related tables
- `experiments` + related tables

## Webhook Sync

Clerk webhook (`/api/webhooks/clerk`) syncs user data to `profiles`:

- `user.created` → upsert profile
- `user.updated` → update profile
- `user.deleted` → soft delete (set `deleted_at`)

## Security

- `SUPABASE_SERVICE_ROLE_KEY` never exposed to browser
- RLS is the final barrier
- All queries respect RLS policies
