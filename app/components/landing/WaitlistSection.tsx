import React from 'react';
import WaitlistForm from '../WaitlistForm';

/**
 * Waitlist section component
 * Contains the call-to-action and waitlist form
 */
export default function WaitlistSection() {
  return (
    <section id="waitlist" className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of students already on our waitlist and be the first 
            to experience AI-powered personalized study planning.
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
} 