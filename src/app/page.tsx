'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Footer from '@/components/landing/Footer';

const Services = dynamic(() => import('@/components/landing/Services'));
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'));
const FAQ = dynamic(() => import('@/components/landing/FAQ'));
const LeadForm = dynamic(() => import('@/components/landing/LeadForm'));

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <FAQ />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
