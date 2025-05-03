'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheck } from 'react-icons/fa';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    reason: 'general'
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: false,
        error: true,
        message: 'Please fill out all required fields.'
      });
      return;
    }
    
    // Simulate form submission
    setFormStatus({
      submitted: true,
      error: false,
      message: 'Thank you for your message! We will respond within 48 hours.'
    });
    
    // In a real app, you would send the data to your API
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //   setFormStatus({
    //     submitted: true,
    //     error: false,
    //     message: 'Thank you for your message! We will respond within 48 hours.'
    //   });
    // })
    // .catch(error => {
    //   setFormStatus({
    //     submitted: false,
    //     error: true,
    //     message: 'There was an error submitting your message. Please try again.'
    //   });
    // });
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions or need support? We're here to help.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <FaMapMarkerAlt className="text-blue-600 text-xl" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Our Location</h3>
          <p className="text-gray-600">
            123 Education Lane<br />
            Learning City, CA 94000<br />
            United States
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <FaPhone className="text-green-600 text-xl" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Phone</h3>
          <p className="text-gray-600 mb-1">Main: (800) 555-1234</p>
          <p className="text-gray-600 mb-1">Support: (800) 555-5678</p>
          <p className="text-gray-600">Hours: 8am - 6pm PST, M-F</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div className="bg-purple-100 p-3 rounded-full mb-4">
            <FaEnvelope className="text-purple-600 text-xl" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Email</h3>
          <p className="text-gray-600 mb-1">
            <a href="mailto:info@aistudyplans.com" className="text-blue-600 hover:underline">
              info@aistudyplans.com
            </a>
          </p>
          <p className="text-gray-600 mb-1">
            <a href="mailto:support@aistudyplans.com" className="text-blue-600 hover:underline">
              support@aistudyplans.com
            </a>
          </p>
          <p className="text-gray-600">
            <a href="mailto:privacy@aistudyplans.com" className="text-blue-600 hover:underline">
              privacy@aistudyplans.com
            </a>
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          
          {formStatus.submitted ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaCheck className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{formStatus.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {formStatus.error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <p className="text-sm text-red-700">{formStatus.message}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  What can we help you with?
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                  <option value="privacy">Privacy Concern</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              
              <div className="text-sm text-gray-500">
                Fields marked with <span className="text-red-500">*</span> are required
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">How do I get started with AI Study Plans?</h3>
              <p className="text-gray-700">
                To get started, simply sign up for an account and complete our learning style assessment. Our AI will then generate a personalized study plan based on your goals and preferences.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">How much does the service cost?</h3>
              <p className="text-gray-700">
                We offer various pricing plans including a free tier with basic features. Visit our <Link href="/pricing" className="text-blue-600 hover:underline">pricing page</Link> to see detailed information about each plan.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">How do I cancel my subscription?</h3>
              <p className="text-gray-700">
                You can cancel your subscription at any time from your account settings. If you need assistance, our support team is happy to help via email or phone.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
              <p className="text-gray-700">
                We take data security and privacy seriously. All user data is encrypted and stored securely. For more information, please review our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Can parents monitor their child's progress?</h3>
              <p className="text-gray-700">
                Yes, we offer parental controls and monitoring features for accounts of users under 18. Visit our <Link href="/parents" className="text-blue-600 hover:underline">For Parents</Link> page to learn more.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Connect With Us on Social Media</h2>
        <p className="text-gray-700 mb-6">
          Stay up to date with the latest features, tips, and educational resources.
        </p>
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-blue-600">
            <span className="sr-only">Facebook</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-400">
            <span className="sr-only">Twitter</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" className="text-gray-600 hover:text-pink-600">
            <span className="sr-only">Instagram</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            <span className="sr-only">LinkedIn</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-600 hover:text-red-600">
            <span className="sr-only">YouTube</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
} 