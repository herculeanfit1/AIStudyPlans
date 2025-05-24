import React from 'react';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

/**
 * Individual feature card component
 */
function FeatureCard({ icon, title, description }: Feature) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
        <i className={`${icon} text-2xl text-indigo-600`} aria-hidden="true"></i>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

/**
 * Features section component showing key benefits
 * Displays the main features of SchedulEd in a grid layout
 */
export default function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: "fas fa-brain",
      title: "Personalized Learning Paths",
      description: "Study plans tailored to your learning style (visual, auditory, kinesthetic), time availability, and knowledge level."
    },
    {
      icon: "fas fa-calendar-alt", 
      title: "Smart Scheduling",
      description: "Optimize your study time with intelligently scheduled sessions that match your availability and peak productivity hours."
    },
    {
      icon: "fas fa-book-open",
      title: "Curated Resources", 
      description: "Access high-quality educational materials specifically chosen to match your learning style and subject matter."
    },
    {
      icon: "fas fa-chart-line",
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed progress reports and analytics to keep you motivated."
    },
    {
      icon: "fas fa-bell",
      title: "Smart Reminders",
      description: "Never miss a study session with timely reminders and calendar integration for upcoming study sessions."
    },
    {
      icon: "fas fa-users",
      title: "Privacy Focused",
      description: "Your study data stays private and secure. We believe learning should be personal and protected."
    }
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
        Why Choose SchedulEd?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
} 