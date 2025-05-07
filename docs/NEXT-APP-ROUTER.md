# Next.js App Router Implementation

This document provides a comprehensive overview of the Next.js App Router implementation in the AIStudyPlans (SchedulEd) application, based on the codebase analysis performed on 2023-11-20.

## Overview

The AIStudyPlans application uses Next.js 14 with the App Router architecture, which represents a significant evolution from the Pages Router. The App Router provides several advantages:

1. **Server Components**: Default React Server Components for improved performance
2. **File-based Routing**: Intuitive file system-based routing with special files
3. **Nested Layouts**: Support for nested layouts that persist across routes
4. **Loading & Error States**: Built-in loading and error UI patterns
5. **Route Handlers**: API endpoints integrated into the routing system

## Directory Structure

The application follows the Next.js 14 App Router convention with the following structure:

```
app/
├── api/                   # API route handlers
├── admin/                 # Admin dashboard routes
├── landing/               # Landing page routes
├── dashboard/             # User dashboard routes
├── components/            # App-specific components
├── lib/                   # App-specific utilities
├── context/               # React context providers
├── styles/                # Global styles
├── page.tsx               # Root page (/)
├── layout.tsx             # Root layout (applies to all routes)
├── providers.tsx          # Client-side providers wrapper
├── globals.css            # Global CSS
└── error.tsx              # Global error boundary
```

Key non-route directories outside the `app` directory:

```
components/               # Shared components used across the app
lib/                      # Shared utilities and data access functions
styles/                   # Additional styles
public/                   # Static assets
```

## Server vs. Client Components

The application strategically uses Server and Client Components:

### Server Components (Default)

- **Route Components**: Most page.tsx files are server components
- **Data Fetching**: Components that fetch data directly
- **Database Access**: Components that interact with the database
- **Environment Variables**: Components that use server-side env variables

### Client Components

Client components are marked with the `'use client'` directive at the top of the file:

```tsx
'use client';

import { useState } from 'react';
// Component implementation...
```

Client components are used for:

- **Interactive Elements**: Components with user interactions
- **Event Handlers**: Components with event listeners
- **Browser APIs**: Components using browser-only APIs
- **Hooks**: Components using React hooks like useState
- **Context Providers**: Components providing React context

## Layouts and Nested Routing

The application implements a hierarchical layout structure:

1. **Root Layout** (`app/layout.tsx`):
   - Sets up the HTML and body structure
   - Includes global providers (AuthProvider, ThemeProvider)
   - Loads global stylesheets and fonts

2. **Section Layouts**:
   - Admin section layout (`app/admin/layout.tsx`)
   - Dashboard layout (`app/dashboard/layout.tsx`)

3. **Page-specific Layouts**:
   - Individual page layouts as needed

## Special Files

The application uses Next.js 14 special files:

1. **page.tsx**: Defines the UI for a route
2. **layout.tsx**: Defines shared UI for a segment and its children
3. **error.tsx**: Error boundary for a segment
4. **loading.tsx**: Loading UI for a segment
5. **not-found.tsx**: UI for 404 errors
6. **route.ts**: API endpoint handlers

## Data Fetching Patterns

The application uses multiple data fetching strategies:

1. **Server Component Data Fetching**:
   ```tsx
   // In a Server Component (page.tsx)
   async function getData() {
     const res = await fetch('https://api.example.com/data');
     return res.json();
   }
   
   export default async function Page() {
     const data = await getData();
     return <main>{/* Use data */}</main>;
   }
   ```

2. **Client-side Data Fetching**:
   ```tsx
   'use client';
   
   import { useState, useEffect } from 'react';
   
   export default function ClientComponent() {
     const [data, setData] = useState(null);
     
     useEffect(() => {
       fetch('/api/example')
         .then(res => res.json())
         .then(data => setData(data));
     }, []);
     
     return <div>{/* Use data */}</div>;
   }
   ```

3. **React Server Component Proposal (RSCP) Pattern**:
   - Server components fetch data and pass it to client components as props
   - Avoids redundant fetch calls and reduces client-side JavaScript

## Loading and Error States

The application implements the following loading and error UI patterns:

1. **Loading States**:
   ```tsx
   // app/dashboard/loading.tsx
   export default function Loading() {
     return <div>Loading dashboard...</div>;
   }
   ```

2. **Error Handling**:
   ```tsx
   // app/error.tsx
   'use client';
   
   import { useEffect } from 'react';
   
   export default function Error({
     error,
     reset,
   }: {
     error: Error;
     reset: () => void;
   }) {
     useEffect(() => {
       console.error(error);
     }, [error]);
   
     return (
       <div>
         <h2>Something went wrong!</h2>
         <button onClick={reset}>Try again</button>
       </div>
     );
   }
   ```

## Authentication Integration

The application integrates authentication with Next.js App Router:

1. **Auth Provider** in `app/providers.tsx`:
   ```tsx
   'use client';
   
   import { ThemeProvider } from 'next-themes';
   import { ReactNode } from 'react';
   import AuthProvider from '@/components/auth/Provider';
   
   export function Providers({ children }: ProvidersProps) {
     return (
       <AuthProvider>
         <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
           {children}
         </ThemeProvider>
       </AuthProvider>
     );
   }
   ```

2. **Auth API Routes** in `app/api/auth/[...nextauth]/route.ts`

3. **Protected Routes** using middleware or page-level checks:
   ```tsx
   // Protected page
   import { getServerSession } from 'next-auth';
   
   export default async function ProtectedPage() {
     const session = await getServerSession();
     
     if (!session) {
       redirect('/login');
     }
     
     return <div>Protected content</div>;
   }
   ```

## Static and Dynamic Rendering

The application uses both static and dynamic rendering:

1. **Static Rendering** (default):
   - Landing pages and marketing content
   - Pages without user-specific data

2. **Dynamic Rendering**:
   - User dashboard with personalized content
   - Admin pages with real-time data
   - Pages that require cookies or request headers

## API Route Implementation

API routes in the App Router use the route.ts convention:

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello World' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Process data
  return NextResponse.json({ success: true });
}
```

## Metadata and SEO

The application implements SEO best practices using Next.js metadata:

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'SchedulEd - Smart Academic Planning for Students',
  description: 'SchedulEd helps students plan their academic journey with AI-powered tools for course selection, scheduling, and degree planning.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  }
};
```

## Environment Configurations

The application handles environment configuration for App Router:

1. **Environment Variables**:
   - Client-side: `NEXT_PUBLIC_*` variables
   - Server-side: Private variables

2. **Development vs. Production**:
   - Different API endpoints
   - Feature flags

## Performance Optimizations

The application implements several performance optimizations:

1. **Component Structure**:
   - Granular components to minimize re-renders
   - Moving interactivity to leaf components

2. **Image Optimization**:
   - Next.js Image component for optimized images
   - Proper sizing and lazy loading

3. **Code Splitting**:
   - Automatic code splitting by route
   - Dynamic imports for large components

## Recommended Improvements

Based on the codebase analysis, these areas could be enhanced:

1. **Streaming and Suspense**:
   - Implement React Suspense for improved loading states
   - Use streaming for large page loads

2. **Route Groups**:
   - Organize routes better with route groups (folders in parentheses)

3. **Parallel Routes**:
   - Use parallel routes for complex dashboard layouts

4. **Enhanced Metadata**:
   - Implement more dynamic and route-specific metadata

5. **Server Actions**:
   - Use Next.js 14 Server Actions for form submissions

## Recommended Next Steps

1. Migrate remaining Pages Router patterns to App Router
2. Implement Suspense boundaries for improved loading experience
3. Add more comprehensive SEO metadata
4. Use Server Actions for form handling
5. Optimize for Core Web Vitals

---

This document provides a foundational understanding of the Next.js App Router implementation in the AIStudyPlans application. For related information, refer to the [API-ARCHITECTURE.md](API-ARCHITECTURE.md) documentation. 