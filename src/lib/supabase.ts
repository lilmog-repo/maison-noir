import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  // Fails loudly at build/dev time rather than silently returning empty data later.
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Check your .env.local (local dev) or Vercel project environment variables (deployed).'
  );
}

/**
 * Browser-safe Supabase client. Uses the publishable key only — this key is
 * meant to be exposed in client-side code and relies on Row Level Security
 * (see supabase/migrations/0001_init.sql) to restrict what it can read/write.
 * Never import the secret key into this file or anything it's imported by.
 */
export const supabase = createClient(url, publishableKey);
