import React, { useState } from 'react';

/**
 * Input row to add a new todo item.
 */
// PUBLIC_INTERFACE
export default function TodoInput({ onAdd }) {
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    const value = title.trim();
    if (!value) return;
    setBusy(true);
    try {
      await onAdd(value);
      setTitle('');
    } catch (err) {
      setError(err?.message || 'Failed to add task.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="row" aria-label="Add todo">
      <label htmlFor="new-todo" className="sr-only">New todo</label>
      <input
        id="new-todo"
        className="input"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={busy}
        aria-invalid={!!error}
        aria-describedby={error ? 'add-error' : undefined}
      />
      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Adding…' : 'Add'}
      </button>
      {error && (
        <span id="add-error" className="helper" style={{ color: 'var(--error)' }}>
          {error}
        </span>
      )}
    </form>
  );
}
