import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseKey && !supabaseKey.startsWith('PASTE_')
);

export const SUPABASE_URL = supabaseUrl ?? '';
export const SUPABASE_ANON_KEY = supabaseKey ?? '';

let client: SupabaseClient | null = null;

/** Lazily created Supabase client — returns null when env vars are missing
 *  so the static site still renders (forms show a friendly error instead).
 *  Sessions persist in localStorage for the admin panel login. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl!, supabaseKey!, {
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
