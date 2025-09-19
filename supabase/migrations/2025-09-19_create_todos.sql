-- Migration: Create public.todos table with RLS for Things Todo app
-- Safe to run multiple times due to IF NOT EXISTS and DO blocks.

-- Enable required extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- 1) Table
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text null,
  status text null,
  is_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.todos is 'User-scoped todos for Things Todo app.';
comment on column public.todos.user_id is 'Owner of the todo (auth.users.id).';
comment on column public.todos.title is 'Short title of the task.';
comment on column public.todos.description is 'Optional longer description.';
comment on column public.todos.status is 'Optional status label (e.g., pending, in_progress, done).';
comment on column public.todos.is_complete is 'Compatibility flag used by the current frontend.';
comment on column public.todos.created_at is 'Creation timestamp.';
comment on column public.todos.updated_at is 'Last update timestamp.';

-- 2) Updated_at trigger to auto-update timestamp
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'todos_set_updated_at'
  ) then
    create trigger todos_set_updated_at
    before update on public.todos
    for each row
    execute procedure public.set_updated_at();
  end if;
end $$;

-- 3) Security: RLS on and policies
alter table public.todos enable row level security;

-- Drop existing policies if present to make this idempotent
do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='todos' and policyname='todos_select_own') then
    drop policy "todos_select_own" on public.todos;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='todos' and policyname='todos_insert_own') then
    drop policy "todos_insert_own" on public.todos;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='todos' and policyname='todos_update_own') then
    drop policy "todos_update_own" on public.todos;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='todos' and policyname='todos_delete_own') then
    drop policy "todos_delete_own" on public.todos;
  end if;
end $$;

-- Policies:
-- Allow authenticated users to read only their rows
create policy "todos_select_own"
on public.todos
for select
to authenticated
using (user_id = auth.uid());

-- Allow authenticated users to insert rows where user_id = their uid
create policy "todos_insert_own"
on public.todos
for insert
to authenticated
with check (user_id = auth.uid());

-- Allow authenticated users to update only their rows
create policy "todos_update_own"
on public.todos
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Allow authenticated users to delete only their rows
create policy "todos_delete_own"
on public.todos
for delete
to authenticated
using (user_id = auth.uid());

-- 4) Optional: Realtime (handled via Supabase dashboard typically)
-- Make sure Realtime is enabled for the 'todos' table if you want live updates.

-- 5) Indexes for performance
create index if not exists idx_todos_user_id_created_at on public.todos(user_id, created_at desc);
create index if not exists idx_todos_user_id_is_complete on public.todos(user_id, is_complete);
