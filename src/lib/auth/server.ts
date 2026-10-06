import { auth } from "@clerk/nextjs/server";
import { getRoleFromClaims, type AppRole, type ClerkSessionClaims } from "./types";

export interface AuthResult {
  userId: string;
  role: AppRole;
  claims: ClerkSessionClaims;
}

export interface AdminResult extends AuthResult {
  role: "admin";
}

export async function getCurrentAuth(): Promise<AuthResult> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const role = getRoleFromClaims(sessionClaims as ClerkSessionClaims | null);

  return {
    userId,
    role,
    claims: sessionClaims as ClerkSessionClaims,
  };
}

export async function requireAuth(): Promise<AuthResult> {
  const authResult = await getCurrentAuth();
  return authResult;
}

export async function requireAdmin(): Promise<AdminResult> {
  const authResult = await getCurrentAuth();

  if (authResult.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return {
    ...authResult,
    role: "admin",
  };
}

export async function getOptionalAuth(): Promise<AuthResult | null> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return null;
  }

  const role = getRoleFromClaims(sessionClaims as ClerkSessionClaims | null);

  return {
    userId,
    role,
    claims: sessionClaims as ClerkSessionClaims,
  };
}

export function getRoleFromSessionClaims(claims: ClerkSessionClaims | null | undefined): AppRole {
  return getRoleFromClaims(claims);
}