'use client';

import { useEffect, useState, useRef } from 'react';
import { getStats, getLeads } from '@/lib/api';
import type { StatsData, Lead } from '@/lib/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from './dashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const serviceBadgeClass = (type: string) => {
  switch (type) {
    case 'training': return 'badge-training';
    case 'automation': return 'badge-automation';
    case 'both': return 'badge-both';
    default: return '';
  }
};

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, leadsData] = await Promise.all([
          getStats(),
          getLeads(),
        ]);
        setStats(statsData);
        setRecentLeads(leadsData.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchData();
  }, []);

  if (!stats) return null;

  const chartData = {
    labels: stats.dailyLeads.map(d => {
      const date = new Date(d.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: 'Leads',
        data: stats.dailyLeads.map(d => d.count),
        backgroundColor: 'rgba(79, 255, 176, 0.5)',
        borderColor: 'rgba(79, 255, 176, 0.8)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#16161F',
        titleColor: '#F0F0F5',
        bodyColor: '#F0F0F5',
        borderColor: '#1E1E2E',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#6B7280', font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#6B7280', stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📊</span>
          <span className={styles.statValue}>{stats.totalLeads}</span>
          <span className={styles.statLabel}>Total Leads</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📅</span>
          <span className={styles.statValue}>{stats.leadsThisMonth}</span>
          <span className={styles.statLabel}>This Month</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📈</span>
          <span className={styles.statValue}>{stats.leadsThisWeek}</span>
          <span className={styles.statLabel}>This Week</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🎯</span>
          <span className={styles.statValue}>
            {stats.trainingCount}
            <span style={{ fontSize: '0.6em', color: 'var(--text-muted)', fontWeight: 400 }}> / </span>
            {stats.automationCount}
          </span>
          <span className={styles.statLabel}>Training / Automation</span>
        </div>
      </div>

      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Leads — Last 30 Days</h3>
        <div className={styles.chartWrap}>
          <Bar ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className={styles.recentCard}>
        <h3 className={styles.recentTitle}>Recent Leads</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>WhatsApp</th>
                <th>Service</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map(lead => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
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
                    <span className={`${styles.serviceBadge} ${serviceBadgeClass(lead.serviceType)}`}>
                      {lead.serviceType}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(lead.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
