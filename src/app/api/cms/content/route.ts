import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'automateriz-secret-key-2024';

// Helper to check authentication
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('automateriz_token')?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// Fallback default content if DB is not populated
const defaultCMSContent = {
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

// GET - Retrieve CMS content (Public)
export async function GET() {
  try {
    const cmsRows = await db.cMSContent.findMany();

    // Map rows to a CMSContent structure
    const contentMap: Record<string, any> = {};
    cmsRows.forEach(row => {
      contentMap[row.section] = row.content;
    });

    // Merge with defaultCMSContent in case some sections are missing from DB
    const finalContent = {
      hero: contentMap.hero || defaultCMSContent.hero,
      services: contentMap.services || defaultCMSContent.services,
      howItWorks: contentMap.howItWorks || defaultCMSContent.howItWorks,
      faq: contentMap.faq || defaultCMSContent.faq,
    };

    return NextResponse.json(finalContent);
  } catch (error) {
    console.error('Fetch CMS content error:', error);
    // If database connection fails or tables don't exist yet, return default data
    return NextResponse.json(defaultCMSContent);
  }
}

// PUT - Update CMS content (Protected)
export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newContent = await request.json();

    if (!newContent) {
      return NextResponse.json({ error: 'Content payload is required' }, { status: 400 });
    }

    const sections = ['hero', 'services', 'howItWorks', 'faq'];

    // Update each section in the database
    await Promise.all(
      sections.map(section => {
        if (newContent[section]) {
          return db.cMSContent.upsert({
            where: { section },
            update: { content: newContent[section] },
            create: {
              section,
              content: newContent[section],
            },
          });
        }
        return Promise.resolve();
      })
    );

    return NextResponse.json({ success: true, message: 'CMS Content updated successfully' });
  } catch (error) {
    console.error('Update CMS content error:', error);
    return NextResponse.json({ error: 'Failed to update CMS Content' }, { status: 500 });
  }
}
