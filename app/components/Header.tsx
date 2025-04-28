'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from 'next-themes';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [devMenuOpen, setDevMenuOpen] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDev, setIsDev] = useState(false);

  // Wait for component to be mounted to access theme
  useEffect(() => {
    setMounted(true);
    // Check if we're in development mode
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  // Determine which logo to use based on theme
  const logoSrc = !mounted ? '/SchedulEd_new_logo.png' : 
                 (theme === 'dark' || resolvedTheme === 'dark') ? 
                 '/SchedulEd_logo_dark.png' : '/SchedulEd_new_logo.png';

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* Logo */}
          <div className="flex justify-center md:justify-start mb-4 md:mb-0 md:mr-8">
            <Link href="/" className="flex items-center">
              <div className="relative h-[125px] w-[462.5px] sm:h-[150px] sm:w-[550px] md:h-[175px] md:w-[650px]">
                <Image 
                  src={logoSrc}
                  alt="SchedulEd Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-end flex-grow space-x-6 lg:space-x-8">
            <Link 
              href="#how-it-works" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
            >
              How It Works
            </Link>
            <Link 
              href="#features" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="#pricing" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Pricing
            </Link>
            
            {/* Developer Menu (only in development) */}
            {isDev && (
              <div className="relative">
                <button
                  className="flex items-center px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
                  onClick={() => setDevMenuOpen(!devMenuOpen)}
                >
                  <span className="mr-1">🛠️</span> Dev Tools
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform ${devMenuOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                
                {/* Developer Dropdown Menu */}
                {devMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
                    <div className="py-1">
                      <Link
                        href="/email-setup"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDevMenuOpen(false)}
                      >
                        <span className="mr-2">📧</span> Email Setup Guide
                      </Link>
                      <a
                        href="https://resend.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span className="mr-2">🔗</span> Resend Dashboard
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('delivered@resend.dev');
                          setDevMenuOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span className="mr-2">📋</span> Copy Test Email
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex justify-center items-center gap-2">
            {/* Developer button for mobile (only in development) */}
            {isDev && (
              <button
                type="button"
                className="flex items-center px-2 py-1 text-sm bg-amber-100 text-amber-800 rounded-md mr-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDevMenuOpen(!devMenuOpen);
                }}
              >
                <span>🛠️</span>
              </button>
            )}
            <ThemeToggle />
            <button
              type="button"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => {
                setDevMenuOpen(false);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t mt-4 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="#how-it-works" 
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="#features" 
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#pricing" 
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </nav>
          </div>
        )}
        
        {/* Mobile Developer Menu (only in development) */}
        {isDev && devMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t mt-4 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/email-setup" 
                className="text-amber-800 dark:text-amber-300 flex items-center"
                onClick={() => setDevMenuOpen(false)}
              >
                <span className="mr-2">📧</span> Email Setup Guide
              </Link>
              <a 
                href="https://resend.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-800 dark:text-amber-300 flex items-center"
              >
                <span className="mr-2">🔗</span> Resend Dashboard
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('delivered@resend.dev');
                  setDevMenuOpen(false);
                }}
                className="text-left text-amber-800 dark:text-amber-300 flex items-center"
              >
                <span className="mr-2">📋</span> Copy Test Email
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 