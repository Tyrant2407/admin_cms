'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { logout } from '@/lib/api';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', icon: '📊', href: '/admin/dashboard' },
  { label: 'Leads', icon: '📋', href: '/admin/leads' },
  { label: 'Landing Page', icon: '🏠', href: '/admin/content' },
  { label: 'Settings', icon: '⚙️', href: '/admin/settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleNav = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <button className={styles.mobileMenuBtn} onClick={() => setMobileOpen(true)} type="button" aria-label="Open menu">
          ☰
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>AutomateRiz</span>
        <button className={styles.mobileMenuBtn} onClick={toggleTheme} type="button" aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${mobileOpen ? styles.overlayVisible : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} ${mobileOpen ? styles.sidebarOpen : ''}`}
      >
        <button className={styles.toggleBtn} onClick={onToggle} type="button" aria-label="Toggle sidebar">
          {collapsed ? '→' : '←'}
        </button>

        <div className={styles.header}>
          <a href="/admin/dashboard" className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>AutomateRiz</span>
          </a>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <button
              key={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
              onClick={() => handleNav(item.href)}
              type="button"
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>A</div>
            <div>
              <div className={styles.userName}>Admin</div>
              <div className={styles.userEmail}>admin@automateriz.com</div>
            </div>
          </div>
          <button
            className={styles.navItem}
            onClick={toggleTheme}
            type="button"
          >
            <span className={styles.navIcon}>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className={styles.navLabel}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            className={styles.navItem}
            onClick={handleLogout}
            type="button"
            style={{ color: 'var(--danger)' }}
          >
            <span className={styles.navIcon}>🚪</span>
            <span className={styles.navLabel}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
