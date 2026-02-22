import { z } from 'zod';

/**
 * Schema for the waitlist signup form data
 */
export const waitlistSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .trim(),
  email: z.string()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" })
    .email({ message: "Please enter a valid email address" })
    .trim()
    .toLowerCase(),
  source: z.string()
    .max(100, { message: "Source must be less than 100 characters" })
    .optional()
    .default("website")
    .transform(val => val || "website")
});

/**
 * Type for the validated waitlist form data
 */
export type WaitlistInput = z.infer<typeof waitlistSchema>;

/**
 * Schema for the contact form data
 */
export const contactSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .trim(),
  email: z.string()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" })
    .email({ message: "Please enter a valid email address" })
    .trim()
    .toLowerCase(),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" })
    .trim(),
  subject: z.string()
    .max(200, { message: "Subject must be less than 200 characters" })
    .optional()
    .default("Contact Form Submission")
});

/**
 * Type for the validated contact form data
 */
export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Schema for the sales contact form data
 */
export const salesContactSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .trim(),
  email: z.string()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" })
    .email({ message: "Please enter a valid email address" })
    .trim()
    .toLowerCase(),
  company: z.string()
    .max(200, { message: "Company must be less than 200 characters" })
    .optional(),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" })
    .trim(),
});

export type SalesContactInput = z.infer<typeof salesContactSchema>;

/**
 * Schema for the support contact form data
 */
export const supportContactSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .trim(),
  email: z.string()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" })
    .email({ message: "Please enter a valid email address" })
    .trim()
    .toLowerCase(),
  subject: z.string()
    .max(200, { message: "Subject must be less than 200 characters" })
    .optional(),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" })
    .trim(),
  issueType: z.string()
    .max(50, { message: "Issue type must be less than 50 characters" })
    .optional(),
});

export type SupportContactInput = z.infer<typeof supportContactSchema>;

/**
 * Schema for feedback form data
 */
export const feedbackSchema = z.object({
  feedbackText: z.string()
    .min(1, { message: "Feedback text is required" })
    .max(2000, { message: "Feedback must be less than 2000 characters" })
    .trim(),
  feedbackType: z.enum(["feature_request", "general", "improvement", "bug"], {
    errorMap: () => ({ message: "Invalid feedback type" })
  }),
  rating: z.number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" })
    .optional(),
  emailId: z.string()
    .uuid({ message: "Invalid email ID format" })
    .optional()
});

/**
 * Type for the validated feedback form data
 */
export type FeedbackInput = z.infer<typeof feedbackSchema>;

/**
 * Validates user input against a schema
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns A result object with success status and data or error
 */
export function validateInput<T>(schema: z.ZodType<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: { [key: string]: string };
} {
  try {
    const validData = schema.parse(data);
    return {
      success: true,
      data: validData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert ZodError to a more friendly format
      const fieldErrors: { [key: string]: string } = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      
      return {
        success: false,
        error: fieldErrors
      };
    }
    
    // For other types of errors, return a generic error
    return {
      success: false,
      error: { _form: "Invalid input data" }
    };
  }
} 