'use client';

import React from 'react';

export default function Stats() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">94%</div>
            <div className="text-gray-600">Student Success Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">5,000+</div>
            <div className="text-gray-600">Active Students</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">35%</div>
            <div className="text-gray-600">Grade Improvement</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">2.5x</div>
            <div className="text-gray-600">Study Efficiency</div>
          </div>
        </div>
      </div>
    </section>
  );
} 