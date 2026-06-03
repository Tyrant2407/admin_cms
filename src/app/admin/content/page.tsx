'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getCMSContent, updateCMSContent, getDefaultCMSContent } from '@/lib/api';
import type { CMSContent } from '@/lib/types';
import styles from './content.module.css';

type Section = 'hero' | 'services' | 'howItWorks' | 'faq';

export default function ContentEditorPage() {
  const [content, setContent] = useState<CMSContent | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const draftTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getCMSContent().then(data => setContent(data));
  }, []);

  // Auto-save draft to localStorage
  const saveDraft = useCallback((data: CMSContent) => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      localStorage.setItem('automateriz_cms_draft', JSON.stringify(data));
    }, 3000);
  }, []);

  const updateContent = useCallback((updater: (prev: CMSContent) => CMSContent) => {
    setContent(prev => {
      if (!prev) return prev;
      const updated = updater(prev);
      saveDraft(updated);
      return updated;
    });
  }, [saveDraft]);

  const handlePublish = async () => {
    if (!content) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    try {
      const success = await updateCMSContent(content);
      if (!success) throw new Error();
      localStorage.removeItem('automateriz_cms_draft');
      showToast('success', 'Content published successfully!');
    } catch {
      showToast('error', 'Failed to publish. Please try again.');
    }
    setSaving(false);
  };

  const handleReset = () => {
    setContent(getDefaultCMSContent());
    showToast('success', 'Content reset to defaults');
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  if (!content) return null;

  // Helper for adding a new tag to service card
  const addTagToCard = (cardIndex: number, inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input || !input.value.trim()) return;
    updateContent(prev => {
      const cards = [...prev.services.cards];
      cards[cardIndex] = { ...cards[cardIndex], tags: [...cards[cardIndex].tags, input.value.trim()] };
      return { ...prev, services: { ...prev.services, cards } };
    });
    input.value = '';
  };

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h1 className={styles.title}>Landing Page Content</h1>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary btn-sm" onClick={handleReset} type="button">
            🔄 Reset
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handlePublish}
            disabled={saving}
            type="button"
          >
            {saving ? <><span className="spinner" /> Publishing...</> : '🚀 Save & Publish'}
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { key: 'hero' as Section, label: '🏠 Hero' },
          { key: 'services' as Section, label: '💼 Services' },
          { key: 'howItWorks' as Section, label: '📋 How It Works' },
          { key: 'faq' as Section, label: '❓ FAQ' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeSection === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveSection(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.editorCard}>
        {/* Hero Editor */}
        {activeSection === 'hero' && (
          <>
            <h3 className={styles.sectionTitle}>🏠 Hero Section</h3>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Badge Text</label>
              <input
                className={styles.fieldInput}
                value={content.hero.badge}
                onChange={e => updateContent(prev => ({
                  ...prev, hero: { ...prev.hero, badge: e.target.value }
                }))}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Heading (use \n for line break)</label>
              <textarea
                className={styles.fieldTextarea}
                value={content.hero.heading}
                maxLength={80}
                onChange={e => updateContent(prev => ({
                  ...prev, hero: { ...prev.hero, heading: e.target.value }
                }))}
              />
              <div className={styles.charCount}>{content.hero.heading.length}/80</div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Sub-heading</label>
              <textarea
                className={styles.fieldTextarea}
                value={content.hero.subheading}
                maxLength={200}
                onChange={e => updateContent(prev => ({
                  ...prev, hero: { ...prev.hero, subheading: e.target.value }
                }))}
              />
              <div className={styles.charCount}>{content.hero.subheading.length}/200</div>
            </div>

            <div className={styles.fieldGroup} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className={styles.fieldLabel}>CTA Primary Label</label>
                <input
                  className={styles.fieldInput}
                  value={content.hero.ctaPrimary}
                  onChange={e => updateContent(prev => ({
                    ...prev, hero: { ...prev.hero, ctaPrimary: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className={styles.fieldLabel}>CTA Secondary Label</label>
                <input
                  className={styles.fieldInput}
                  value={content.hero.ctaSecondary}
                  onChange={e => updateContent(prev => ({
                    ...prev, hero: { ...prev.hero, ctaSecondary: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Trust Signals</label>
              <div className={styles.listItems}>
                {content.hero.trustSignals.map((signal, i) => (
                  <div key={i} className={styles.listItem}>
                    <div className={styles.listItemFields}>
                      <div className={styles.listItemRow}>
                        <input
                          className={`${styles.fieldInput} ${styles.listItemSmall}`}
                          value={signal.icon}
                          placeholder="Icon"
                          onChange={e => updateContent(prev => {
                            const signals = [...prev.hero.trustSignals];
                            signals[i] = { ...signals[i], icon: e.target.value };
                            return { ...prev, hero: { ...prev.hero, trustSignals: signals } };
                          })}
                        />
                        <input
                          className={styles.fieldInput}
                          value={signal.text}
                          placeholder="Text"
                          onChange={e => updateContent(prev => {
                            const signals = [...prev.hero.trustSignals];
                            signals[i] = { ...signals[i], text: e.target.value };
                            return { ...prev, hero: { ...prev.hero, trustSignals: signals } };
                          })}
                        />
                      </div>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => updateContent(prev => ({
                        ...prev, hero: {
                          ...prev.hero,
                          trustSignals: prev.hero.trustSignals.filter((_, j) => j !== i)
                        }
                      }))}
                      type="button"
                    >×</button>
                  </div>
                ))}
                <button
                  className={styles.addBtn}
                  onClick={() => updateContent(prev => ({
                    ...prev, hero: {
                      ...prev.hero,
                      trustSignals: [...prev.hero.trustSignals, { icon: '📌', text: 'New Signal' }]
                    }
                  }))}
                  type="button"
                >+ Add Trust Signal</button>
              </div>
            </div>
          </>
        )}

        {/* Services Editor */}
        {activeSection === 'services' && (
          <>
            <h3 className={styles.sectionTitle}>💼 Services Section</h3>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Section Heading</label>
              <input
                className={styles.fieldInput}
                value={content.services.heading}
                onChange={e => updateContent(prev => ({
                  ...prev, services: { ...prev.services, heading: e.target.value }
                }))}
              />
            </div>

            {content.services.cards.map((card, ci) => (
              <div key={ci} className={styles.serviceCardEditor}>
                <h4 className={styles.serviceCardTitle}>{card.icon} Card {ci + 1}</h4>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Icon (emoji)</label>
                  <input
                    className={`${styles.fieldInput} ${styles.listItemSmall}`}
                    value={card.icon}
                    onChange={e => updateContent(prev => {
                      const cards = [...prev.services.cards];
                      cards[ci] = { ...cards[ci], icon: e.target.value };
                      return { ...prev, services: { ...prev.services, cards } };
                    })}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Title</label>
                  <input
                    className={styles.fieldInput}
                    value={card.title}
                    onChange={e => updateContent(prev => {
                      const cards = [...prev.services.cards];
                      cards[ci] = { ...cards[ci], title: e.target.value };
                      return { ...prev, services: { ...prev.services, cards } };
                    })}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Description</label>
                  <textarea
                    className={styles.fieldTextarea}
                    value={card.description}
                    onChange={e => updateContent(prev => {
                      const cards = [...prev.services.cards];
                      cards[ci] = { ...cards[ci], description: e.target.value };
                      return { ...prev, services: { ...prev.services, cards } };
                    })}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Tags</label>
                  <div className={styles.tagsWrap}>
                    {card.tags.map((tag, ti) => (
                      <span key={ti} className={styles.tagItem}>
                        {tag}
                        <button
                          className={styles.tagRemove}
                          onClick={() => updateContent(prev => {
                            const cards = [...prev.services.cards];
                            cards[ci] = { ...cards[ci], tags: cards[ci].tags.filter((_, j) => j !== ti) };
                            return { ...prev, services: { ...prev.services, cards } };
                          })}
                          type="button"
                        >×</button>
                      </span>
                    ))}
                  </div>
                  <div className={styles.tagInput}>
                    <input
                      id={`tag-input-${ci}`}
                      className={styles.fieldInput}
                      placeholder="Add tag..."
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTagToCard(ci, `tag-input-${ci}`))}
                    />
                    <button
                      className={styles.tagAddBtn}
                      onClick={() => addTagToCard(ci, `tag-input-${ci}`)}
                      type="button"
                    >Add</button>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>CTA Label</label>
                  <input
                    className={styles.fieldInput}
                    value={card.ctaLabel}
                    onChange={e => updateContent(prev => {
                      const cards = [...prev.services.cards];
                      cards[ci] = { ...cards[ci], ctaLabel: e.target.value };
                      return { ...prev, services: { ...prev.services, cards } };
                    })}
                  />
                </div>
              </div>
            ))}
          </>
        )}

        {/* How It Works Editor */}
        {activeSection === 'howItWorks' && (
          <>
            <h3 className={styles.sectionTitle}>📋 How It Works Section</h3>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Section Heading</label>
              <input
                className={styles.fieldInput}
                value={content.howItWorks.heading}
                onChange={e => updateContent(prev => ({
                  ...prev, howItWorks: { ...prev.howItWorks, heading: e.target.value }
                }))}
              />
            </div>

            <div className={styles.listItems}>
              {content.howItWorks.steps.map((step, i) => (
                <div key={i} className={styles.listItem}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(var(--accent-rgb), 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)',
                    minWidth: 32,
                  }}>
                    {i + 1}
                  </div>
                  <div className={styles.listItemFields}>
                    <div className={styles.listItemRow}>
                      <input
                        className={`${styles.fieldInput} ${styles.listItemSmall}`}
                        value={step.icon}
                        placeholder="Icon"
                        onChange={e => updateContent(prev => {
                          const steps = [...prev.howItWorks.steps];
                          steps[i] = { ...steps[i], icon: e.target.value };
                          return { ...prev, howItWorks: { ...prev.howItWorks, steps } };
                        })}
                      />
                      <input
                        className={styles.fieldInput}
                        value={step.title}
                        placeholder="Title"
                        onChange={e => updateContent(prev => {
                          const steps = [...prev.howItWorks.steps];
                          steps[i] = { ...steps[i], title: e.target.value };
                          return { ...prev, howItWorks: { ...prev.howItWorks, steps } };
                        })}
                      />
                    </div>
                    <input
                      className={styles.fieldInput}
                      value={step.description}
                      placeholder="Description"
                      onChange={e => updateContent(prev => {
                        const steps = [...prev.howItWorks.steps];
                        steps[i] = { ...steps[i], description: e.target.value };
                        return { ...prev, howItWorks: { ...prev.howItWorks, steps } };
                      })}
                    />
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => updateContent(prev => ({
                      ...prev, howItWorks: {
                        ...prev.howItWorks,
                        steps: prev.howItWorks.steps.filter((_, j) => j !== i)
                      }
                    }))}
                    type="button"
                  >×</button>
                </div>
              ))}
              <button
                className={styles.addBtn}
                onClick={() => updateContent(prev => ({
                  ...prev, howItWorks: {
                    ...prev.howItWorks,
                    steps: [...prev.howItWorks.steps, { icon: '📌', title: 'New Step', description: 'Description' }]
                  }
                }))}
                type="button"
              >+ Add Step</button>
            </div>
          </>
        )}

        {/* FAQ Editor */}
        {activeSection === 'faq' && (
          <>
            <h3 className={styles.sectionTitle}>❓ FAQ Section</h3>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Section Heading</label>
              <input
                className={styles.fieldInput}
                value={content.faq.heading}
                onChange={e => updateContent(prev => ({
                  ...prev, faq: { ...prev.faq, heading: e.target.value }
                }))}
              />
            </div>

            <div className={styles.listItems}>
              {content.faq.items.map((item, i) => (
                <div key={i} className={styles.listItem}>
                  <div className={styles.listItemFields}>
                    <input
                      className={styles.fieldInput}
                      value={item.question}
                      placeholder="Question"
                      onChange={e => updateContent(prev => {
                        const items = [...prev.faq.items];
                        items[i] = { ...items[i], question: e.target.value };
                        return { ...prev, faq: { ...prev.faq, items } };
                      })}
                    />
                    <textarea
                      className={styles.fieldTextarea}
                      value={item.answer}
                      placeholder="Answer"
                      rows={3}
                      onChange={e => updateContent(prev => {
                        const items = [...prev.faq.items];
                        items[i] = { ...items[i], answer: e.target.value };
                        return { ...prev, faq: { ...prev.faq, items } };
                      })}
                    />
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => updateContent(prev => ({
                      ...prev, faq: {
                        ...prev.faq,
                        items: prev.faq.items.filter((_, j) => j !== i)
                      }
                    }))}
                    type="button"
                  >×</button>
                </div>
              ))}
              <button
                className={styles.addBtn}
                onClick={() => updateContent(prev => ({
                  ...prev, faq: {
                    ...prev.faq,
                    items: [...prev.faq.items, { question: 'New Question?', answer: 'Answer here...' }]
                  }
                }))}
                type="button"
              >+ Add FAQ Item</button>
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}
    </div>
  );
}
