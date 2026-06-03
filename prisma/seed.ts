import 'dotenv/config';
import { db as prisma } from '../src/lib/db';
import { hashPassword } from '../src/lib/auth-utils';

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

async function main() {
  console.log('Starting seeding...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@automateriz.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  const existingAdmin = await prisma.adminUser.findFirst({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const passwordHash = hashPassword(adminPassword);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
      }
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // 2. Seed CMS Content
  const sections = ['hero', 'services', 'howItWorks', 'faq'];
  for (const section of sections) {
    const existingContent = await prisma.cMSContent.findFirst({
      where: { section }
    });

    if (!existingContent) {
      await prisma.cMSContent.create({
        data: {
          section,
          content: (defaultCMSContent as any)[section],
        }
      });
      console.log(`CMS content for section '${section}' created.`);
    } else {
      console.log(`CMS content for section '${section}' already exists.`);
    }
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
