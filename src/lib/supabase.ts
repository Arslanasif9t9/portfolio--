import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseKey && !supabaseKey.startsWith('PASTE_')
);

let client: SupabaseClient | null = null;

/** Lazily created Supabase client — returns null when env vars are missing
 *  so the static site still renders (forms show a friendly error instead). */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl!, supabaseKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
