'use client';

import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import WaitlistForm from './components/WaitlistForm';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <div className="p-8">
          <h1 className="text-2xl font-bold">AIStudyPlans</h1>
          <p className="mt-4 mb-10">Your AI Study Partner for Academic Success</p>
        </div>
        <Features />
        <Pricing />
        <WaitlistForm />
      </div>
      <Footer />
    </div>
  );
} 