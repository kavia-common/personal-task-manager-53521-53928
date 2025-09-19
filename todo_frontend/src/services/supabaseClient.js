import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client configured using environment variables.
 * Required env:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY
 * Note: Values must be provided via .env for this frontend app.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

// Validate environment early to provide clearer errors at startup rather than failing on first API call.
if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Supabase configuration missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in your .env file. See SUPABASE.md for details.'
  );
  throw new Error(
    'Supabase is not configured. Missing REACT_APP_SUPABASE_URL and/or REACT_APP_SUPABASE_KEY.'
  );
}

// PUBLIC_INTERFACE
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
