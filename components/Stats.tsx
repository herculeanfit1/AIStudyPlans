'use client';

import React from 'react';

const Stats = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-2">10,000+</h3>
              <p className="text-lg text-white/80">Students Using Our Platform</p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-2">94%</h3>
              <p className="text-lg text-white/80">Report Grade Improvement</p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-2">25+</h3>
              <p className="text-lg text-white/80">Subjects Covered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats; 