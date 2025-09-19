# Supabase Database Setup for Things Todo

This folder contains SQL migrations to set up the required database schema for the frontend app.

## Prerequisites

- A Supabase project.
- Database connection string (Project Settings → Database → Connection Info).
- psql installed (this environment has `/usr/bin/psql`).

If you had a `db_connection.txt` with a ready-to-use psql command, you can use that directly. Otherwise, use the standard connection string from the Supabase dashboard.

## Apply the migration

1) Copy your connection string (replace placeholders below). For example, using psql:

```
PGPASSWORD='<YOUR_DB_PASSWORD>' psql \
  -h db.<YOUR-PROJECT-REF>.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  -v ON_ERROR_STOP=1 \
  -f supabase/migrations/2025-09-19_create_todos.sql
```

Notes:
- You can also connect using the pooled connection string or a service role connection string if preferred.
- Ensure your IP is allowed if your project has IP restrictions.

2) Verify the table exists:

```
psql "host=db.<YOUR-PROJECT-REF>.supabase.co port=5432 dbname=postgres user=postgres password=<YOUR_DB_PASSWORD> sslmode=require" \
  -c "\\d+ public.todos"
```

You should see columns:
- id (uuid, PK, default gen_random_uuid())
- user_id (uuid, references auth.users)
- title (text)
- description (text, nullable)
- status (text, nullable)
- is_complete (boolean, default false) — used by current frontend
- created_at (timestamptz, default now())
- updated_at (timestamptz, auto-updated by trigger)

RLS is enabled with policies allowing authenticated users to access only their own rows.

## Frontend environment

Set the following in `personal-task-manager-53521-53928/todo_frontend/.env`:

- REACT_APP_SUPABASE_URL=https://<YOUR-PROJECT-REF>.supabase.co
- REACT_APP_SUPABASE_KEY=<anon-public-key>

See `todo_frontend/SUPABASE.md` for more details.
