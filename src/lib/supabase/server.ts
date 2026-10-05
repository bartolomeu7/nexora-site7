import { createClient, SupabaseClient } from '@supabase/supabase-js';

let serverClient: SupabaseClient | null = null;

export function createServerClient(): SupabaseClient | null {
    if (serverClient) return serverClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error("Supabase environment variables not set. Server-side features will be disabled.");
        }
        if (typeof window !== 'undefined') {
            console.warn('Supabase environment variables not set. Server-side features will be disabled.');
        }
        return null;
    }

    serverClient = createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    return serverClient;
}

export function getServerClient(): SupabaseClient | null {
    return createServerClient();
}

export async function getServerSession() {
    const client = getServerClient();
    if (!client) return { data: { session: null }, error: { message: 'Supabase not configured' } };

    return client.auth.getSession();
}