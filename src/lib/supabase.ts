import { createClient, SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function createBrowserClient(): SupabaseClient | null {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window !== "undefined") {
      console.warn("Supabase environment variables not set. Auth features will be disabled.");
    }
    return null;
  }

  browserClient = createClient(url, key);
  return browserClient;
}

export function getBrowserClient(): SupabaseClient | null {
  return createBrowserClient();
}