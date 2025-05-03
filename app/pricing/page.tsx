import React from 'react';
import Pricing from '../components/Pricing';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              <span className="block">Simple, Transparent Pricing</span>
            </h1>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
              Choose the plan that works best for your educational journey
            </p>
          </div>
          
          <Pricing />
        </div>
      </main>
      <Footer />
    </div>
  );
} 