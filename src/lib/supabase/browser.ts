"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

let browserClient: SupabaseClient | null = null;

export function createClerkSupabaseClient(session: ReturnType<typeof useSession>): SupabaseClient | null {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window !== "undefined") {
      if (process.env.NODE_ENV === 'production') {
        throw new Error("Supabase environment variables not set. Auth features will be disabled.");
      }
      console.warn("Supabase environment variables not set. Auth features will be disabled.");
    }
    return null;
  }

  browserClient = createClient(url, key, {
    async accessToken() {
      try {
        const token = await (session as unknown as { getToken?: () => Promise<string | null> })?.getToken?.();
        return token ?? null;
      } catch {
        return null;
      }
    },
  });

  return browserClient;
}

export function getBrowserClient(): SupabaseClient | null {
  return browserClient;
}
