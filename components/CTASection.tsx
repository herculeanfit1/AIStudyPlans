import React from 'react';
import Link from 'next/link';

interface CTASectionProps {
  className?: string;
  primaryText?: string;
  secondaryText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonLink?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  className = '',
  primaryText = 'Ready to transform your study experience?',
  secondaryText = 'Join thousands of students already improving their grades with AI-powered study plans.',
  primaryButtonText = 'Join the Waitlist',
  secondaryButtonText = 'Learn More',
  primaryButtonLink = '#waitlist',
  secondaryButtonLink = '#features'
}) => {
  return (
    <div className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl overflow-hidden shadow-2xl">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10 py-12 px-8 md:py-16 md:px-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 
                         animate-fade-in-up">
              {primaryText}
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              {secondaryText}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
              <Link 
                href={primaryButtonLink}
                className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-50 
                          transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 
                          flex items-center justify-center min-w-[200px]"
              >
                {primaryButtonText}
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
              <Link 
                href={secondaryButtonLink}
                className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold 
                          rounded-xl hover:bg-white/10 transition-all duration-300 
                          flex items-center justify-center min-w-[200px]"
              >
                {secondaryButtonText}
              </Link>
            </div>
            
            {/* Floating badges */}
            <div className="absolute top-12 -right-6 md:right-12 animate-float-slow">
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg transform rotate-3">
                <div className="flex items-center space-x-2">
                  <div className="text-yellow-500">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="font-medium text-gray-800">4.9/5 rating</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-6 md:left-12 animate-float">
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg transform -rotate-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <i className="fas fa-check"></i>
                  </div>
                  <p className="font-medium text-gray-800">5,000+ students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection; 