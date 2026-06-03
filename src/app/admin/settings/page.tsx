'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword, logout } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);

    const success = await changePassword(oldPassword, newPassword);
    if (success) {
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: 'Current password is incorrect' });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.8rem',
        marginBottom: 32,
      }}>
        Settings
      </h1>

      {/* Change Password */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 32,
        marginBottom: 24,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.1rem',
          marginBottom: 24,
        }}>
          🔐 Change Password
        </h3>

        {message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 20,
            fontSize: '0.85rem',
            background: message.type === 'success'
              ? 'rgba(var(--success-rgb), 0.1)'
              : 'rgba(var(--danger-rgb), 0.1)',
            border: `1px solid ${message.type === 'success'
              ? 'rgba(var(--success-rgb), 0.3)'
              : 'rgba(var(--danger-rgb), 0.3)'}`,
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
          }}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <input
              type="password"
              id="old-password"
              className="form-input"
              placeholder=" "
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
            />
            <label htmlFor="old-password" className="form-label">Current Password</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="new-password"
              className="form-input"
              placeholder=" "
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <label htmlFor="new-password" className="form-label">New Password</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="confirm-password"
              className="form-input"
              placeholder=" "
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <label htmlFor="confirm-password" className="form-label">Confirm New Password</label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <><span className="spinner" /> Updating...</>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 32,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.1rem',
          marginBottom: 12,
        }}>
          🚪 Session
        </h3>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          marginBottom: 20,
        }}>
          Signed in as <strong>admin@automateriz.com</strong>
        </p>
        <button
          className="btn btn-danger"
          onClick={handleLogout}
          type="button"
          style={{ width: '100%' }}
        >
          Logout
        </button>
      </div>

      {/* Demo Info */}
      <div style={{
        marginTop: 24,
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(var(--accent-2-rgb), 0.05)',
        border: '1px solid rgba(var(--accent-2-rgb), 0.2)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        lineHeight: 1.7,
      }}>
        <strong style={{ color: 'var(--accent-2)' }}>ℹ️ Demo Mode</strong><br />
        Default credentials: <code style={{ fontFamily: 'var(--font-mono)' }}>admin@automateriz.com</code> / <code style={{ fontFamily: 'var(--font-mono)' }}>admin123</code>
      </div>
    </div>
  );
}
