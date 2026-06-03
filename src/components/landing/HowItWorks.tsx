'use client';

import { motion } from 'framer-motion';
import { getCMSContent, getDefaultCMSContent } from '@/lib/api';
import styles from './HowItWorks.module.css';
import { useEffect, useState } from 'react';
import type { CMSHowItWorksContent } from '@/lib/types';

export default function HowItWorks() {
  const defaults = getDefaultCMSContent();
  const [content, setContent] = useState<CMSHowItWorksContent>(defaults.howItWorks);

  useEffect(() => {
    getCMSContent().then(cms => {
      setContent(cms.howItWorks);
    });
  }, []);

  return (
    <section className={styles.howItWorks} id="how-it-works">
      <div className={styles.inner}>
        <motion.h2
          className={`heading-lg ${styles.heading}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          {content.heading}
        </motion.h2>

        <div className={styles.steps}>
          {content.steps.map((step, i) => (
            <motion.div
              key={i}
              className={styles.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className={styles.stepNumber}>{step.icon}</div>
              <div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
