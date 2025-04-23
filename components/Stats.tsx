'use client';

import React from 'react';

const Stats = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">94%</div>
            <p className="text-gray-600">Student Success Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">5,000+</div>
            <p className="text-gray-600">Active Students</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">35%</div>
            <p className="text-gray-600">Grade Improvement</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">2.5x</div>
            <p className="text-gray-600">Study Efficiency</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats; 