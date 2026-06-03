'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCMSContent, getDefaultCMSContent } from '@/lib/api';
import styles from './FAQ.module.css';
import type { CMSFAQContent } from '@/lib/types';

export default function FAQ() {
  const defaults = getDefaultCMSContent();
  const [content, setContent] = useState<CMSFAQContent>(defaults.faq);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    getCMSContent().then(cms => {
      setContent(cms.faq);
    });
  }, []);

  const toggle = (index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  return (
    <section className={styles.faq} id="faq">
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

        <div className={styles.list}>
          {content.items.map((item, i) => (
            <motion.div
              key={i}
              className={`${styles.item} ${openIndex === i ? styles.itemOpen : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <button
                className={styles.question}
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                type="button"
              >
                <span>{item.question}</span>
                <span className={`${styles.icon} ${openIndex === i ? styles.iconOpen : ''}`}>
                  +
                </span>
              </button>
              <div className={`${styles.answerWrap} ${openIndex === i ? styles.answerWrapOpen : ''}`}>
                <div className={styles.answerInner}>
                  <p className={styles.answer}>{item.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
