'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
      // Find the email input in the waitlist section and set its value
      const waitlistEmailInput = waitlistSection.querySelector('input[type="email"]') as HTMLInputElement;
      if (waitlistEmailInput) {
        waitlistEmailInput.value = email;
        waitlistEmailInput.focus();
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-100 py-20 md:py-28">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/3 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
              Your AI Study <span className="text-indigo-600 relative">Partner</span> for Academic Success
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Generate personalized study plans tailored to your learning style, time availability, and knowledge level.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="#features" 
                className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-800 px-6 py-3 rounded-md font-medium transition-colors duration-300 text-center"
              >
                Learn More
              </a>
            </div>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white p-6 rounded-2xl shadow-xl relative hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute -top-4 -right-4 bg-indigo-600 text-white text-sm font-bold py-2 px-4 rounded-lg shadow-md">
                AI Generated
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-1">Data Science Study Plan</h3>
              <p className="text-sm text-gray-500 mb-6">Personalized for visual learners with 12 hours/week</p>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">Week 1: Python Fundamentals</h4>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">8 hours</span>
                  </div>
                  <ul className="space-y-2 pl-5 list-disc text-gray-600 text-sm">
                    <li>Introduction to Python syntax (2h)</li>
                    <li>Data types and structures (3h)</li>
                    <li>Control flow and functions (3h)</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">Week 2: Data Analysis</h4>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">10 hours</span>
                  </div>
                  <ul className="space-y-2 pl-5 list-disc text-gray-600 text-sm">
                    <li>NumPy for numerical computing (3h)</li>
                    <li>Pandas for data manipulation (4h)</li>
                    <li>Data visualization with Matplotlib (3h)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-500">Progress: 25% complete</span>
                </div>
                <Link 
                  href="https://app.aistudyplans.com" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View full plan →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 