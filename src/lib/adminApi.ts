import { requireSupabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';

const ADMIN_FN_URL = `${SUPABASE_URL}/functions/v1/admin`;

async function callAdminFn<T>(body: Record<string, unknown>, withUserJwt = false): Promise<T> {
  let token = SUPABASE_ANON_KEY;
  if (withUserJwt) {
    const { data } = await requireSupabase().auth.getSession();
    token = data.session?.access_token ?? SUPABASE_ANON_KEY;
  }
  const res = await fetch(ADMIN_FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok && json?.error) throw new Error(json.error);
  return json as T;
}

export const checkAdminExists = () =>
  callAdminFn<{ adminExists: boolean }>({ action: 'check_exists' });

export const bootstrapAdmin = (email: string, password: string) =>
  callAdminFn<{ ok?: boolean; error?: string }>({ action: 'bootstrap', email, password });

export const testProvider = (id: string) =>
  callAdminFn<{ ok: boolean; sample?: string; error?: string }>(
    { action: 'test_provider', id },
    true
  );

export const forgotPassword = () =>
  callAdminFn<{ ok?: boolean; maskedEmail?: string; error?: string }>({
    action: 'forgot_password',
  });

export const resetPassword = (code: string, newPassword: string) =>
  callAdminFn<{ ok?: boolean; error?: string }>({
    action: 'reset_password',
    code,
    newPassword,
  });

/** Signed-in user is an admin? (reads own user_roles row under RLS) */
export async function isAdmin(): Promise<boolean> {
  const supabase = requireSupabase();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;
  const { data } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', userData.user.id)
    .eq('role', 'admin')
    .maybeSingle();
  return Boolean(data);
}

export function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
