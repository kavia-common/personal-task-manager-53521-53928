Supabase Integration - Frontend (todo_frontend)

Environment variables (set these in .env at the root of the todo_frontend app):
- REACT_APP_SUPABASE_URL: e.g., https://YOUR-PROJECT-REF.supabase.co
- REACT_APP_SUPABASE_KEY: the anon public API key

Auth:
- This app uses email/password authentication.
- Sign up will use options.emailRedirectTo = window.location.origin.
- After confirming (if email confirm is enabled), users can sign in.

Database:
Create a 'todos' table with at least these columns:
- id: uuid (default value: gen_random_uuid() or uuid_generate_v4())
- created_at: timestamp with time zone, default now()
- title: text
- is_complete: boolean default false
- user_id: uuid (references auth.users.id)

Row Level Security (RLS) policies:
Enable RLS on the 'todos' table and add:
1) Allow INSERT for authenticated users to insert rows with their user_id:
   USING (auth.role() = 'authenticated') WITH CHECK (user_id = auth.uid())
2) Allow SELECT for authenticated users to see only their rows:
   USING (user_id = auth.uid())
3) Allow UPDATE for authenticated users on their rows:
   USING (user_id = auth.uid())
4) Allow DELETE for authenticated users on their rows:
   USING (user_id = auth.uid())

Optional Realtime:
Enable Realtime on the 'todos' table to receive live updates.

Note:
This repository is frontend-only; ensure the Supabase project is configured accordingly.
