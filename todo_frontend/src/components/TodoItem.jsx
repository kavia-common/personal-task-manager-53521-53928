import React, { useState } from 'react';

/**
 * Renders a single todo item with controls to mark complete, edit title, and delete.
 */
// PUBLIC_INTERFACE
export default function TodoItem({ todo, onToggle, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || title === todo.title) {
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      await onRename(todo.id, title.trim());
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="todo-item" role="group" aria-label={`Todo ${todo.title}`}>
      <input
        className="checkbox"
        type="checkbox"
        checked={!!todo.is_complete}
        aria-label={todo.is_complete ? 'Mark incomplete' : 'Mark complete'}
        onChange={() => onToggle(todo)}
      />
      <div className={`todo-title ${todo.is_complete ? 'completed' : ''}`}>
        {editing ? (
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setEditing(false);
            }}
            disabled={busy}
            aria-label="Edit task title"
            autoFocus
          />
        ) : (
          <span>{todo.title}</span>
        )}
      </div>
      <div className="todo-actions">
        {editing ? (
          <>
            <button className="btn btn-secondary" onClick={handleSave} disabled={busy} aria-busy={busy}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setEditing(false)} disabled={busy}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={() => setEditing(true)} disabled={busy}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(todo)} disabled={busy} aria-label="Delete todo">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
