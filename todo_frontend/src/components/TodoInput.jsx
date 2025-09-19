import React, { useState } from 'react';

/**
 * Input row to add a new todo item.
 */
// PUBLIC_INTERFACE
export default function TodoInput({ onAdd }) {
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    const value = title.trim();
    if (!value) return;
    setBusy(true);
    try {
      await onAdd(value);
      setTitle('');
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
      />
      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Adding…' : 'Add'}
      </button>
    </form>
  );
}
