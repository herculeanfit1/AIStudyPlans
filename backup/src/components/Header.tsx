'use client';

import { useEffect } from 'react';

export default function Header() {
  useEffect(() => {
    // Simple mobile menu toggle
    const mobileMenuButton = document.querySelector('button.md\\:hidden');
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener('click', function() {
        const nav = document.querySelector('nav');
        if (nav) {
          nav.classList.toggle('hidden');
          nav.classList.toggle('block');
          nav.classList.toggle('md:block');
          nav.classList.toggle('absolute');
          nav.classList.toggle('top-20');
          nav.classList.toggle('right-4');
          nav.classList.toggle('bg-white');
          nav.classList.toggle('p-4');
          nav.classList.toggle('rounded-md');
          nav.classList.toggle('shadow-lg');
          
          if (nav.classList.contains('absolute')) {
            const ul = nav.querySelector('ul');
            if (ul) {
              ul.classList.add('flex-col', 'space-y-4');
              ul.classList.remove('space-x-8');
            }
          } else {
            const ul = nav.querySelector('ul');
            if (ul) {
              ul.classList.remove('flex-col', 'space-y-4');
              ul.classList.add('space-x-8');
            }
          }
        }
      });
    }
  }, []);

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-3xl font-bold text-indigo-600">SchedulEd</span>
      </div>
      <nav className="hidden md:block">
        <ul className="flex space-x-8">
          <li><a href="#features" className="text-gray-700 hover:text-indigo-600 transition">Features</a></li>
          <li><a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 transition">How It Works</a></li>
          <li><a href="#waitlist" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Join Waitlist</a></li>
        </ul>
      </nav>
      <button className="md:hidden text-gray-600">
        <i className="fas fa-bars text-2xl" aria-hidden="true"></i>
      </button>
    </header>
  );
} 