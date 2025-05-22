'use client';

import { useState, FormEvent } from 'react';

export default function WaitlistIframeTest() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    
    if (!email.trim() || !email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Show success message
    setSubmitted(true);
    
    // Create a POST form submission that doesn't use AJAX
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://formspree.io/f/xdoqpnzr'; // Using Formspree as a temporary form endpoint
    form.target = '_blank'; // Submit to a new tab
    
    // Add name field
    const nameField = document.createElement('input');
    nameField.type = 'hidden';
    nameField.name = 'name';
    nameField.value = name;
    form.appendChild(nameField);
    
    // Add email field
    const emailField = document.createElement('input');
    emailField.type = 'hidden';
    emailField.name = 'email';
    emailField.value = email;
    form.appendChild(emailField);
    
    // Add source field
    const sourceField = document.createElement('input');
    sourceField.type = 'hidden';
    sourceField.name = 'source';
    sourceField.value = 'iframe-test';
    form.appendChild(sourceField);
    
    // Submit the form
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };
  
  if (submitted) {
    return (
      <div className="p-8 max-w-lg mx-auto bg-green-50 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-green-800">Thank You!</h1>
        <p className="mb-4">Your submission has been received. We'll notify you when we launch.</p>
        <p className="text-sm text-green-700">
          Check your email for a confirmation message. If you don't see it, please check your spam folder.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Join Our Waitlist (Alternative Method)</h1>
      <p className="mb-4">This uses a form submission approach that bypasses API issues.</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Join Waitlist
          </button>
        </div>
      </form>
    </div>
  );
} 