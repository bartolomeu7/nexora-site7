import { createServerClient, getServerSession } from '@/lib/supabase/server';

export interface AdminCheckResult {
  isAdmin: boolean;
  error?: string;
}

interface ProfileRoleRow {
  role: string;
}

/**
 * Authoritative server-side admin check.
 *
 * Source of truth is the `profiles.role` row (validated server-side),
 * with RLS as the final barrier. Never trust `user_metadata.role`
 * from the browser for authorization — it is UX-only.
 */
export async function checkAdminRole(): Promise<AdminCheckResult> {
  const client = createServerClient();
  if (!client) {
    return { isAdmin: false, error: 'Supabase not configured' };
  }

  const { data: { session }, error: sessionError } = await getServerSession();
  if (sessionError || !session) {
    return { isAdmin: false, error: 'Not authenticated' };
  }

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (profileError) {
    return { isAdmin: false, error: 'Failed to fetch profile' };
  }

  const roleRow = profile as ProfileRoleRow | null;
  if (!roleRow || roleRow.role !== 'admin') {
    return { isAdmin: false, error: 'Not authorized' };
  }

  return { isAdmin: true };
}
