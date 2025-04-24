# AIStudyPlans (SchedulEd) Codebase Documentation

## Overview

AIStudyPlans, branded as "SchedulEd," is a Next.js application designed to generate personalized study plans for students using AI. This documentation provides a comprehensive overview of the codebase structure, architecture, and key components.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Email Service**: Resend
- **Animations**: Framer Motion
- **Testing**:
  - Jest and React Testing Library for unit tests
  - Playwright for end-to-end testing
- **Containerization**: Docker & Docker Compose

## Project Structure

```
├── app/                  # Next.js 14 App Router directory
│   ├── api/              # API routes (waitlist)
│   ├── components/       # Client-side components
│   ├── dashboard/        # Dashboard page
│   ├── landing/          # Landing page
│   ├── globals.css       # Global CSS styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── error.tsx         # Error handling
├── components/           # Additional/legacy components
├── lib/                  # Utility functions and services
│   ├── email.ts          # Email service utilities
│   ├── email-templates.ts # Email HTML/text templates
│   └── smoothScroll.ts   # Smooth scrolling utility
├── public/               # Static assets
├── docs/                 # Documentation files
├── e2e/                  # End-to-end tests
├── __tests__/            # Unit tests
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile.dev        # Development Dockerfile
├── Dockerfile.test       # Testing Dockerfile
└── run-docker.sh         # Helper script for Docker operations
```

## Architecture

### Frontend

The application uses the Next.js 14 App Router architecture, which follows a file-system based routing approach:

- `app/page.tsx`: The main entry point for the application
- `app/layout.tsx`: The root layout component that wraps all pages
- `app/components/`: Client-side components used within the application

All interactive components that use React hooks or event handlers are marked with the `'use client'` directive to properly function in the Next.js 14 App Router.

### Backend Services

#### API Routes

- **Waitlist API** (`/app/api/waitlist/route.ts`): 
  - Handles POST requests with user name and email
  - Validates the input data
  - Sends a confirmation email using the Resend service
  - Returns appropriate JSON responses

#### Email Service

- **Email Service** (`/lib/email.ts`):
  - Initializes the Resend client with API key from environment variables
  - Provides functions for sending various types of emails:
    - `sendEmail`: Base function that handles the actual email sending
    - `sendWaitlistConfirmationEmail`: Sends a welcome email to new waitlist signups
    - `sendPasswordResetEmail`: Sends password reset emails (prepared for future authentication)

- **Email Templates** (`/lib/email-templates.ts`):
  - Contains HTML and text versions of email templates
  - Supports dynamic content insertion
  - Responsive design for email clients

## Key Components

### Landing Page Components

1. **Header** (`app/components/Header.tsx`):
   - Navigation menu with responsive mobile view
   - Links to key sections of the landing page

2. **Hero** (`app/components/Hero.tsx`):
   - Main banner with value proposition
   - Visual preview of a sample study plan
   - Call-to-action buttons

3. **Features** (`app/components/Features.tsx`):
   - Highlights key product features
   - Visual icons with descriptions

4. **Pricing** (`app/components/Pricing.tsx`):
   - Displays subscription tiers (Basic, Pro, Premium, Enterprise)
   - Toggle between monthly and annual billing
   - Feature comparison between plans

5. **FAQ** (`app/components/FAQ.tsx`):
   - Accordion-style frequently asked questions
   - Client-side interactivity for expanding/collapsing

6. **WaitlistForm** (`app/components/WaitlistForm.tsx`):
   - Form for collecting user information pre-launch
   - Client-side validation
   - Submission handling with API integration
   - Visual feedback for form state
   - Animation effects using Framer Motion

7. **Footer** (`app/components/Footer.tsx`):
   - Site links and information
   - Social media links
   - Copyright information

### API Implementation

The waitlist API (`app/api/waitlist/route.ts`) follows these steps:

1. Receives a POST request with user data
2. Validates the request data (required fields, email format)
3. Logs the signup information (would store in database in production)
4. Sends a confirmation email using the email service
5. Returns a success/error response

## Email Configuration

The email service is configured to use the Resend API:

- **From Address**: `lindsey@aistudyplans.com`
- **Reply-To Address**: `support@aistudyplans.com`
- **Environment Variables**:
  - `RESEND_API_KEY`: API key for the Resend service
  - `EMAIL_FROM`: Custom from address (optional)
  - `EMAIL_REPLY_TO`: Custom reply-to address (optional)
  - `NEXT_PUBLIC_APP_URL`: Base URL of the application

## CSS and Styling

The application uses Tailwind CSS for styling, with custom components and utilities defined in `app/globals.css`:

- **Global Styles**: Basic reset, variables, and fonts
- **Animation Classes**: Fade-in and fade-in-up animations
- **Custom Components**: Buttons, cards, pricing tiers, etc.
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## Testing Setup

The project includes a comprehensive testing infrastructure:

- **Unit Tests**: Jest and React Testing Library
- **End-to-End Tests**: Playwright
- **Docker Testing**: Dedicated Dockerfile.test for consistent testing environment

## Deployment and Docker

The application is containerized for consistent development and deployment:

- **Development Container** (`Dockerfile.dev`):
  - Node.js 18 Alpine base
  - Development dependencies
  - Hot reloading

- **Testing Container** (`Dockerfile.test`):
  - Node.js 18 Alpine base
  - Testing dependencies including Chromium
  - Configuration for Playwright tests

- **Docker Compose** (`docker-compose.yml`):
  - Development service
  - Testing service
  - Volume mapping for code changes

## Current Status and Limitations

The application is currently in the initial development phase with the following limitations:

1. **Authentication**: Not yet implemented (planned for future)
2. **Database Integration**: Not implemented (waitlist entries are logged but not stored)
3. **AI Study Plan Generation**: Not implemented (only static UI mockups)
4. **User Dashboard**: Basic structure only, no functionality

## Environment Configuration

Required environment variables for full functionality:

```
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Lindsey <lindsey@aistudyplans.com>
EMAIL_REPLY_TO=support@aistudyplans.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` file with required environment variables
4. Run the development server: `npm run dev`
5. Access the site at http://localhost:3000

### Using Docker

Run the provided Docker script:
```bash
./run-docker.sh start
```

## Next Development Steps

1. Implement user authentication
2. Set up database connectivity
3. Create study plan generation API with AI integration
4. Implement study plan management features
5. Connect frontend components to backend services 