'use client';

import { useState } from 'react';

export default function WaitlistForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    educationLevel: '',
    agreedToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // In a real app, we'd make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Success!
      setSubmitResult({
        success: true,
        message: 'Thank you for joining our waitlist! We\'ll be in touch soon.'
      });
      
      // Reset form data
      setFormData({
        name: '',
        email: '',
        educationLevel: '',
        agreedToTerms: false
      });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="bg-indigo-600 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join the SchedulEd Waitlist</h2>
          <p className="text-xl text-indigo-100 mb-10">
            Be the first to get access when we launch. We're currently in the final stages of development and will be inviting users in soon.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-xl">
            {submitResult ? (
              <div className={`p-4 rounded-md mb-6 ${submitResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-medium">{submitResult.message}</p>
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="educationLevel" className="block text-gray-700 text-sm font-medium mb-2">
                  Education Level
                </label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="" disabled>Select your education level</option>
                  <option value="middle-school">Middle School</option>
                  <option value="high-school">High School</option>
                  <option value="college">College/University</option>
                  <option value="graduate">Graduate School</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 mr-2"
                    required
                  />
                  <span className="text-gray-700 text-sm">
                    I am at least 13 years old and agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
                  </span>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-75"
              >
                {isSubmitting ? 'Submitting...' : 'Join the Waitlist'}
              </button>
              
              <p className="text-sm text-gray-500 text-center">
                We'll never share your email with anyone else.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 