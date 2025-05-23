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
        
        {/* Keep this at the very end of the main content, before the closing main tag */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-24 text-center opacity-30 hover:opacity-100 transition-opacity">
            <div className="text-xs text-gray-400">
              <a href="/admin-simple" className="text-gray-400 hover:text-gray-600 underline">
                Developer Admin Access
              </a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 