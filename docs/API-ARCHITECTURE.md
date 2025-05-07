# API Architecture & Data Flow

This document provides a comprehensive overview of the API architecture and data flow in the AIStudyPlans (SchedulEd) application, based on the codebase analysis performed on 2023-11-20.

## Overview

The AIStudyPlans application uses a hybrid architecture:

1. **Frontend**: Next.js 14 with App Router for server and client components
2. **Backend**: API routes implemented with Next.js API routes
3. **Database**: Supabase for data storage
4. **Email Service**: Resend for email delivery

The data flow is designed to support both development/testing and production environments with appropriate mocking patterns.

## API Routes Structure

All API routes are organized in the `app/api` directory using the Next.js 14 App Router convention:

```
app/api/
├── auth/
│   └── [...nextauth]/
│       └── route.ts       # Authentication API routes
├── contact/
│   └── route.ts           # Contact form submission
├── health/
│   └── route.ts           # Health check endpoint
├── waitlist/
│   └── route.ts           # Waitlist signup endpoint
└── feedback-campaign/
    └── route.ts           # Feedback collection endpoints
```

Each route file follows a consistent pattern:
- Uses Next.js `NextRequest` and `NextResponse` for request/response handling
- Implements proper error handling with try/catch blocks
- Returns appropriate HTTP status codes and JSON responses
- Includes extensive logging for debugging

## Data Flow Patterns

### 1. Frontend → API → Data Storage Flow

When a user submits data (e.g., waitlist signup), the flow is:

1. **Client Component** (`app/components/WaitlistForm.tsx`)
   - Captures user input
   - Validates form data on the client side
   - Submits data to API endpoint

2. **API Route** (`app/api/waitlist/route.ts`)
   - Receives request with JSON body
   - Validates input data
   - Calls Supabase utility functions

3. **Database Utility** (`lib/supabase.ts`)
   - Processes data and stores in Supabase
   - Returns success/error response
   - Handles mock mode for development

4. **Email Service** (`lib/email.ts`)
   - Sends confirmation emails
   - Sends admin notifications

5. **Response** flows back through the chain to the client

### 2. Mock Mode Implementation

The application implements a "mock mode" for development and testing:

```typescript
// Determine if we're in mock mode
const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

When in mock mode:
- Mock data is used instead of real database calls
- In-memory storage (`realFeedbackData` array in `admin-supabase.ts`) simulates database tables
- Email sending is directed to test addresses

This allows for development without a real Supabase instance and prevents accidental data modifications.

## Database Interaction

### Supabase Client Configuration

The Supabase client is initialized in `lib/supabase.ts`:

```typescript
// Initialize Supabase client
const supabase = isMockMode
  ? createMockClient() as any
  : createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
```

### Main Data Models

The application uses the following key data models:

1. **Waitlist Users**:
   ```typescript
   export type WaitlistUser = {
     id: number;
     name: string;
     email: string;
     created_at: string;
     feedback_campaign_started: boolean;
     last_email_sent_at?: string;
     email_sequence_position?: number;
     tags?: string[];
     source?: string;
     notes?: string;
   };
   ```

2. **Feedback Responses**:
   ```typescript
   export interface FeedbackResponse {
     id: string;
     created_at: string;
     feedback_type: string;
     feedback_text: string;
     rating?: number;
     user_id: string;
     platform?: string;
     source_page?: string;
     feature_id?: string;
     custom_fields?: Record<string, any>;
   }
   ```

### CRUD Operations

The application implements consistent patterns for database operations:

1. **Create** operations use `supabase.from('table').insert([data]).select().single()`
2. **Read** operations use `supabase.from('table').select('*').eq('field', value)`
3. **Update** operations use `supabase.from('table').update(data).eq('id', id)`
4. **Delete** operations use `supabase.from('table').delete().eq('id', id)`

All database operations include proper error handling and type checking.

## Authentication Flow

The application uses NextAuth.js for authentication:

1. **Authentication Provider** configuration in `app/providers.tsx`
2. **NextAuth API Routes** in `app/api/auth/[...nextauth]/route.ts`
3. **Protected Routes** using session checking with middleware

For admin access:
- Only allowed emails (from environment variables) can access admin pages
- JWT strategy is used for session management
- Session has an `isAdmin` property for authorization

## Email Service Integration

The application uses Resend for email delivery:

1. **Email Templates** defined in `lib/email-templates.ts`
2. **Email Sending Functions** in `lib/email.ts`
3. **Email Triggering** from API routes (e.g., waitlist signup)

Email delivery is designed to:
- Use a consistent template system
- Support HTML and text versions
- Track delivery success
- Send appropriate notifications to admins

## Environment-Specific Configuration

The application handles different environments:

1. **Development**:
   - Uses mock mode when Supabase credentials are not available
   - Sends emails to test addresses
   - Provides detailed error messages

2. **Production**:
   - Uses real Supabase database
   - Sends emails to actual users
   - Implements security best practices
   - Uses proper error handling without exposing details

Environment variables are properly handled based on the context of execution (server-side vs client-side).

## Common API Patterns

The codebase follows these consistent API patterns:

1. **Input Validation** for all user-submitted data
2. **Proper Error Handling** with try/catch blocks
3. **Consistent Response Format** with `{ success: boolean, error?: string, data?: any }`
4. **Detailed Logging** for debugging and auditing
5. **Type Safety** with TypeScript interfaces and proper type checking

## Areas for Improvement

Based on code analysis, these areas could be enhanced:

1. **API Request Validation**: Implement a more robust validation library
2. **Centralized Error Handling**: Create a unified error handling pattern
3. **Rate Limiting**: Add protection against abuse
4. **Enhanced Type Safety**: Improve TypeScript usage, especially in API responses
5. **Automated API Testing**: Implement comprehensive test coverage

## Recommended Next Steps

1. Implement proper database schema with migrations for production
2. Add comprehensive unit tests for all API endpoints
3. Create API documentation for frontend developers
4. Implement monitoring and alerting for API health

---

This document provides a foundational understanding of the API architecture and data flow in the AIStudyPlans application. For specific API endpoint details, refer to the [API.md](API.md) documentation. 