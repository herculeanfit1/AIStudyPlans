'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
}

export default function WaitlistForm() {
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for environment detection
  const [isDev, setIsDev] = useState(true);
  
  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  // Check environment on mount
  useEffect(() => {
    // In production, this will be false
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user types
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while joining the waitlist');
      }

      // On success, mark as submitted
      setIsSubmitted(true);
    } catch (err) {
      console.error('Waitlist submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Handle showing thank you message after submission
  if (isSubmitted) {
    return (
      <motion.div
        className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl shadow-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold text-indigo-700 mb-2">Thank you for joining!</h3>
          <p className="text-gray-600 mb-6">
            We'll notify you when we launch. In the meantime, check your inbox for a confirmation email.
          </p>
          <div className="inline-block bg-white p-4 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-indigo-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto"
    >
      <motion.h3 
        variants={itemVariants}
        className="text-2xl font-semibold text-center text-gray-800 mb-6"
      >
        Join our waitlist
      </motion.h3>
      
      {error && (
        <motion.div 
          className="bg-red-50 text-red-700 p-4 rounded-lg mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
      
      <motion.form onSubmit={handleSubmit} variants={itemVariants}>
        <div className="mb-5">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              validationErrors.name ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            placeholder="Your name"
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>
        
        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            placeholder="you@example.com"
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>
        
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition-colors ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Join Waitlist'
          )}
        </motion.button>
      </motion.form>
      
      {/* Admin notice about email configuration - only in development */}
      {isDev && (
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <h4 className="font-semibold mb-1">⚠️ Administrator Notice</h4>
          <p className="mb-2">
            Email delivery requires proper configuration:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Set <code className="bg-amber-100 px-1 rounded">RESEND_API_KEY</code> in <code className="bg-amber-100 px-1 rounded">.env.local</code></li>
            <li>Verify email domain in Resend dashboard</li>
            <li>For testing, use <code className="bg-amber-100 px-1 rounded">delivered@resend.dev</code></li>
          </ul>
          <p className="mt-2 text-xs">
            This notice is only visible in development mode.
          </p>
        </div>
      )}
    </motion.div>
  );
}