'use client';

import React from 'react';

const Features = () => {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SchedulEd?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform offers everything you need to maximize your study efficiency.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-brain text-2xl text-indigo-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Learning</h3>
            <p className="text-gray-600">
              Study plans tailored to your unique learning style, schedule, and knowledge level.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-calendar-alt text-2xl text-indigo-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Scheduling</h3>
            <p className="text-gray-600">
              Optimize your study time with intelligently scheduled sessions based on your peak productivity hours.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-chart-line text-2xl text-indigo-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed analytics and achieve consistent improvement.
            </p>
          </div>
        </div>
        
        <div className="mt-16" id="how-it-works">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with SchedulEd in four simple steps
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="relative bg-white p-6 rounded-xl shadow-md z-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">1</div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Create Your Profile</h3>
                <p className="text-gray-600 text-center">
                  Tell us about your learning style and schedule.
                </p>
              </div>
              
              <div className="relative bg-white p-6 rounded-xl shadow-md z-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">2</div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Select Subjects</h3>
                <p className="text-gray-600 text-center">
                  Choose what you want to learn and set your goals.
                </p>
              </div>
              
              <div className="relative bg-white p-6 rounded-xl shadow-md z-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">3</div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Get Your Plan</h3>
                <p className="text-gray-600 text-center">
                  Our AI generates your personalized study plan.
                </p>
              </div>
              
              <div className="relative bg-white p-6 rounded-xl shadow-md z-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">4</div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Track & Improve</h3>
                <p className="text-gray-600 text-center">
                  Follow your plan and watch your progress grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; 