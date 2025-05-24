"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWaitlistForm } from "@/app/hooks/useWaitlistForm";
import WaitlistFormFields from "./waitlist/WaitlistFormFields";
import WaitlistFormStates from "./waitlist/WaitlistFormStates";

/**
 * Main waitlist form component
 * Handles user registration for the SchedulEd waitlist
 */
export default function WaitlistForm() {
  const {
    formData,
    isSubmitting,
    isSubmitted,
    error,
    isDev,
    isConfigured,
    validationErrors,
    handleChange,
    handleSubmit,
  } = useWaitlistForm();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* State Messages (Success, Error, Dev Warning) */}
      <WaitlistFormStates
        isSubmitted={isSubmitted}
        error={error}
        isDev={isDev}
        isConfigured={isConfigured}
      />

      {/* Form - Hide when submitted */}
      {!isSubmitted && (
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Join the Waitlist
            </h3>
            <p className="text-gray-600 text-sm">
              Be the first to know when SchedulEd launches
            </p>
          </div>

          {/* Form Fields */}
          <WaitlistFormFields
            formData={formData}
            validationErrors={validationErrors}
            isSubmitting={isSubmitting}
            onChange={handleChange}
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }
            `}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Joining Waitlist...
              </div>
            ) : (
              "Join Waitlist"
            )}
          </motion.button>

          {/* Privacy Notice */}
          <p className="text-xs text-gray-500 text-center">
            By joining our waitlist, you agree to receive updates about SchedulEd.
            We respect your privacy and won't spam you.
          </p>
        </motion.form>
      )}
    </div>
  );
}
