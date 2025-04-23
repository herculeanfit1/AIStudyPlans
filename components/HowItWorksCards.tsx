'use client';

import React from 'react';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description, icon }) => {
  return (
    <div className="relative group">
      {/* Connection line between cards (hidden on mobile) */}
      {number < 4 && (
        <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
      )}
      
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 
                     transform transition-all duration-300 
                     group-hover:shadow-2xl group-hover:-translate-y-2 
                     h-full flex flex-col relative z-10">
        {/* Numbered badge */}
        <div className="absolute -top-5 -right-3 w-12 h-12 rounded-full bg-blue-600 text-white
                      flex items-center justify-center font-bold text-xl border-4 border-white shadow-lg">
          {number}
        </div>
        
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
          <i className={`${icon} text-2xl`}></i>
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        
        {/* Animated arrow */}
        <div className="text-blue-600 group-hover:translate-x-2 transition-transform duration-300">
          <i className="fas fa-arrow-right"></i>
        </div>
      </div>
    </div>
  );
};

interface HowItWorksCardsProps {
  className?: string;
}

const HowItWorksCards: React.FC<HowItWorksCardsProps> = ({ className = '' }) => {
  const steps: StepCardProps[] = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Tell us about your learning style, schedule, and current knowledge level so we can personalize your experience.",
      icon: "fa-solid fa-user-pen"
    },
    {
      number: 2,
      title: "Select Your Subjects",
      description: "Choose what you want to learn and set specific goals for each subject. Add deadlines if you have them.",
      icon: "fa-solid fa-book-open"
    },
    {
      number: 3,
      title: "Get Your Personalized Plan",
      description: "Our AI generates a study plan optimized for your learning style, schedule, and goals.",
      icon: "fa-solid fa-brain"
    },
    {
      number: 4,
      title: "Track & Improve",
      description: "Follow your plan and track progress. Our AI adapts to your performance, continuously optimizing your study strategy.",
      icon: "fa-solid fa-chart-line"
    }
  ];

  return (
    <div className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From signup to success in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 relative">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </div>
        
        {/* Bottom image/decoration */}
        <div className="mt-20 max-w-4xl mx-auto relative">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to transform your study habits?</h3>
                <p className="text-gray-600 mb-4">
                  Join our waitlist and be the first to experience the future of personalized learning.
                </p>
                <a href="#waitlist" className="inline-flex items-center justify-center py-3 px-6 rounded-lg bg-blue-600 text-white font-medium transition-colors hover:bg-blue-700">
                  Join the Waitlist
                </a>
              </div>
              
              <div className="md:w-1/2 flex justify-center">
                <div className="w-64 h-64 bg-white rounded-full shadow-lg flex items-center justify-center animate-float">
                  <div className="w-48 h-48 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-5xl font-bold">AI</div>
                      <div className="mt-1 text-blue-100">Powered Learning</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-200 rounded-lg transform rotate-12 opacity-70"></div>
          <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-blue-200 rounded-full transform opacity-70"></div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksCards; 