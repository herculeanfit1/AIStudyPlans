'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm py-4 fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3">
            <i className="fas fa-brain"></i>
          </div>
          <span className="text-xl font-bold text-gray-900">SchedulEd</span>
        </div>
        
        <nav className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none space-y-4 md:space-y-0 md:space-x-8`}>
          <Link href="#features" className="text-gray-700 hover:text-indigo-600 transition">Features</Link>
          <Link href="#how-it-works" className="text-gray-700 hover:text-indigo-600 transition">How It Works</Link>
          <Link href="#pricing" className="text-gray-700 hover:text-indigo-600 transition">Pricing</Link>
          <Link href="#faq" className="text-gray-700 hover:text-indigo-600 transition">FAQ</Link>
        </nav>
        
        <div className="flex items-center">
          <Link 
            href="#waitlist" 
            className="hidden md:inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Join Waitlist
          </Link>
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 