'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/api';
import Sidebar from '@/components/admin/Sidebar';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setAuthChecked(true);
      return;
    }

    isAuthenticated().then(auth => {
      if (!auth) {
        router.push('/admin/login');
      } else {
        setAuthChecked(true);
      }
    });
  }, [pathname, router]);

  // Login page doesn't need admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={`${styles.adminBody} ${collapsed ? styles.adminBodyCollapsed : ''}`}>
        <div className={styles.adminContent}>
          {children}
        </div>
      </div>
    </div>
  );
}
