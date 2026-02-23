'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Client component that uses search params
function FeedbackFormContent() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get('userId');
  const emailId = searchParams?.get('emailId');
  
  const [feedbackType, setFeedbackType] = useState<'feature_request' | 'general' | 'improvement' | 'bug'>('general');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      console.error('❌ Missing user ID');
      setSubmitStatus('error');
      setErrorMessage('Missing user ID. Please use the link from your email.');
      return;
    }
    
    if (!feedbackText.trim()) {
      console.error('❌ Missing feedback text');
      setSubmitStatus('error');
      setErrorMessage('Please enter your feedback before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Use the proper API endpoint instead of calling Supabase directly
      const response = await fetch('/feedback/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId, 10),
          feedbackText: feedbackText.trim(),
          feedbackType,
          rating,
          emailId: emailId || undefined
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        setFeedbackText('');
        setRating(undefined);
        setFeedbackType('general');
      } else {
        console.error('❌ API returned failure:', result.message);
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Server failed to process feedback.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('💥 Exception during feedback submission:', error);
      setSubmitStatus('error');
      setErrorMessage(message || 'Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset error message when user starts typing again
  useEffect(() => {
    if (submitStatus === 'error' && feedbackText) {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  }, [feedbackText, submitStatus]);
  
  // Generate star rating component
  const renderStarRating = () => {
    return (
      <div className="flex space-x-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-2xl focus:outline-none"
            aria-label={`Rate ${star} stars`}
          >
            {star <= (rating || 0) ? (
              <span className="text-yellow-400">★</span>
            ) : (
              <span className="text-gray-300">☆</span>
            )}
          </button>
        ))}
      </div>
    );
  };
  
  // Get the appropriate title based on the email ID
  const getTitle = () => {
    switch (emailId) {
      case 'feedback1':
        return 'What features would you like to see?';
      case 'feedback2':
        return 'What challenges do you face with study planning?';
      case 'feedback3':
        return 'How would you design your ideal study tool?';
      case 'feedback4':
        return 'Final thoughts before launch?';
      default:
        return 'Share your feedback';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/SchedulEd_new_logo.png" 
              alt="SchedulEd Logo" 
              className="h-[120px] cursor-default"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            {getTitle()}
          </h2>
          
          {submitStatus === 'success' ? (
            <div className="rounded-md bg-green-50 p-6 my-6 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">Feedback submitted successfully!</h3>
                  <p className="mt-2 text-sm text-green-700">
                    Thank you for your valuable feedback about "{feedbackType.replace('_', ' ')}". 
                    Your input helps us improve SchedulEd and build features you actually want to use.
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setSubmitStatus('idle');
                        setFeedbackText('');
                        setRating(undefined);
                        setFeedbackType('general');
                      }}
                      className="text-sm bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                    >
                      Submit More Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitStatus === 'error' && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700">
                  Feedback Type
                </label>
                <select
                  id="feedbackType"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value as 'feature_request' | 'general' | 'improvement' | 'bug')}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="general">General Feedback</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="improvement">Improvement Suggestion</option>
                  <option value="bug">Issue or Bug</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                  Your Feedback
                </label>
                <div className="mt-1">
                  <textarea
                    id="feedback"
                    name="feedback"
                    rows={5}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="Please share your thoughts, suggestions, or feature ideas..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {emailId === 'feedback4' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    How would you rate our communications so far?
                  </label>
                  {renderStarRating()}
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading fallback
function FeedbackFormLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-40 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with suspense boundary
export default function FeedbackForm() {
  return (
    <Suspense fallback={<FeedbackFormLoading />}>
      <FeedbackFormContent />
    </Suspense>
  );
} 