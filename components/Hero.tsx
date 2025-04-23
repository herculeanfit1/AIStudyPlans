'use client';

import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your AI Study <span className="text-yellow-300">Partner</span> for Academic Success
            </h1>
            <p className="text-xl mb-8 max-w-lg">
              SchedulEd creates personalized study plans tailored to your learning style, time availability, and knowledge level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="#waitlist" 
                className="px-6 py-3 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-300 shadow-md hover:shadow-lg transition-all text-center"
              >
                Join the Waitlist
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
              <Link 
                href="#how-it-works" 
                className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-all text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white text-gray-800 rounded-xl shadow-2xl p-6 max-w-md mx-auto transform rotate-2 transition-transform hover:rotate-0">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Data Science Study Plan</h2>
                <p className="text-sm text-gray-500">Personalized for your learning style</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">Week 1: Python Fundamentals</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">8 hours</span>
                  </div>
                  <ul className="space-y-1 pl-5 list-disc text-gray-600 text-sm">
                    <li>Introduction to Python syntax (2h)</li>
                    <li>Data types and structures (3h)</li>
                    <li>Control flow and functions (3h)</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">Week 2: Data Analysis</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">10 hours</span>
                  </div>
                  <ul className="space-y-1 pl-5 list-disc text-gray-600 text-sm">
                    <li>NumPy for numerical computing (3h)</li>
                    <li>Pandas for data manipulation (4h)</li>
                    <li>Data visualization with Matplotlib (3h)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Progress: 25% complete</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View full plan →
                  </button>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-blue-100 p-3 rounded-lg shadow-md">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-blue-600 rounded-full text-white">
                    <i className="fas fa-brain text-sm"></i>
                  </div>
                  <p className="text-xs font-medium text-gray-800">AI-Powered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 