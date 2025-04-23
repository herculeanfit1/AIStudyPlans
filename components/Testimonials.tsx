'use client';

import React from 'react';
import Image from 'next/image';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, avatarUrl }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <i className="fa-solid fa-quote-left text-2xl text-blue-500 mr-2"></i>
      </div>
      <p className="text-gray-600 mb-6 italic">{quote}</p>
      <div className="flex items-center">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
          <Image 
            src={avatarUrl} 
            alt={author} 
            fill 
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{author}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

interface TestimonialsProps {
  className?: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ className = '' }) => {
  const testimonials: TestimonialProps[] = [
    {
      quote: "This AI study planner completely transformed how I prepare for exams. I've improved my grades significantly while actually studying less hours overall!",
      author: "Sarah J.",
      role: "Medical Student",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "As someone juggling work and online courses, this platform has been a game-changer. The AI adapts to my busy schedule and keeps me on track.",
      author: "Michael T.",
      role: "Working Professional",
      avatarUrl: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    {
      quote: "I was skeptical about AI-generated study plans at first, but the personalization is impressive. It's like having a private tutor who knows exactly what I need.",
      author: "Aisha K.",
      role: "Computer Science Major",
      avatarUrl: "https://randomuser.me/api/portraits/women/67.jpg"
    }
  ];

  return (
    <div className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students who have transformed their learning experience with our AI-powered study plans.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              avatarUrl={testimonial.avatarUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials; 