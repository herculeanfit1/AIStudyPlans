# Zod Installation and Usage Checklist

This document outlines the steps to properly install and use Zod for validation throughout the SchedulEd application.

## Installation

- [x] Install Zod as a production dependency
  ```bash
  npm install zod@3.22.4
  ```

- [ ] Add Zod to `tsconfig.json` for better type inference
  ```json
  {
    "compilerOptions": {
      // ...existing options
      "strict": true,
      "strictNullChecks": true
    }
  }
  ```

## Schema Creation

- [x] Create a central validation file (`lib/validation.ts`)
- [x] Define schemas for all form types:
  - [x] Waitlist signup form
  - [x] Contact form
  - [x] Feedback form
  - [ ] User registration form
  - [ ] User profile form
  - [ ] Course creation form
  - [ ] Study plan form

## API Route Integration

- [x] Add validation to API routes:
  - [x] Waitlist signup
  - [ ] Contact form submission
  - [ ] Feedback submission
  - [ ] User registration
  - [ ] User profile update
  - [ ] Course creation
  - [ ] Study plan creation/update

## Client-Side Integration

- [ ] Create client-side validation hooks:
  ```typescript
  // hooks/useFormValidation.ts
  import { useState } from 'react';
  import { z } from 'zod';
  
  export function useFormValidation<T>(schema: z.ZodType<T>) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    
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
    
    return { errors, validate };
  }
  ```

- [ ] Integrate validation with forms:
  - [ ] Waitlist form
  - [ ] Contact form
  - [ ] Feedback form
  - [ ] User registration form
  - [ ] User profile form
  - [ ] Course creation form
  - [ ] Study plan form

## Testing

- [ ] Create unit tests for all schemas
  ```typescript
  // __tests__/validation.test.ts
  import { waitlistSchema, contactSchema, feedbackSchema } from '../lib/validation';
  
  describe('Validation Schemas', () => {
    describe('waitlistSchema', () => {
      it('validates correct data', () => {
        const validData = {
          name: 'John Doe',
          email: 'john@example.com',
          source: 'website'
        };
        expect(() => waitlistSchema.parse(validData)).not.toThrow();
      });
      
      it('rejects invalid data', () => {
        const invalidData = {
          name: '',
          email: 'not-an-email',
          source: 'website'
        };
        expect(() => waitlistSchema.parse(invalidData)).toThrow();
      });
    });
    
    // Additional tests for other schemas
  });
  ```

## Security Considerations

- [ ] Ensure validation is performed server-side even when client-side validation exists
- [ ] Implement rate limiting for all validated endpoints
- [ ] Add CSRF protection for form submissions
- [ ] Sanitize data after validation for XSS protection

## Documentation

- [ ] Document all schemas in code comments
- [ ] Create usage examples for the validation library
- [ ] Add validation to API documentation

## Maintenance

- [ ] Keep Zod up to date but verify compatibility with TypeScript version
- [ ] Review schemas when data models change
- [ ] Extend validation as new features are added 