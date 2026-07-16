import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './supabaseEnv';

export { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured };

let client: SupabaseClient | null = null;

/** Lazily created Supabase client — returns null when env vars are missing
 *  so the static site still renders (forms show a friendly error instead).
 *  Sessions persist in localStorage for the admin panel login.
 *  NOTE: import this only from admin code — public components should use
 *  plain fetch + `supabaseEnv.ts` so visitors don't download supabase-js. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}

/** Non-null variant for admin pages (they only render when configured). */
export function requireSupabase(): SupabaseClient {
  const c = getSupabase();
  if (!c) throw new Error('Supabase is not configured');
  return c;
}
