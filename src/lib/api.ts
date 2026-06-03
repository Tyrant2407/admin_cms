// ============================================================
// Real API Client — AutomateRiz
// ============================================================

import type { Lead, CMSContent, StatsData, LeadFormData, AdminUser } from './types';

// ---- Auth ----

export async function login(email: string, password: string): Promise<AdminUser | null> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    
    // Save to localStorage for UI display compatibility in sidebar
    if (typeof window !== 'undefined' && data.user) {
      localStorage.setItem('automateriz_auth', JSON.stringify({ email: data.user.email, token: data.token }));
    }
    
    return { email: data.user.email, token: data.token };
  } catch (error) {
    console.error('Login error in API client:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error in API client:', error);
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('automateriz_auth');
    }
  }
}

export async function getAuthUser(): Promise<AdminUser | null> {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('automateriz_auth');
      }
      return null;
    }
    const data = await res.json();
    return { email: data.user.email, token: '' };
  } catch {
    // If offline or network error, check localStorage for fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('automateriz_auth');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthUser();
  return user !== null;
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return res.ok;
  } catch (error) {
    console.error('Change password error in API client:', error);
    return false;
  }
}

// ---- Leads ----

export async function getLeads(filters: { search?: string; serviceType?: string; sortBy?: string; sortOrder?: string; page?: number; limit?: number } = {}): Promise<Lead[]> {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.serviceType) params.append('serviceType', filters.serviceType);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const res = await fetch(`/api/leads?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.leads;
  } catch (error) {
    console.error('Get leads error in API client:', error);
    return [];
  }
}

export async function getLeadsPaginated(filters: { search?: string; serviceType?: string; sortBy?: string; sortOrder?: string; page?: number; limit?: number } = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.serviceType) params.append('serviceType', filters.serviceType);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const res = await fetch(`/api/leads?${params.toString()}`);
    if (!res.ok) {
      return { leads: [], pagination: { page: 1, limit: 20, totalCount: 0, totalPages: 0 } };
    }
    return res.json();
  } catch (error) {
    console.error('Get leads paginated error in API client:', error);
    return { leads: [], pagination: { page: 1, limit: 20, totalCount: 0, totalPages: 0 } };
  }
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
  try {
    const leads = await getLeads();
    return leads.find(l => l.id === id);
  } catch (error) {
    console.error('Get lead by id error in API client:', error);
    return undefined;
  }
}

export async function deleteLead(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (error) {
    console.error('Delete lead error in API client:', error);
    return false;
  }
}

export async function submitLead(data: LeadFormData): Promise<Lead> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit lead');
  }

  return res.json();
}

export async function exportLeadsCSV(): Promise<string> {
  const res = await fetch('/api/leads/export');
  if (!res.ok) throw new Error('Failed to export leads');
  return res.text();
}

// ---- CMS ----

export async function getCMSContent(): Promise<CMSContent> {
  try {
    const res = await fetch('/api/cms/content');
    if (!res.ok) throw new Error('Fetch CMS content failed');
    return res.json();
  } catch (error) {
    console.error('Get CMS Content error in API client:', error);
    return getDefaultCMSContent();
  }
}

export async function updateCMSContent(content: CMSContent): Promise<boolean> {
  try {
    const res = await fetch('/api/cms/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    return res.ok;
  } catch (error) {
    console.error('Update CMS Content error in API client:', error);
    return false;
  }
}

// Fallback Default Content
const defaultCMSContent: CMSContent = {
  hero: {
    badge: '⚡ AI Automation Expert',
    heading: 'Automate Your Business.\nFaster. Smarter.',
    subheading: 'We build intelligent automation systems that save time, reduce errors, and scale your operations effortlessly.',
    ctaPrimary: 'Free Consultation',
    ctaSecondary: 'View Services',
    trustSignals: [
      { icon: '👥', text: '15+ Clients' },
      { icon: '⚙️', text: '30+ Automations Built' },
      { icon: '⏱️', text: '5000+ Hours Saved' },
    ],
  },
  services: {
    heading: 'What We Offer',
    cards: [
      {
        icon: '🧠',
        title: 'Workshop & Training',
        description: 'Hands-on intensive training for teams who want to master AI automation tools. Learn to build workflows with n8n, Make, and custom API integrations from scratch.',
        tags: ['Online', 'Intensive', 'Certificate'],
        ctaLabel: 'See Details →',
      },
      {
        icon: '⚙️',
        title: 'Custom Automation System',
        description: 'End-to-end automation solutions tailored to your business. From lead management to invoice processing, we design and deploy systems that work 24/7.',
        tags: ['n8n', 'Make', 'API Integration'],
        ctaLabel: 'Consult Project →',
      },
    ],
  },
  howItWorks: {
    heading: 'How It Works',
    steps: [
      { icon: '📋', title: 'Fill the Form', description: 'Tell us about your needs and goals' },
      { icon: '💬', title: 'Consultation', description: 'We discuss via WhatsApp or a quick meeting' },
      { icon: '🔧', title: 'Execution', description: 'Training delivery or system development' },
      { icon: '🚀', title: 'Go Live', description: 'Your system runs, you see the results' },
    ],
  },
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      { question: 'What tools do you use for automation?', answer: 'We primarily use n8n, Make (Integromat), custom Python scripts, and direct API integrations. The choice depends on your specific needs and existing infrastructure.' },
      { question: 'How long does a typical automation project take?', answer: 'Simple automations can be delivered in 3-5 business days. Complex systems with multiple integrations typically take 2-4 weeks.' },
      { question: 'Do you offer ongoing support?', answer: 'Yes! We provide 30 days of free support after delivery. Extended maintenance plans are available for long-term partnerships.' },
      { question: 'What is the training format?', answer: 'Our training is conducted online via live sessions over 3-5 days, with hands-on projects and a completion certificate.' },
      { question: 'How much does it cost?', answer: 'Pricing varies based on complexity. Training starts from IDR 2.5M per person. Custom automation projects start from IDR 5M. Contact us for a detailed quote.' },
      { question: 'Can you integrate with our existing systems?', answer: 'Absolutely. We specialize in connecting different platforms — CRM, ERP, spreadsheets, messaging apps, payment gateways, and more.' },
    ],
  },
};

export function getDefaultCMSContent(): CMSContent {
  return { ...defaultCMSContent };
}

// ---- Stats ----

export async function getStats(): Promise<StatsData> {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) {
      throw new Error('Failed to fetch stats');
    }
    return res.json();
  } catch (error) {
    console.error('Get Stats error in API client:', error);
    throw error;
  }
}

// ---- Theme ----

export function getStoredTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  try {
    const theme = localStorage.getItem('automateriz_theme');
    return (theme === 'light' || theme === 'dark') ? theme : 'dark';
  } catch {
    return 'dark';
  }
}

export function setStoredTheme(theme: 'dark' | 'light'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('automateriz_theme', theme);
  } catch (e) {
    console.error('Error saving theme', e);
  }
}
