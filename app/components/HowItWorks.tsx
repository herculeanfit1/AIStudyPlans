'use client';

import { useEffect, useState, useRef } from 'react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  
  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Tell us about your learning style, time availability, and current knowledge level to help us understand your unique needs.",
      icon: "fa-user-plus"
    },
    {
      number: 2,
      title: "Select Your Subjects",
      description: "Choose the subjects you want to learn and set specific learning goals to focus your study plans on what matters most to you.",
      icon: "fa-book-open"
    },
    {
      number: 3,
      title: "Generate Your Plan",
      description: "Our AI engine creates a personalized study plan optimized for your success, with the right balance of materials and activities.",
      icon: "fa-wand-magic-sparkles"
    },
    {
      number: 4,
      title: "Track & Adapt",
      description: "Follow your plan, track your progress, and watch as our AI adapts your study schedule based on your performance and feedback.",
      icon: "fa-chart-line"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Start animation when section comes into view
          const interval = setInterval(() => {
            setActiveStep((prev) => {
              const next = (prev + 1) % steps.length;
              return next;
            });
          }, 3000);
          
          return () => clearInterval(interval);
        }
      },
      { threshold: 0.2 }
    );
    
    const currentRef = stepsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [steps.length]);

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How SchedulEd Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started is easy with our simple four-step process
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto" ref={stepsRef}>
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-1 bg-indigo-100 z-0">
            <div 
              className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-500 ease-in-out"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className={`relative z-10 transform transition-all duration-500 ${
                  index === activeStep ? 'scale-105' : 'scale-100'
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className={`flex flex-col items-center cursor-pointer ${
                  index <= activeStep ? 'opacity-100' : 'opacity-60'
                }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl mb-6 transition-all duration-300 ${
                    index <= activeStep ? 'bg-indigo-600' : 'bg-indigo-300'
                  }`}>
                    <i className={`fas ${step.icon}`}></i>
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 text-center transition-colors duration-300 ${
                    index <= activeStep ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeStep ? 'bg-indigo-600 w-6' : 'bg-indigo-200'
                  }`}
                  onClick={() => setActiveStep(index)}
                  aria-label={`Go to step ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a
            href="#waitlist"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  );
} 