import React from 'react';

/**
 * Social proof section showing target audience
 * Displays the different education levels that SchedulEd supports
 */
export default function SocialProofSection() {
  const educationLevels = [
    "Middle School",
    "High School", 
    "College",
    "Graduate School",
    "Professional Learning"
  ];

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-500 mb-8">
          Designed for students at all levels
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {educationLevels.map((level) => (
            <span key={level} className="text-gray-400 text-xl font-medium">
              {level}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
} 