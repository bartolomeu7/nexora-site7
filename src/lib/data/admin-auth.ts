import { auth } from '@clerk/nextjs/server';
import type { AppRole } from '@/lib/auth/types';

export interface AdminCheckResult {
  isAdmin: boolean;
  error?: string;
  userId?: string;
  role?: AppRole;
}

interface ClerkPublicMetadata {
  role?: AppRole;
  [key: string]: unknown;
}

interface ClerkSessionClaims {
  sub: string;
  publicMetadata?: ClerkPublicMetadata;
  [key: string]: unknown;
}

/**
 * Authoritative server-side admin check.
 *
 * Source of truth is Clerk's publicMetadata.role (validated server-side).
 * The profiles table is kept in sync via Clerk webhooks.
 * RLS remains the final barrier.
 */
export async function checkAdminRole(): Promise<AdminCheckResult> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { isAdmin: false, error: 'Not authenticated' };
  }

  const claims = sessionClaims as ClerkSessionClaims | undefined;
  const role = (claims?.publicMetadata?.role as string) || "user";

  if (role !== 'admin') {
    return { isAdmin: false, error: 'Not authorized', userId, role: role as AppRole };
  }

  return { isAdmin: true, userId, role: 'admin' };
}

export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export async function getCurrentRole(): Promise<string> {
  const { sessionClaims } = await auth();
  const claims = sessionClaims as ClerkSessionClaims | undefined;
  return (claims?.publicMetadata?.role as string) || "user";
}