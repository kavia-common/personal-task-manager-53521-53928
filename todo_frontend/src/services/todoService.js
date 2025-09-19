/**
 * Service functions for Todo CRUD operations using Supabase.
 * Todos are scoped by the authenticated user's id (user_id column).
 */
import { supabase } from './supabaseClient';

// PUBLIC_INTERFACE
export async function fetchTodos(userId) {
  /** Fetch all todos for a user ordered by created_at desc. */
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// PUBLIC_INTERFACE
export async function addTodo({ userId, title }) {
  /** Create a new todo for the given user */
  const { data, error } = await supabase
    .from('todos')
    .insert([{ title, is_complete: false, user_id: userId }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function updateTodo(id, updates) {
  /** Update fields on a todo by id */
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function deleteTodo(id) {
  /** Delete a todo by id */
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
