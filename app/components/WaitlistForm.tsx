'use client';

import { useState } from 'react';

export default function WaitlistForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubmitResult({
          success: true,
          message: 'Thank you for joining our waitlist! We\'ll be in touch soon.'
        });
        
        // Reset form data
        setFormData({
          name: '',
          email: '',
        });
      } else {
        setSubmitResult({
          success: false,
          message: data.error || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-16 md:py-24 bg-indigo-600">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Waitlist</h2>
          <p className="text-xl text-indigo-100 mb-10">
            Be the first to know when we launch. Get exclusive early access to our AI-powered study plan platform.
          </p>
          
          <div className="bg-white p-8 rounded-xl shadow-xl">
            {submitResult && (
              <div className={`p-4 rounded-md mb-6 ${submitResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-medium">{submitResult.message}</p>
              </div>
            )}
            
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
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-75"
              >
                {isSubmitting ? 'Submitting...' : 'Join the Waitlist'}
              </button>
              
              <p className="text-sm text-gray-500 text-center">
                We'll never share your information with anyone else.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 