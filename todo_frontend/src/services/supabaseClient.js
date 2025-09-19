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

// PUBLIC_INTERFACE
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
