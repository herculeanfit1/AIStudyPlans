'use client';

import { useEffect } from 'react';

export default function WaitlistForm() {
  useEffect(() => {
    // Form submission handling
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = (document.getElementById('name') as HTMLInputElement)?.value;
        const email = (document.getElementById('email') as HTMLInputElement)?.value;
        const educationLevel = (document.getElementById('education-level') as HTMLSelectElement)?.value;
        
        // Here you would typically send this data to your backend
        // For now, we'll just show an alert
        alert(`Thanks ${name}! You've been added to our waitlist. We'll email you at ${email} when we launch.`);
        
        // Reset form
        this.reset();
      });
    }
  }, []);

  return (
    <form className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-auto">
      <div className="mb-6">
        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
        <input 
          type="text" 
          id="name" 
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          placeholder="Your name" 
          required 
        />
      </div>
      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
        <input 
          type="email" 
          id="email" 
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          placeholder="you@example.com" 
          required 
        />
      </div>
      <div className="mb-6">
        <label htmlFor="education-level" className="block text-gray-700 text-sm font-medium mb-2">Education Level</label>
        <select 
          id="education-level" 
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          required
        >
          <option value="" disabled selected>Select your education level</option>
          <option value="middle-school">Middle School</option>
          <option value="high-school">High School</option>
          <option value="college">College/University</option>
          <option value="graduate">Graduate School</option>
          <option value="professional">Professional</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="flex items-center">
          <input 
            type="checkbox" 
            className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 mr-2" 
            required 
          />
          <span className="text-gray-700 text-sm">
            I am at least 13 years old and agree to the{' '}
            <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
          </span>
        </label>
      </div>
      <button 
        type="submit" 
        className="w-full px-6 py-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
      >
        Join the Waitlist
      </button>
    </form>
  );
} 