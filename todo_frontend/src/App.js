import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import { supabase } from './services/supabaseClient';
import AuthView from './components/AuthView';
import TodoView from './components/TodoView';
import ThemeToggle from './components/ThemeToggle';

/**
 * App entry: switches between unauthenticated Authentication UI and the authenticated Todo UI.
 * Applies Ocean Professional theme styles and manages dark/light preference.
 */
// PUBLIC_INTERFACE
function App() {
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    // Apply theme attribute for CSS variables
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Initialize session and listen for auth changes
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => {
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const user = useMemo(() => session?.user ?? null, [session]);

  // PUBLIC_INTERFACE
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="app-root ocean-bg">
      <div className="ocean-gradient" aria-hidden="true"></div>
      <main className="container">
        <header className="header">
          <h1 className="title">Ocean Tasks</h1>
          <p className="subtitle">Minimal, fast, and focused.</p>
          <div className="header-actions" role="group" aria-label="Display controls">
            <ThemeToggle theme={theme} onToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />
            {user && (
              <button className="btn btn-secondary" onClick={handleSignOut} aria-label="Sign out">
                Sign out
              </button>
            )}
          </div>
        </header>

        {!user ? (
          <section aria-labelledby="auth-section-title" className="card">
            <h2 id="auth-section-title" className="sr-only">Authentication</h2>
            <AuthView />
          </section>
        ) : (
          <section aria-labelledby="todo-section-title" className="card">
            <h2 id="todo-section-title" className="sr-only">Your Todo List</h2>
            <TodoView user={user} />
          </section>
        )}

        <footer className="footer">
          <small className="muted">Signed in as: {user?.email ?? 'Guest'}</small>
        </footer>
      </main>
    </div>
  );
}

export default App;
