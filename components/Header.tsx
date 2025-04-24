'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`py-4 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <i className="brain-icon fas fa-brain text-2xl"></i>
            <h1 className="text-2xl font-bold text-purple-700">SchedulEd</h1>
          </div>
          
          <nav className="md:flex md:items-center">
            <ul className="list-bullet md:flex md:space-x-8">
              <li className="mb-3 md:mb-0 md:pl-0 md:before:content-none">
                <Link href="#features" className="hover:text-indigo-700 transition-colors">Features</Link>
              </li>
              <li className="mb-3 md:mb-0 md:pl-0 md:before:content-none">
                <Link href="#how-it-works" className="hover:text-indigo-700 transition-colors">How It Works</Link>
              </li>
              <li className="mb-3 md:mb-0 md:pl-0 md:before:content-none">
                <Link href="#pricing" className="hover:text-indigo-700 transition-colors">Pricing</Link>
              </li>
              <li className="mb-3 md:mb-0 md:pl-0 md:before:content-none">
                <Link href="#faq" className="hover:text-indigo-700 transition-colors">FAQ</Link>
              </li>
              <li className="md:pl-0 md:before:content-none">
                <Link 
                  href="#waitlist" 
                  className="font-medium hover:text-indigo-700 transition-colors relative inline-block group"
                >
                  Join Waitlist
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 