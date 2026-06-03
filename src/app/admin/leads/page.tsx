'use client';

import { useEffect, useState, useMemo } from 'react';
import { getLeads, deleteLead, exportLeadsCSV } from '@/lib/api';
import type { Lead } from '@/lib/types';
import styles from './leads.module.css';

type SortKey = 'name' | 'serviceType' | 'createdAt';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 20;

const serviceBadgeClass = (type: string) => {
  switch (type) {
    case 'training': return 'badge-training';
    case 'automation': return 'badge-automation';
    case 'both': return 'badge-both';
    default: return '';
  }
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  useEffect(() => {
    getLeads().then(data => setLeads(data));
  }, []);

  const filtered = useMemo(() => {
    let result = [...leads];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.whatsapp.includes(q)
      );
    }

    if (filterService !== 'all') {
      result = result.filter(l => l.serviceType === filterService);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'serviceType') cmp = a.serviceType.localeCompare(b.serviceType);
      else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [leads, search, filterService, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleDelete = async (lead: Lead) => {
    const success = await deleteLead(lead.id);
    if (success) {
      const data = await getLeads();
      setLeads(data);
    }
    setDeletingLead(null);
  };

  const handleExport = async () => {
    try {
      const csv = await exportLeadsCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return '↕';
    return sortDir === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.leads}>
      <div className={styles.header}>
        <h1 className={styles.title}>Leads</h1>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary btn-sm" onClick={handleExport} type="button">
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by name, email, or WhatsApp..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className={styles.filterSelect}
          value={filterService}
          onChange={e => { setFilterService(e.target.value); setPage(1); }}
        >
          <option value="all">All Services</option>
          <option value="training">Training</option>
          <option value="automation">Automation</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th onClick={() => handleSort('name')}>
                  Name <span className={styles.sortIcon}>{sortIcon('name')}</span>
                </th>
                <th>WhatsApp</th>
                <th>Email</th>
                <th onClick={() => handleSort('serviceType')}>
                  Service <span className={styles.sortIcon}>{sortIcon('serviceType')}</span>
                </th>
                <th>Project</th>
                <th onClick={() => handleSort('createdAt')}>
                  Date <span className={styles.sortIcon}>{sortIcon('createdAt')}</span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>📭</div>
                      <p>No leads found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((lead, i) => (
                  <tr key={lead.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td style={{ fontWeight: 500 }}>{lead.name}</td>
                    <td>
                      <a
                        href={`https://wa.me/${lead.whatsapp.replace(/^0/, '62')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent)' }}
                      >
                        {lead.whatsapp}
                      </a>
                    </td>
                    <td>
                      <a href={`mailto:${lead.email}`} style={{ color: 'var(--accent-2)' }}>
                        {lead.email}
                      </a>
                    </td>
                    <td>
                      <span className={`${styles.serviceBadge} ${serviceBadgeClass(lead.serviceType)}`}>
                        {lead.serviceType}
                      </span>
                    </td>
                    <td>
                      <div className={styles.projectPreview}>{lead.projectDetail}</div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(lead.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => setDetailLead(lead)}
                          type="button"
                        >
                          Detail
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                          onClick={() => setDeletingLead(lead)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <span className={styles.pageInfo}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className={styles.pageButtons}>
              <button
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                type="button"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`${styles.pageBtn} ${page === i + 1 ? styles.pageBtnActive : ''}`}
                  onClick={() => setPage(i + 1)}
                  type="button"
                >
                  {i + 1}
                </button>
              ))}
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                type="button"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailLead && (
        <div className="modal-overlay" onClick={() => setDetailLead(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Lead Details</h2>
              <button className={styles.modalClose} onClick={() => setDetailLead(null)} type="button">×</button>
            </div>
            <div className={styles.detailGrid}>
              <span className={styles.detailLabel}>Name</span>
              <span className={styles.detailValue}>{detailLead.name}</span>

              <span className={styles.detailLabel}>WhatsApp</span>
              <span className={styles.detailValue}>
                <a
                  href={`https://wa.me/${detailLead.whatsapp.replace(/^0/, '62')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)' }}
                >
                  {detailLead.whatsapp}
                </a>
              </span>

              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>
                <a href={`mailto:${detailLead.email}`} style={{ color: 'var(--accent-2)' }}>
                  {detailLead.email}
                </a>
              </span>

              <span className={styles.detailLabel}>Service</span>
              <span className={styles.detailValue}>
                <span className={`${styles.serviceBadge} ${serviceBadgeClass(detailLead.serviceType)}`}>
                  {detailLead.serviceType}
                </span>
              </span>

              <span className={styles.detailLabel}>Date</span>
              <span className={styles.detailValue} style={{ color: 'var(--text-muted)' }}>
                {new Date(detailLead.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
            <div className={styles.detailProject}>
              <strong style={{ display: 'block', marginBottom: 8 }}>Project Details:</strong>
              {detailLead.projectDetail}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingLead && (
        <div className="modal-overlay" onClick={() => setDeletingLead(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className={styles.deleteModalBody}>
              <div className={styles.deleteIcon}>⚠️</div>
              <h3 style={{ marginBottom: 8 }}>Delete Lead?</h3>
              <p className={styles.deleteText}>
                Are you sure you want to delete <strong>{deletingLead.name}</strong>&apos;s lead? This action cannot be undone.
              </p>
              <div className={styles.deleteActions}>
                <button className="btn btn-secondary btn-sm" onClick={() => setDeletingLead(null)} type="button">
                  Cancel
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(deletingLead)} type="button">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
