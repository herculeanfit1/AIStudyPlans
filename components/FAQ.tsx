"use client";

import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center text-left"
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <span className="ml-6 flex-shrink-0">
          <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'} text-blue-600`}></i>
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-3 pr-12">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

interface FAQProps {
  className?: string;
}

const FAQ: React.FC<FAQProps> = ({ className = '' }) => {
  const faqItems: FAQItemProps[] = [
    {
      question: "How does the AI-powered study plan generator work?",
      answer: "Our platform uses advanced AI algorithms to analyze your learning goals, schedule, and preferences. It then creates a personalized study plan optimized for your needs, suggesting the most effective study times, topics to focus on, and learning methods tailored to your unique learning style."
    },
    {
      question: "Can I customize my study plan after it's generated?",
      answer: "Absolutely! While our AI creates an optimized initial plan, you have full control to adjust it. You can modify study sessions, change topics, adjust time allocations, or completely restructure your plan. The system will even provide suggestions to maintain effectiveness as you make changes."
    },
    {
      question: "Is this platform suitable for all subjects and education levels?",
      answer: "Yes, our platform supports learners across all education levels from high school to postgraduate studies. It works for virtually any subject, including STEM fields, humanities, languages, test preparation, and professional certifications. The AI adapts its approach based on the specific requirements of your subject and level."
    },
    {
      question: "How do you track my progress and adapt the plan?",
      answer: "As you complete study sessions and exercises, you provide simple feedback on your comprehension and confidence. Our AI analyzes this data along with your completion patterns to automatically adjust your plan, reinforcing challenging areas and optimizing your study schedule for better retention and understanding."
    },
    {
      question: "What if I fall behind on my study schedule?",
      answer: "Life happens! If you miss sessions or fall behind, our system automatically recalibrates your plan. It redistributes topics intelligently, prioritizes critical concepts, and adjusts the schedule to help you catch up without becoming overwhelmed. You can also manually trigger a plan adjustment anytime."
    },
    {
      question: "Can I use this platform with my existing study materials?",
      answer: "Definitely. You can upload or link to your existing textbooks, notes, online courses, and other study resources. Our system will incorporate these materials into your plan and even suggest when and how to use each resource most effectively in your learning journey."
    }
  ];

  return (
    <div className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our AI study planning platform.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <FAQItem 
              key={index} 
              question={item.question} 
              answer={item.answer} 
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a href="#" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 