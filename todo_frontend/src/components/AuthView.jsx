import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

/**
 * Authentication View for email/password sign-in and sign-up using Supabase.
 * Switches modes with a toggle and provides basic validation and status messages.
 */
// PUBLIC_INTERFACE
export default function AuthView() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const resetMessage = () => setMessage({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessage();
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please provide both email and password.' });
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Signed in. Redirecting...' });
      } else {
        const siteUrl = window.location.origin; // For email redirects if needed later
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: siteUrl }
        });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Sign-up successful. Check your email for confirmation (if enabled).'
        });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Authentication failed.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} aria-describedby="auth-helper">
        <div className="row stack" style={{ marginBottom: 10 }}>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            required
          />
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            required
          />
          <button className="btn" type="submit" disabled={busy} aria-busy={busy}>
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
        <p id="auth-helper" className="helper">
          Use a valid email address and a strong password.
        </p>
        {message.text && (
          <div role="status" aria-live="polite" className="helper" style={{ color: message.type === 'error' ? 'var(--error)' : 'var(--secondary)' }}>
            {message.text}
          </div>
        )}
      </form>

      <div className="auth-toggle">
        <span>{mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}</span>
        <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); resetMessage(); }}>
          {mode === 'signin' ? 'Create one' : 'Sign in'}
        </button>
      </div>
    </div>
  );
}
