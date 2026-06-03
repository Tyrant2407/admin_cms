'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { useTheme } from '@/components/ThemeProvider';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = await login(email, password);
    if (user) {
      router.push('/admin/dashboard');
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className={styles.loginPage}>
      <button className={styles.themeToggle} onClick={toggleTheme} type="button" aria-label="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          AutomateRiz
        </div>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.subtitle}>Sign in to manage your dashboard</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <input
              type="email"
              id="admin-email"
              className="form-input"
              placeholder=" "
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <label htmlFor="admin-email" className="form-label">Email</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="admin-password"
              className="form-input"
              placeholder=" "
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <label htmlFor="admin-password" className="form-label">Password</label>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className={styles.backLink}>
          <a href="/">← Back to Website</a>
        </div>
      </div>
    </div>
  );
}
