import React, { ChangeEvent } from 'react';

interface FormData {
  name: string;
  email: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface WaitlistFormFieldsProps {
  formData: FormData;
  validationErrors: ValidationErrors;
  isSubmitting: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Form fields component for the waitlist form
 * Handles input rendering and validation display
 */
export default function WaitlistFormFields({ 
  formData, 
  validationErrors, 
  isSubmitting, 
  onChange 
}: WaitlistFormFieldsProps) {
  return (
    <>
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          disabled={isSubmitting}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${validationErrors.name 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300'
            }
          `}
          placeholder="Enter your full name"
          required
          aria-describedby={validationErrors.name ? "name-error" : undefined}
        />
        {validationErrors.name && (
          <p id="name-error" className="text-sm text-red-600" role="alert">
            {validationErrors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          disabled={isSubmitting}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${validationErrors.email 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300'
            }
          `}
          placeholder="Enter your email address"
          required
          aria-describedby={validationErrors.email ? "email-error" : undefined}
        />
        {validationErrors.email && (
          <p id="email-error" className="text-sm text-red-600" role="alert">
            {validationErrors.email}
          </p>
        )}
      </div>
    </>
  );
} 