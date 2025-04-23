import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
        <i className={`${icon} text-indigo-600 text-xl`} aria-hidden="true"></i>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface FeaturesGridProps {
  className?: string;
}

const FeaturesGrid: React.FC<FeaturesGridProps> = ({ className = '' }) => {
  const features = [
    {
      title: "AI-Powered Planning",
      description: "Our algorithms create personalized study plans based on your learning style, goals, and available time.",
      icon: "fa-solid fa-brain"
    },
    {
      title: "Adaptive Learning",
      description: "Plans adjust automatically based on your progress and performance to optimize your study time.",
      icon: "fa-solid fa-arrows-spin"
    },
    {
      title: "Multiple Subject Support",
      description: "Master any subject with tailored plans for math, science, languages, programming, and more.",
      icon: "fa-solid fa-book-open"
    },
    {
      title: "Progress Tracking",
      description: "Visualize your learning journey with detailed analytics and milestone tracking.",
      icon: "fa-solid fa-chart-line"
    },
    {
      title: "Resource Integration",
      description: "Seamlessly incorporates online courses, textbooks, and practice exercises into your plan.",
      icon: "fa-solid fa-link"
    },
    {
      title: "Mobile Friendly",
      description: "Access your study plan anytime, anywhere with our responsive mobile interface.",
      icon: "fa-solid fa-mobile-screen"
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {features.map((feature, index) => (
        <FeatureCard 
          key={index}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
        />
      ))}
    </div>
  );
};

export default FeaturesGrid; 