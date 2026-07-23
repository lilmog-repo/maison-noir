import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the secret key, which bypasses Row Level
 * Security entirely. This must only ever be imported from files inside /api
 * (Vercel serverless functions) — never from anything that ships to the browser.
 *
 * The /api directory is server-only by construction (Vercel doesn't bundle it
 * into the client build), so this is safe as long as nothing under src/ imports it.
 */
export function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY environment variables on the server.'
    );
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
