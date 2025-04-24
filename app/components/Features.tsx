'use client';

import { useEffect, useState } from 'react';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

export default function Features() {
  const [animateFeatures, setAnimateFeatures] = useState<boolean[]>([]);
  
  const features: Feature[] = [
    {
      title: "Personalized Learning Paths",
      description: "Study plans tailored to your learning style, time availability, and current knowledge level.",
      icon: "fa-brain"
    },
    {
      title: "Smart Scheduling",
      description: "Optimize your study time with intelligently scheduled sessions that match your peak productivity hours.",
      icon: "fa-calendar-alt"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics to stay motivated and focused.",
      icon: "fa-chart-line"
    },
    {
      title: "Curated Resources",
      description: "Access high-quality educational materials specifically chosen to match your learning style.",
      icon: "fa-book-open"
    },
    {
      title: "Smart Reminders",
      description: "Never miss a study session with timely reminders and calendar integration.",
      icon: "fa-bell"
    },
    {
      title: "AI Adaptation",
      description: "Your study plan continuously improves as the AI learns from your progress and feedback.",
      icon: "fa-gears"
    }
  ];

  useEffect(() => {
    // Initialize all features as not animated
    setAnimateFeatures(new Array(features.length).fill(false));
    
    // Set up intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
          setAnimateFeatures((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }
      });
    }, { threshold: 0.1 });
    
    // Observe feature elements
    document.querySelectorAll('.feature-card').forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      observer.disconnect();
    };
  }, [features.length]);

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose SchedulEd?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform offers everything you need to maximize your study efficiency.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              data-index={index}
              className={`feature-card card card-hover transform transition-all duration-700 ${
                animateFeatures[index] 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="feature-icon">
                <i className={`fas ${feature.icon} text-2xl`} aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 