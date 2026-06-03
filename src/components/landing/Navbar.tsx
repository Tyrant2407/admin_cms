'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import styles from './Navbar.module.css';

const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`} id="navbar">
        <div className={styles.navInner}>
          <a href="/" className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            AutomateRiz
          </a>

          <ul className={styles.navLinks}>
            {navItems.map((item) => (
              <li key={item.href}>
                <button
                  className={styles.navLink}
                  onClick={() => scrollTo(item.href)}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label="Toggle theme"
              type="button"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              className={styles.ctaBtn}
              onClick={() => scrollTo('#contact')}
              type="button"
            >
              Get Started
            </button>
            <button
              className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              type="button"
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayVisible : ''}`}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className={`${styles.mobileDrawer} ${mobileOpen ? styles.mobileDrawerOpen : ''}`}>
        {navItems.map((item) => (
          <button
            key={item.href}
            className={styles.mobileLink}
            onClick={() => scrollTo(item.href)}
            type="button"
          >
            {item.label}
          </button>
        ))}
        <div className={styles.mobileCta}>
          <button
            className="btn btn-primary"
            onClick={() => scrollTo('#contact')}
            style={{ width: '100%' }}
            type="button"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
