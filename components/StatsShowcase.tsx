import React from 'react';

interface StatItemProps {
  value: string;
  label: string;
  icon: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, icon }) => {
  return (
    <div className="text-center p-6 bg-white rounded-2xl shadow-lg shine-effect transform transition-transform duration-300 hover:scale-105">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
        <i className={`${icon} text-2xl`}></i>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

interface StatsShowcaseProps {
  className?: string;
}

const StatsShowcase: React.FC<StatsShowcaseProps> = ({ className = '' }) => {
  const stats: StatItemProps[] = [
    {
      value: "94%",
      label: "Student Success Rate",
      icon: "fa-solid fa-graduation-cap"
    },
    {
      value: "5,000+",
      label: "Active Students",
      icon: "fa-solid fa-users"
    },
    {
      value: "35%",
      label: "Average Grade Improvement",
      icon: "fa-solid fa-chart-line"
    },
    {
      value: "2.5x",
      label: "Study Efficiency",
      icon: "fa-solid fa-bolt"
    }
  ];

  return (
    <div className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transforming Study Habits
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform is revolutionizing how students learn and achieve academic success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block animate-pulse-blue">
            <a href="#waitlist" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-4 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-lg">
              Join the Waitlist Today
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsShowcase; 