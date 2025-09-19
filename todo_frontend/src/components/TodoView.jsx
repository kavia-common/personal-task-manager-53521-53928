import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { addTodo, deleteTodo, fetchTodos, updateTodo } from '../services/todoService';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';

/**
 * Todo view for authenticated users: shows list and provides CRUD operations.
 * Uses Supabase for storage and real-time updates on the 'todos' table.
 */
// PUBLIC_INTERFACE
export default function TodoView({ user }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Initial fetch
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setLoadError('');
      try {
        const data = await fetchTodos(user.id);
        if (isMounted) setTodos(data);
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setLoadError(e?.message || 'Failed to load your tasks. Check database policies and network.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [user.id]);

  // Real-time updates
  useEffect(() => {
    // Subscribe to only this user's todo changes on the server side to avoid noisy/unrelated events.
    const channel = supabase
      .channel('todos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${user.id}`
        },
        payload => {
          setTodos(prev => {
            switch (payload.eventType) {
              case 'INSERT':
                return [payload.new, ...prev];
              case 'UPDATE':
                return prev.map(t => (t.id === payload.new.id ? payload.new : t));
              case 'DELETE':
                return prev.filter(t => t.id !== payload.old.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

  // PUBLIC_INTERFACE
  const handleAdd = async (title) => {
    try {
      const created = await addTodo({ userId: user.id, title });
      // Optimistic update is unnecessary due to realtime, but keep in case channel is disabled
      setTodos(prev => [created, ...prev]);
    } catch (err) {
      // Log for developers; in a larger app, lift a toast/message.
      console.error('Failed to add todo:', err?.message || err);
    }
  };

  // PUBLIC_INTERFACE
  const handleToggle = async (todo) => {
    const updated = await updateTodo(todo.id, { is_complete: !todo.is_complete });
    setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
  };

  // PUBLIC_INTERFACE
  const handleRename = async (id, newTitle) => {
    const updated = await updateTodo(id, { title: newTitle });
    setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
  };

  // PUBLIC_INTERFACE
  const handleDelete = async (todo) => {
    await deleteTodo(todo.id);
    setTodos(prev => prev.filter(t => t.id !== todo.id));
  };

  return (
    <div>
      <TodoInput onAdd={handleAdd} />
      <div className="todo-list" role="list" aria-busy={loading}>
        {loading ? (
          <p className="helper">Loading your tasks…</p>
        ) : loadError ? (
          <p className="helper" style={{ color: 'var(--error)' }}>
            {loadError}
          </p>
        ) : todos.length === 0 ? (
          <p className="helper">No tasks yet. Add your first one!</p>
        ) : (
          todos.map((t) => (
            <div role="listitem" key={t.id}>
              <TodoItem
                todo={t}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
