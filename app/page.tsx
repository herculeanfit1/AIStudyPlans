'use client';

import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import WaitlistForm from './components/WaitlistForm';
import Footer from './components/Footer';

export default function Home() {
  useEffect(() => {
    // Add smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.hash && link.hash.startsWith('#') && link.href.includes(window.location.pathname)) {
        e.preventDefault();
        const targetElement = document.querySelector(link.hash);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
          
          // Update URL without causing a page reload
          history.pushState(null, '', link.hash);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      
      {/* Stats Section */}
      <section className="py-12 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-indigo-600">2,000+</p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600">15,000+</p>
              <p className="text-gray-600">Study Plans Created</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600">93%</p>
              <p className="text-gray-600">Improved Grades</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600">4.8/5</p>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>
      
      <Features />
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How AIStudyPlans Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple 4-step process to revolutionize your study routine
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Create Your Profile",
                description: "Tell us about your learning style, schedule, and current knowledge level.",
                icon: "fa-user-pen"
              },
              {
                step: 2,
                title: "Select Your Subjects",
                description: "Choose what you want to learn and set specific goals for each subject.",
                icon: "fa-book-open"
              },
              {
                step: 3,
                title: "Get Your Plan",
                description: "Our AI generates a personalized study plan optimized for your success.",
                icon: "fa-brain"
              },
              {
                step: 4,
                title: "Track & Improve",
                description: "Follow your plan and watch as our AI adapts to your progress.",
                icon: "fa-chart-line"
              }
            ].map((item) => (
              <div key={item.step} className="text-center card">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Pricing />
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join thousands of students already using AIStudyPlans to achieve their academic goals.
          </p>
          <a 
            href="#waitlist" 
            className="bg-white text-indigo-600 px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Today
          </a>
        </div>
      </section>
      
      <WaitlistForm />
      
      <Footer />
    </main>
  );
} 