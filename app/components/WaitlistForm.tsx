"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { waitlistSchema, validateInput } from "@/lib/validation";

interface FormData {
  name: string;
  email: string;
}

interface ValidationErrors {
  [key: string]: string;
}

// Add a function to save waitlist entries locally as a backup
const saveEntryLocally = (entry: { name: string; email: string }) => {
  try {
    // Get existing entries
    const existingEntriesJson = localStorage.getItem("waitlist_entries");
    const entries = existingEntriesJson ? JSON.parse(existingEntriesJson) : [];

    // Add new entry
    entries.push({
      ...entry,
      timestamp: new Date().toISOString(),
      saved_locally: true,
    });

    // Save back to localStorage
    localStorage.setItem("waitlist_entries", JSON.stringify(entries));
    return true;
  } catch (e) {
    return false;
  }
};

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
  const [isConfigured, setIsConfigured] = useState(false);

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Check environment and configuration on mount
  useEffect(() => {
    // In production, this will be false
    setIsDev(process.env.NODE_ENV === "development");
    
    // Check if Resend is configured via public environment variable
    setIsConfigured(process.env.NEXT_PUBLIC_RESEND_CONFIGURED === "true");
  }, []);

  const validateForm = (): boolean => {
    // Use Zod validation for consistent validation across frontend and backend
    const validation = validateInput(waitlistSchema, {
      name: formData.name,
      email: formData.email,
      source: "website-form"
    });

    if (!validation.success) {
      // For debugging in production - log the actual validation errors
      console.log("Form validation failed:", validation.error);
      
      // Set validation errors from Zod validation result
      setValidationErrors(validation.error || {});
      return false;
    }

    console.log("Form validation passed successfully");
    // Clear validation errors if validation passes
    setValidationErrors({});
    return true;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      console.log("Form validation failed in handleSubmit");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Check if email services are configured by querying our API
      console.log("Checking email configuration status...");
      const configCheck = await fetch("/api/email-config");
      const configData = await configCheck.json();
      
      // Track whether email is configured
      const emailConfigured = configData.configured;
      console.log(`Email configuration status: ${emailConfigured ? 'Configured' : 'Not Configured'}`);

      // Log what we're about to do
      console.log(`Submitting waitlist form for ${formData.email}`);

      // First, save the entry locally as a backup
      saveEntryLocally({
        name: formData.name,
        email: formData.email,
      });

      // API call to submit the form - trying explicit API call first
      try {
        console.log("Making direct API call to waitlist endpoint");
        const apiResponse = await fetch("/api/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            source: "website-form"
          }),
        });
        
        // If the API responds with an error, log it
        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          console.error("API response error:", errorData);
          if (errorData.validation_errors) {
            // Clear existing validation messages and set the ones from the server
            setValidationErrors(errorData.validation_errors);
            
            // Set a more user-friendly error message depending on the error type
            if (errorData.validation_errors.email) {
              setError("Please enter a valid email address.");
            } else if (errorData.validation_errors.name) {
              setError("Please enter your name to join the waitlist.");
            } else {
              setError("Please fix the validation errors and try again.");
            }
            setIsSubmitting(false);
            return;
          } else {
            throw new Error(errorData.error || "API error");
          }
        } else {
          const successData = await apiResponse.json();
          console.log("API success:", successData);
          setIsSubmitted(true);
          return;
        }
      } catch (apiError) {
        console.error("Direct API call failed:", apiError);
        // Continue with Supabase as fallback if API call fails
      }

      // Create Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

      console.log(
        `Supabase URL available: ${!!supabaseUrl}, Key available: ${!!supabaseKey}`,
      );

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase configuration is missing");
      }

      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
        },
      });
      console.log("Supabase client created, attempting to insert data");

      // Insert the waitlist entry directly into Supabase
      const { data, error: dbError } = await supabase
        .from("waitlist_users")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            source: "website-direct",
            feedback_campaign_started: false,
          },
        ])
        .select();

      if (dbError) {
        console.error("Database error details:", {
          code: dbError.code,
          message: dbError.message,
          details: dbError.details,
          hint: dbError.hint,
        });

        // Check if this is a duplicate entry
        if (dbError.code === "23505") {
          // PostgreSQL unique constraint violation
          // Still mark as success for UX purposes - they're on the list already
          console.log("User already on waitlist, treating as success");
          setIsSubmitted(true);
          return;
        }

        // Show more specific error message based on the error code
        if (dbError.code === "42P01") {
          throw new Error("Table does not exist. Please contact support.");
        } else if (dbError.code === "28000" || dbError.code === "28P01") {
          throw new Error("Authentication failed. Please contact support.");
        } else if (dbError.code === "42501") {
          throw new Error("Permission denied. Please contact support.");
        } else {
          throw new Error(`Failed to join waitlist: ${dbError.message}`);
        }
      }

      console.log("Successfully added to waitlist:", data);
      
      // If email is configured, call the API to send notification emails
      if (emailConfigured) {
        try {
          console.log("Calling waitlist API to send email notifications");
          const emailResponse = await fetch("/api/waitlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              source: "website-form"
            }),
          });
          
          if (emailResponse.ok) {
            console.log("API notification successful, emails should be sent");
          } else {
            console.warn("API notification failed but user was added to database");
          }
        } catch (emailError) {
          console.error("Error sending email notifications:", emailError);
          // Don't throw here, we still want to show success since the DB entry was created
        }
      } else {
        console.warn("Email not configured, skipping email notifications");
      }

      // On success, mark as submitted
      setIsSubmitted(true);
      
      // Track successful conversion for analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "waitlist_signup", {
          event_category: "engagement",
          event_label: formData.email,
        });
      }
    } catch (error: any) {
      console.error("Error handling waitlist submission:", error);
      setError(error.message || "An error occurred. Please try again later.");
      
      // Track error for analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "waitlist_error", {
          event_category: "error",
          event_label: error.message,
        });
      }
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
            We'll notify you when we launch. You'll receive an email
            confirmation shortly. Thanks for your interest in AI Study Plans!
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

  // Only show admin notice in development or if explicitly not configured
  // We don't want to show admin notices in production
  const showAdminNotice = isDev && !isConfigured;

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
                Now using direct Supabase integration for waitlist:
              </p>
              <ul className="mt-2 text-sm text-amber-700 list-disc list-inside">
                <li>
                  Set{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded">
                    NEXT_PUBLIC_SUPABASE_URL
                  </code>{" "}
                  and{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded">
                    NEXT_PUBLIC_SUPABASE_ANON_KEY
                  </code>
                </li>
                <li>Ensure the waitlist table exists in Supabase</li>
                <li>
                  Set{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded">
                    NEXT_PUBLIC_RESEND_CONFIGURED
                  </code>{" "}
                  to "true" to hide this notice
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
            aria-invalid={!!validationErrors.name}
            aria-describedby={validationErrors.name ? "name-error" : undefined}
          />
          {validationErrors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600 font-medium">{validationErrors.name}</p>
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
            aria-invalid={!!validationErrors.email}
            aria-describedby={validationErrors.email ? "email-error" : undefined}
          />
          {validationErrors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600 font-medium">
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
