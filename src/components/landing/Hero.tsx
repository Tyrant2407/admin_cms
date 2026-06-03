'use client';

import { motion } from 'framer-motion';
import { getCMSContent, getDefaultCMSContent } from '@/lib/api';
import styles from './Hero.module.css';
import { useEffect, useState } from 'react';
import type { CMSHeroContent } from '@/lib/types';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function Hero() {
  const defaults = getDefaultCMSContent();
  const [content, setContent] = useState<CMSHeroContent>(defaults.hero);

  useEffect(() => {
    getCMSContent().then(cms => {
      setContent(cms.hero);
    });
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroBadge}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            {content.badge}
          </motion.div>

          <motion.h1
            className={styles.heroHeading}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            {content.heading.split('\n').map((line, i) => (
              <span key={i}>
                {i === 1 ? <span>{line}</span> : line}
                {i < content.heading.split('\n').length - 1 && <br />}
              </span>
            ))}
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            {content.subheading}
          </motion.p>

          <motion.div
            className={styles.heroCtas}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <button className="btn btn-secondary" onClick={() => scrollTo('#services')} type="button">
              {content.ctaSecondary}
            </button>
            <button className="btn btn-primary" onClick={() => scrollTo('#contact')} type="button">
              {content.ctaPrimary}
            </button>
          </motion.div>

          <motion.div
            className={styles.trustRow}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            {content.trustSignals.map((signal, i) => (
              <div key={i} className={styles.trustItem}>
                <span className={styles.trustIcon}>{signal.icon}</span>
                <span>{signal.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <span className={`${styles.terminalDot} ${styles.dotRed}`} />
              <span className={`${styles.terminalDot} ${styles.dotYellow}`} />
              <span className={`${styles.terminalDot} ${styles.dotGreen}`} />
              <span className={styles.terminalTitle}>automateriz — workflow.log</span>
            </div>
            <div className={styles.terminalBody}>
              <div className={styles.termLine}>
                <span className={styles.termPrefix}>$</span>
                <span className={styles.termText}>automateriz deploy --workflow=lead-capture</span>
              </div>
              <div className={styles.termLine}>
                <span className={styles.termInfo}>→</span>
                <span className={styles.termText}>Connecting to n8n instance...</span>
              </div>
              <div className={styles.termLine}>
                <span className={styles.termSuccess}>✓</span>
                <span className={styles.termText}>Webhook configured: /api/leads</span>
              </div>
              <div className={styles.termLine}>
                <span className={styles.termSuccess}>✓</span>
                <span className={styles.termText}>WhatsApp notification: enabled</span>
              </div>
              <div className={styles.termLine}>
                <span className={styles.termSuccess}>✓</span>
                <span className={styles.termText}>Google Sheets sync: connected</span>
              </div>
              <div className={styles.termLine}>
                <span className={styles.termSuccess}>✓</span>
                <span className={styles.termText}>Email auto-responder: active</span>
              </div>
              <div className={styles.termLine}>
                <span className={styles.termInfo}>⚡</span>
                <span className={styles.termSuccess}>Workflow deployed successfully!</span>
                <span className={styles.cursor} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
