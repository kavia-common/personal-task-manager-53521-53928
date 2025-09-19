import React from 'react';

/**
 * Simple light/dark theme toggle button.
 */
// PUBLIC_INTERFACE
export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
