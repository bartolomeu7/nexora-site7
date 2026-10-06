export type AppRole = "user" | "admin";

export interface ClerkPublicMetadata {
  role?: AppRole;
  full_name?: string;
  avatar_url?: string;
}

export interface ClerkSessionClaims {
  sub: string;
  email?: string;
  publicMetadata?: ClerkPublicMetadata;
  [key: string]: unknown;
}

export function getRoleFromClaims(claims: ClerkSessionClaims | null | undefined): AppRole {
  if (!claims?.publicMetadata?.role) return "user";
  return claims.publicMetadata.role;
}

export function isAdminRole(role: AppRole): boolean {
  return role === "admin";
}