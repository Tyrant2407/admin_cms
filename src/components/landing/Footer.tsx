'use client';

import styles from './Footer.module.css';

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            AutomateRiz
          </div>
          <p className={styles.tagline}>
            Building intelligent automation systems that save time, reduce errors, and scale your business.
          </p>
          <div className={styles.socialLinks}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              📷
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn"
            >
              💼
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="WhatsApp"
            >
              💬
            </a>
          </div>
        </div>

        <div>
          <h4 className={styles.colTitle}>Navigation</h4>
          <div className={styles.colLinks}>
            <button className={styles.colLink} onClick={() => scrollTo('#services')} type="button">Services</button>
            <button className={styles.colLink} onClick={() => scrollTo('#how-it-works')} type="button">How It Works</button>
            <button className={styles.colLink} onClick={() => scrollTo('#faq')} type="button">FAQ</button>
            <button className={styles.colLink} onClick={() => scrollTo('#contact')} type="button">Contact</button>
          </div>
        </div>

        <div>
          <h4 className={styles.colTitle}>Legal</h4>
          <div className={styles.colLinks}>
            <button className={styles.colLink} type="button">Privacy Policy</button>
            <button className={styles.colLink} type="button">Terms of Service</button>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} AutomateRiz. All rights reserved.
      </div>
    </footer>
  );
}
