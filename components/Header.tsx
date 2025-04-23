'use client';

import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <i className="fas fa-brain text-white"></i>
            </span>
            <span className="text-xl font-bold text-gray-900">SchedulEd</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-indigo-600">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-indigo-600">
              How It Works
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-indigo-600">
              Pricing
            </Link>
            <Link href="#faq" className="text-gray-700 hover:text-indigo-600">
              FAQ
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="#waitlist" 
              className="hidden md:inline-flex px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Join Waitlist
            </Link>
            <button className="md:hidden text-gray-600 focus:outline-none">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 