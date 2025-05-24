import React from 'react';
import { motion } from 'framer-motion';

interface WaitlistFormStatesProps {
  isSubmitted: boolean;
  error: string | null;
  isDev: boolean;
  isConfigured: boolean;
}

/**
 * Component to handle different states of the waitlist form
 * Shows success messages, errors, and development warnings
 */
export default function WaitlistFormStates({ 
  isSubmitted, 
  error, 
  isDev, 
  isConfigured 
}: WaitlistFormStatesProps) {
  // Success state
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
      >
        <div className="text-green-600 mb-2">
          <i className="fas fa-check-circle text-2xl" aria-hidden="true"></i>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Thanks for joining our waitlist!
        </h3>
        <p className="text-green-700">
          We'll keep you updated on our progress and let you know as soon as SchedulEd is ready.
        </p>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
      >
        <div className="flex items-start">
          <div className="text-red-600 mr-3 mt-1">
            <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
          </div>
          <div>
            <h4 className="text-red-800 font-medium mb-1">
              Submission Error
            </h4>
            <p className="text-red-700 text-sm">
              {error}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Development warnings
  if (isDev && !isConfigured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4"
      >
        <div className="flex items-start">
          <div className="text-yellow-600 mr-3 mt-1">
            <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
          </div>
          <div>
            <h4 className="text-yellow-800 font-medium mb-1">
              Development Mode
            </h4>
            <p className="text-yellow-700 text-sm">
              Email notifications are not configured. Form submissions will be saved locally.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
} 