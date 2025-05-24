import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

/**
 * Individual step component for the process
 */
function ProcessStep({ number, title, description, icon }: Step) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
          {number}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
          <i className={`${icon} text-indigo-600`} aria-hidden="true"></i>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

/**
 * How It Works section explaining the process
 * Shows step-by-step how users will interact with SchedulEd
 */
export default function HowItWorksSection() {
  const steps: Step[] = [
    {
      number: 1,
      title: "Tell Us About Yourself",
      description: "Share your learning style, available time, subjects you're studying, and your goals.",
      icon: "fas fa-user"
    },
    {
      number: 2, 
      title: "Get Your Personalized Plan",
      description: "Our AI creates a customized study plan optimized for your unique learning profile.",
      icon: "fas fa-magic"
    },
    {
      number: 3,
      title: "Study Smarter, Not Harder", 
      description: "Follow your plan, track progress, and let our AI adapt as you learn and grow.",
      icon: "fas fa-rocket"
    }
  ];

  return (
    <section id="how-it-works" className="bg-indigo-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
          How SchedulEd Works
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <ProcessStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 