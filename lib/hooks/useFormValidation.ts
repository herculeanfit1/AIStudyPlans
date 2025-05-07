import { useState } from 'react';
import { z } from 'zod';

/**
 * Custom hook for form validation using Zod schemas
 * @param schema The Zod schema to validate against
 * @returns Validation state and functions
 */
export function useFormValidation<T>(schema: z.ZodType<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  /**
   * Validates data against the schema
   * @param data Data to validate
   * @returns Object with validation result and validated data if successful
   */
  const validate = (data: unknown): { isValid: boolean; data?: T } => {
    try {
      const validData = schema.parse(data);
      setErrors({});
      return { isValid: true, data: validData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
      return { isValid: false };
    }
  };
  
  /**
   * Validates a single field against the schema
   * @param field Field name to validate
   * @param value Field value to validate
   * @returns True if valid, false otherwise
   */
  const validateField = (field: string, value: unknown): boolean => {
    try {
      // Create a partial schema with just this field
      const partialSchema = z.object({ [field]: schema.shape[field] });
      partialSchema.parse({ [field]: value });
      
      // Clear error for this field if it exists
      if (errors[field]) {
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
      }
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors((prevErrors) => ({ ...prevErrors, ...fieldErrors }));
      }
      return false;
    }
  };
  
  /**
   * Clears all validation errors
   */
  const clearErrors = () => {
    setErrors({});
  };
  
  return { 
    errors, 
    validate, 
    validateField, 
    clearErrors,
    hasErrors: Object.keys(errors).length > 0 
  };
} 