// ============================================================
// Types — AutomateRiz CMS
// ============================================================

export type ServiceType = 'training' | 'automation' | 'both';

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  serviceType: ServiceType;
  projectDetail: string;
  createdAt: string;
}

export interface LeadFormData {
  name: string;
  whatsapp: string;
  email: string;
  serviceType: ServiceType;
  projectDetail: string;
  honeypot?: string;
}

export interface CMSHeroContent {
  badge: string;
  heading: string;
  subheading: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustSignals: { icon: string; text: string }[];
}

export interface CMSServiceCard {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  ctaLabel: string;
}

export interface CMSServicesContent {
  heading: string;
  cards: CMSServiceCard[];
}

export interface CMSStep {
  icon: string;
  title: string;
  description: string;
}

export interface CMSHowItWorksContent {
  heading: string;
  steps: CMSStep[];
}

export interface CMSFAQItem {
  question: string;
  answer: string;
}

export interface CMSFAQContent {
  heading: string;
  items: CMSFAQItem[];
}

export interface CMSContent {
  hero: CMSHeroContent;
  services: CMSServicesContent;
  howItWorks: CMSHowItWorksContent;
  faq: CMSFAQContent;
}

export interface StatsData {
  totalLeads: number;
  leadsThisMonth: number;
  leadsThisWeek: number;
  trainingCount: number;
  automationCount: number;
  bothCount: number;
  dailyLeads: { date: string; count: number }[];
}

export interface AdminUser {
  email: string;
  token: string;
}

export type Theme = 'dark' | 'light';
