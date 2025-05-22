"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";

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
    name: "",
    email: "",
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for environment detection
  const [isDev, setIsDev] = useState(true);

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  // Check environment on mount - this only needs to run once when the component initializes
  useEffect(() => {
    // In production, this will be false
    setIsDev(process.env.NODE_ENV === "development");
  }, []);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    // Validate email - very simple check
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else {
      // Simple email check - just look for @ sign
      if (!formData.email.includes("@")) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user types
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log(`Submitting waitlist form for ${formData.email} using Formspree`);
      
      // Set submitted state immediately to show success message
      setIsSubmitted(true);
      
      // Create a POST form submission that doesn't use AJAX
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://formspree.io/f/xdoqpnzr'; // Using Formspree as temporary endpoint
      form.target = '_blank'; // Submit to a new tab
      
      // Add name field
      const nameField = document.createElement('input');
      nameField.type = 'hidden';
      nameField.name = 'name';
      nameField.value = formData.name;
      form.appendChild(nameField);
      
      // Add email field
      const emailField = document.createElement('input');
      emailField.type = 'hidden';
      emailField.name = 'email';
      emailField.value = formData.email;
      form.appendChild(emailField);
      
      // Add source field
      const sourceField = document.createElement('input');
      sourceField.type = 'hidden';
      sourceField.name = 'source';
      sourceField.value = 'website-main';
      form.appendChild(sourceField);
      
      // Submit the form
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      console.log("Waitlist submission sent to Formspree");
    } catch (err) {
      console.error("Waitlist submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again later."
      );
      setIsSubmitted(false); // Reset submission state on error
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
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
          <h3 className="text-2xl font-semibold text-indigo-700 mb-2">
            Thank you for joining!
          </h3>
          <p className="text-gray-600 mb-6">
            We'll notify you when we launch. In the meantime, check your inbox
            for a confirmation email.
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

  // Show admin notice in development only
  const showAdminNotice = isDev;

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

      {showAdminNotice && (
        <motion.div
          className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-amber-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-amber-800">
                Administrator Notice
              </p>
              <p className="mt-1 text-sm text-amber-700">
                Email delivery requires proper configuration:
              </p>
              <ul className="mt-2 text-sm text-amber-700 list-disc list-inside">
                <li>
                  Set{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded">
                    RESEND_API_KEY
                  </code>{" "}
                  in{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded">
                    .env.local
                  </code>
                </li>
                <li>
                  Verify email domain in{" "}
                  <a
                    href="https://resend.com/domains"
                    target="_blank"
                    className="underline hover:text-amber-900"
                  >
                    Resend dashboard
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      <motion.form onSubmit={handleSubmit} variants={itemVariants}>
        <div className="mb-5">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              validationErrors.name ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            placeholder="Your name"
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              validationErrors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            placeholder="you@example.com"
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.email}
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-semibold
            transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Joining...
            </span>
          ) : (
            "Join Waitlist"
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
