'use client';

import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import WaitlistForm from './components/WaitlistForm';
import Footer from './components/Footer';
import { ThemeToggle } from './components/ThemeToggle';
import ParticlesBackground from './components/ParticlesBackground';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen theme-transition">
      <ParticlesBackground />
      <ThemeToggle />
      <Header />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <FAQ />
        <WaitlistForm />
      </main>
      <Footer />
    </div>
  );
} 