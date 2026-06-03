'use client';

import { motion } from 'framer-motion';
import { getCMSContent, getDefaultCMSContent } from '@/lib/api';
import styles from './Services.module.css';
import { useEffect, useState } from 'react';
import type { CMSServicesContent } from '@/lib/types';

export default function Services() {
  const defaults = getDefaultCMSContent();
  const [content, setContent] = useState<CMSServicesContent>(defaults.services);

  useEffect(() => {
    getCMSContent().then(cms => {
      setContent(cms.services);
    });
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={styles.services} id="services">
      <div className={styles.servicesInner}>
        <motion.h2
          className={`heading-lg ${styles.heading}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          {content.heading}
        </motion.h2>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Choose the service that fits your needs. We tailor every solution to your business.
        </motion.p>

        <div className={styles.cards}>
          {content.cards.map((card, i) => (
            <motion.div
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <span className={styles.cardIcon}>{card.icon}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.description}</p>
              <div className={styles.tags}>
                {card.tags.map((tag, j) => (
                  <span key={j} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <button
                className={styles.cardCta}
                onClick={() => scrollTo('#contact')}
                type="button"
              >
                {card.ctaLabel}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
