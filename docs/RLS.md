# NEXORA GROUP — RLS Architecture

## Overview

Row Level Security (RLS) is the final security barrier. Clerk provides identity; Supabase RLS enforces data access.

## Identity Source

Clerk JWT token is passed to Supabase via `access_token` in the Supabase client. RLS functions extract identity from `auth.jwt()`.

## Helper Functions

### `is_admin()`

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() -> 'public_metadata' ->> 'role') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

### `is_own_profile(profile_clerk_user_id TEXT)`

```sql
CREATE OR REPLACE FUNCTION is_own_profile(profile_clerk_user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() ->> 'sub') = profile_clerk_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

### `is_authenticated()`

```sql
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.jwt() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

## Policy Patterns

### Public Read (published content only)

```sql
CREATE POLICY "table_select_public" ON table_name
    FOR SELECT USING (
        published_at IS NOT NULL
        AND status IN ('active', 'coming_soon')
    );
```

### Admin Full Access

```sql
CREATE POLICY "table_all_admin" ON table_name
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());
```

### Own Profile (no role escalation)

```sql
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (is_own_profile(clerk_user_id))
    WITH CHECK (
        is_own_profile(clerk_user_id)
        AND role = 'user'  -- Prevent role escalation
    );
```

## Anti-Escalation

- Users cannot modify `profiles.role` to `'admin'`
- RLS `WITH CHECK` enforces `role = 'user'` on self-update
- Admin role changes only via Clerk Backend API

## Tables with RLS

- `profiles`
- `categories`
- `projects` + related tables
- `products` + related tables
- `experiments` + related tables

## SECURITY DEFINER

All helper functions use `SET search_path = public` to prevent search path attacks.
