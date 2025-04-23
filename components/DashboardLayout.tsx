'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <Image 
                src="/SchedulEd_new_logo.png"
                alt="SchedulEd Logo"
                width={120}
                height={32}
                className="h-auto"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-indigo-600">
                <i className="fas fa-bell text-xl" aria-hidden="true"></i>
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-indigo-600" aria-hidden="true"></i>
              </div>
              <span className="text-gray-700 font-medium">Student</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} SchedulEd. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
                <i className="fab fa-twitter" aria-hidden="true"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
                <i className="fab fa-instagram" aria-hidden="true"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
                <i className="fab fa-linkedin" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 