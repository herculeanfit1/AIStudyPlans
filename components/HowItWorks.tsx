'use client';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Tell us about your learning style, time availability, and current knowledge level."
    },
    {
      number: 2,
      title: "Select Your Subjects",
      description: "Choose what you want to learn and set your learning goals."
    },
    {
      number: 3,
      title: "Receive Your Plan",
      description: "Our AI generates a personalized study plan optimized for your success."
    },
    {
      number: 4,
      title: "Track & Adjust",
      description: "Follow your plan, track progress, and watch our AI adapt as you learn."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How SchedulEd Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started is easy with our simple four-step process
          </p>
        </div>
        
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-0 w-full h-0.5 bg-indigo-200 z-0"></div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative z-10">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 