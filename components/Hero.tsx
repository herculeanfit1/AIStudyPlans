'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-indigo-50 to-blue-100 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Your AI Study <span className="text-indigo-600">Partner</span> for Academic Success
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-lg">
              SchedulEd creates personalized study plans tailored to your learning style, time availability, and knowledge level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="#waitlist" 
                className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 hover:shadow-lg transition-all text-center"
              >
                Join the Waitlist
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
              <Link 
                href="#how-it-works" 
                className="px-8 py-4 bg-white text-gray-700 border border-gray-300 font-medium rounded-md hover:bg-gray-50 transition-colors text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="relative animate-fadeInUp animation-delay-200">
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Data Science Study Plan</h2>
                <p className="text-gray-600 text-sm">Personalized for your learning style</p>
              </div>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">Week 1: Python Fundamentals</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">8 hours</span>
                  </div>
                  <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                    <li>Introduction to Python syntax (2h)</li>
                    <li>Data types and structures (3h)</li>
                    <li>Control flow and functions (3h)</li>
                  </ul>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">Week 2: Data Analysis</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">10 hours</span>
                  </div>
                  <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                    <li>NumPy for numerical computing (3h)</li>
                    <li>Pandas for data manipulation (4h)</li>
                    <li>Data visualization with Matplotlib (3h)</li>
                  </ul>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Progress: 25% complete</span>
                  </div>
                  <a href="#" className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                    View full plan →
                  </a>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-indigo-100 py-2 px-3 rounded-lg shadow-md flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white mr-2">
                  <i className="fas fa-brain text-sm"></i>
                </div>
                <span className="text-sm font-semibold text-gray-800">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 