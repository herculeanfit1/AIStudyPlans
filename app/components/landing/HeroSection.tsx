import React from 'react';

/**
 * Hero section component for the landing page
 * Contains the main headline, description, and call-to-action buttons
 */
export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
            Your AI Study <span className="text-indigo-600">Partner</span>{" "}
            for Academic Success
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            SchedulEd creates personalized study plans tailored to your
            learning style, time availability, and knowledge level. Get
            ready to transform your learning experience.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#waitlist"
              className="px-8 py-4 bg-indigo-600 text-white text-lg font-medium rounded-md hover:bg-indigo-700 transition text-center"
            >
              Join the Waitlist
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 border border-gray-300 text-gray-700 text-lg font-medium rounded-md hover:bg-gray-50 transition text-center"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <div className="relative w-full h-[400px] flex items-center justify-center bg-slate-200 rounded-md">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  Your Personalized Study Plan
                </h3>
                <p className="text-slate-600 mb-4">
                  Tailored to your learning style
                </p>
                <div className="w-48 h-1 bg-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-500 text-sm">Coming soon...</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 bg-indigo-100 p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-full text-white">
                <i className="fas fa-brain" aria-hidden="true"></i>
              </div>
              <div>
                <p className="font-medium text-gray-800">AI-Powered</p>
                <p className="text-sm text-gray-600">Learns as you learn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 