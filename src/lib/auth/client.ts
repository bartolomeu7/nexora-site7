"use client";

import { useUser } from "@clerk/nextjs";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import type { AppRole } from "./types";

export interface ClientAuthResult {
  userId: string | null;
  role: AppRole;
  isLoaded: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): ClientAuthResult {
  const { userId, isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user } = useUser();

  const role: AppRole = user?.publicMetadata?.role === "admin" ? "admin" : "user";

  return {
    userId: userId ?? null,
    role,
    isLoaded: isLoaded ?? false,
    isSignedIn: isSignedIn ?? false,
    signOut,
  };
}

export function useRole(): AppRole {
  const { user } = useUser();
  return user?.publicMetadata?.role === "admin" ? "admin" : "user";
}

export function useUserId(): string | null {
  const { userId } = useClerkAuth();
  return userId ?? null;
}

export function useIsAdmin(): boolean {
  const role = useRole();
  return role === "admin";
}
