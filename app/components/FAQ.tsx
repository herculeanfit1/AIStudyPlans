'use client';

import { useState } from 'react';

export default function FAQ() {
  const faqs = [
    {
      question: "How does SchedulEd create personalized study plans?",
      answer: "SchedulEd uses advanced AI algorithms to analyze your learning style, available study time, current knowledge level, and goals. It then creates a customized study plan that optimizes your learning efficiency and adapts as you progress."
    },
    {
      question: "Is SchedulEd suitable for all subjects?",
      answer: "Yes! SchedulEd works with a wide range of subjects from mathematics and sciences to humanities, languages, and professional certifications. Our platform is designed to be flexible and adaptable to different learning goals."
    },
    {
      question: "How much does SchedulEd cost?",
      answer: "We offer a free basic tier with limited features. Our premium plans start at $6/month (billed annually) with additional tiers for advanced features. Check our pricing section for detailed information on what each plan includes."
    },
    {
      question: "Can I use SchedulEd for group study or as a teacher?",
      answer: "Absolutely! Our Enterprise/Education plan is designed specifically for educators, schools and study groups. It includes features like centralized administration, custom integrations, and bulk user management to make it easy to implement SchedulEd across your institution."
    },
    {
      question: "How does SchedulEd protect my privacy?",
      answer: "We take data privacy very seriously. All personal information is encrypted, and we never sell your data to third parties. For students under 18, we have additional safeguards in place, including parental consent requirements and limited data collection."
    },
    {
      question: "Can I switch between different subscription plans?",
      answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time. When upgrading, you'll get immediate access to the new features. If you downgrade, you'll retain your premium features until the end of your current billing period."
    },
    {
      question: "Does SchedulEd work on all devices?",
      answer: "SchedulEd is fully responsive and works on desktops, laptops, tablets, and mobile phones. We also have dedicated mobile apps for iOS and Android to help you study on the go."
    }
  ];
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about SchedulEd
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="mb-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
            >
              <button
                className="flex justify-between items-center w-full text-left font-medium text-gray-900 py-3 focus:outline-none transition-colors hover:text-indigo-600"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-lg">{faq.question}</span>
                <span className={`text-indigo-600 transition-transform duration-200 ${openIndex === index ? 'transform rotate-180' : ''}`}>
                  <i className={`fas ${openIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </span>
              </button>
              <div 
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={openIndex !== index}
              >
                <p className="py-3 text-gray-600">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Still have questions? <a href="/contact/support" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">Contact our support team</a>
          </p>
        </div>
      </div>
    </section>
  );
} 