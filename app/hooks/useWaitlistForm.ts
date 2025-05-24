import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { waitlistSchema, validateInput } from '@/lib/validation';

interface FormData {
  name: string;
  email: string;
}

interface ValidationErrors {
  [key: string]: string;
}

/**
 * Save waitlist entries locally as a backup
 * @param entry - The waitlist entry to save
 * @returns boolean indicating success
 */
const saveEntryLocally = (entry: { name: string; email: string }): boolean => {
  try {
    const existingEntriesJson = localStorage.getItem("waitlist_entries");
    const entries = existingEntriesJson ? JSON.parse(existingEntriesJson) : [];

    entries.push({
      ...entry,
      timestamp: new Date().toISOString(),
      saved_locally: true,
    });

    localStorage.setItem("waitlist_entries", JSON.stringify(entries));
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Custom hook for managing waitlist form state and submission
 * @returns Object containing form state and handlers
 */
export function useWaitlistForm() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Environment state
  const [isDev, setIsDev] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Initialize environment detection
  useEffect(() => {
    setIsDev(process.env.NODE_ENV === "development");
    setIsConfigured(process.env.NEXT_PUBLIC_RESEND_CONFIGURED === "true");
  }, []);

  /**
   * Validate the form using Zod schema
   * @returns boolean indicating if form is valid
   */
  const validateForm = (): boolean => {
    const validation = validateInput(waitlistSchema, {
      name: formData.name,
      email: formData.email,
      source: "website-form"
    });

    if (!validation.success) {
      console.log("Form validation failed:", validation.error);
      setValidationErrors(validation.error || {});
      return false;
    }

    console.log("Form validation passed successfully");
    setValidationErrors({});
    return true;
  };

  /**
   * Handle input changes
   * @param e - Change event from input
   */
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

  /**
   * Handle form submission
   * @param e - Form submit event
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form validation failed in handleSubmit");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Save entry locally first as backup
      saveEntryLocally({
        name: formData.name,
        email: formData.email,
      });
      
      console.log(`Submitting waitlist form for ${formData.email}`);
      
      // Use the correct API endpoint without trailing slash issues
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/waitlist`
        : "/api/waitlist";
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          source: "website-form"
        }),
      });
      
      if (!response.ok) {
        const responseText = await response.text();
        let errorMessage = responseText;
        
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          console.error("API response is not valid JSON:", responseText);
          if (responseText.length > 100) {
            errorMessage = `${responseText.substring(0, 100)}...`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Handle successful response
      let responseData = {};
      try {
        const responseText = await response.text();
        if (responseText.trim() === '') {
          responseData = { success: true };
        } else {
          responseData = JSON.parse(responseText);
        }
      } catch (jsonError) {
        console.warn("Could not parse success response as JSON, but continuing as success");
        responseData = { success: true };
      }
      
      console.log("API success:", responseData);
      setIsSubmitted(true);
      
      // Track successful conversion for analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "waitlist_signup", {
          event_category: "engagement",
          event_label: formData.email,
        });
      }
    } catch (error: any) {
      console.error("Error in waitlist submission:", error);
      
      // Handle various error types
      if (error.message?.includes("Backend call failure")) {
        setError("Sorry, our server is experiencing issues. We've saved your submission locally and will try to recover it.");
      } else if (error.message?.includes("fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else if (error.message?.length > 100) {
        setError("Sorry, something went wrong. Please try again.");
      } else {
        setError(error.message || "Sorry, something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    formData,
    isSubmitting,
    isSubmitted,
    error,
    isDev,
    isConfigured,
    validationErrors,
    
    // Handlers
    handleChange,
    handleSubmit,
    
    // Utilities
    validateForm,
  };
} 